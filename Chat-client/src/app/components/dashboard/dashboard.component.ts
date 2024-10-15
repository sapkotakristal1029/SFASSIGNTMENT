import { Component, OnInit, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { GroupService } from '../../services/group.service';
import { ChatService } from '../../services/chat.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { localStorageService } from '../../services/localStorage.service';
import { Subscription } from 'rxjs';
import { Signal } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  allGroups: { _id: string; name: string }[] = [];
  userGroups: {
    _id: string;
    name: string;
    channels: { _id: string; name: string }[];
  }[] = [];

  currentUser: {
    id: number;
    username: string;
    password: string;
    roles: string[];
    groups: string[];
  } | null = null;

  users: any[] = [];

  message: string = '';
  messages = signal<any[]>([]);

  groupName: string = ''; // Added this variable to hold the group name for registering interest

  selectedGroup: string | null = null;
  selectedChannel: string | null = null;
  messageSubscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private groupService: GroupService,
    private chatService: ChatService,
    private localStorageService: localStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
    }

    this.currentUser = currentUser;

    // Ensure user-specific data is loaded correctly
    this.loadAllGroups();
    this.loadUserGroups();
    this.loadUsers();

    this.chatService.revicedMessage().subscribe((message) => {
      this.messages.set([...this.messages(), message]);
    });
  }

  loadUsers(): void {
    this.authService.getUsers().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Error loading users:', error);
      }
    );
  }

  loadAllGroups(): void {
    this.groupService.getAllGroups().subscribe(
      (groups) => {
        this.allGroups = groups;
      },
      (error) => {
        console.error('Error loading all groups:', error);
      }
    );
  }

  loadUserGroups(): void {
    this.groupService.getUserGroups().subscribe(
      (groups) => {
        this.userGroups = groups;
      },
      (error) => {
        console.error('Error loading user groups:', error);
      }
    );
  }
  isGroupInUserGroups(groupId: string): boolean {
    return this.userGroups.some((group) => group._id === groupId);
  }

  sendJoinRequest(groupId: string): void {
    const user = this.localStorageService.getCurrentUser();
    this.groupService.sendJoinRequest(groupId, user._id);
  }

  selectGroup(groupId: string): void {
    if (this.selectedGroup !== groupId) {
      this.selectedGroup = groupId;
      this.selectedChannel = null; // Reset selected channel when group changes
    }
  }

  selectChannel(channelId: string): void {
    this.selectedChannel = channelId;
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe(); // Unsubscribe from previous channel messages
    }
    this.messages.set([]); // Clear previous messages
    this.subscribeToMessages(channelId); // Subscribe to new channel messages
  }

  subscribeToMessages(channelId: string): void {
    this.chatService.joinChannel(channelId);
    this.messageSubscription = this.chatService.getMessage(channelId).subscribe(
      (message) => {
        console.log('Received message:', message);
        this.messages.set(message);
      },
      (error) => {
        console.error('Error receiving messages:', error);
      }
    );
  }
  loadDateandTime(): string {
    let currentdate = new Date();
    let dateandtime =
      '@' +
      currentdate.getDate() +
      '/' +
      (currentdate.getMonth() + 1) +
      '/' +
      currentdate.getFullYear() +
      ' ' +
      currentdate.getHours() +
      ':' +
      currentdate.getMinutes() +
      ':' +
      currentdate.getSeconds();
    return dateandtime;
  }

  sendMessage(): void {
    if (this.message.trim() && this.selectedChannel) {
      this.chatService.sendMessage(
        this.message + ' ' + this.loadDateandTime(),
        this.selectedChannel
      );
      this.message = '';
    } else {
      alert('Please select a channel to send messages.');
    }
  }

  logout(): void {
    try {
      this.authService.logout();
    } catch (error) {
      console.error('Unexpected error during logout:', error);
    }
  }

  deleteAccount(): void {
    const currentUser = this.localStorageService.getCurrentUser();
    if (currentUser) {
      const userId = currentUser._id;
      this.authService.deleteAccount(userId).subscribe(() => {
        this.loadUsers();
        this.router.navigate(['/login']);
      });
    }
  }

  leaveGroup(groupId: string): void {
    try {
      this.groupService.leaveGroup(groupId).subscribe(
        (response) => {
          if (response.message) {
            alert(response.message);
            this.loadUserGroups();
          } else {
            alert(response.error);
          }
        },
        (error) => {
          console.error('Error leaving group:', error);
        }
      );
    } catch (error) {
      console.error('Unexpected error during leaveGroup:', error);
    }
  }

  registerInterest(groupName: string): void {
    try {
      this.groupService.registerInterest(groupName).subscribe(
        (response) => {
          alert(response.message);
        },
        (error) => {
          console.error('Error registering interest:', error);
        }
      );
    } catch (error) {
      console.error('Unexpected error during registerInterest:', error);
    }
  }

  joinChannel(groupId: string, channelId: string): void {
    try {
      this.groupService.joinChannel(groupId, channelId).subscribe(
        (response) => {
          if (response.message) {
            alert(response.message);
          } else {
            alert(response.error);
          }
        },
        (error) => {
          console.error('Error joining channel:', error);
        }
      );
    } catch (error) {
      console.error('Unexpected error during joinChannel:', error);
    }
  }
}
