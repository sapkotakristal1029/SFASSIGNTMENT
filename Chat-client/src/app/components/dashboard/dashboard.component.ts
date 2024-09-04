import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { GroupService } from '../../services/group.service';
import { ChatService } from '../../services/chat.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  allGroups: { id: number; name: string }[] = [];
  userGroups: {
    id: number;
    name: string;
    channels: { id: number; name: string }[];
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
  messages: string[] = [];

  groupName: string = ''; // Added this variable to hold the group name for registering interest

  selectedGroup: number | null = null;
  selectedChannel: number | null = null;
  messageSubscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private groupService: GroupService,
    private chatService: ChatService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.currentUser = currentUser;

    // Ensure user-specific data is loaded correctly
    this.loadAllGroups();
    this.loadUserGroups();
    this.loadUsers();
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
  isGroupInUserGroups(groupId: number): boolean {
    return this.userGroups.some((group) => group.id === groupId);
  }

  sendJoinRequest(groupId: number): void {
    this.groupService.sendJoinRequest(groupId).subscribe(
      (response) => {
        alert(response.message);
      },
      (error) => {
        console.error('Error sending join request:', error);
      }
    );
  }

  selectGroup(groupId: number): void {
    if (this.selectedGroup !== groupId) {
      this.selectedGroup = groupId;
      this.selectedChannel = null; // Reset selected channel when group changes
    }
  }

  selectChannel(channelId: number): void {
    this.selectedChannel = channelId;
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe(); // Unsubscribe from previous channel messages
    }
    this.messages = []; // Clear previous messages
    this.subscribeToMessages(channelId); // Subscribe to new channel messages
  }

  subscribeToMessages(channelId: number): void {
    this.messageSubscription = this.chatService.getMessage(channelId).subscribe(
      (message) => {
        this.messages.push(message);
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
      this.authService.logout().subscribe(
        () => {
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error('Error logging out:', error);
          alert('Error logging out');
        }
      );
    } catch (error) {
      console.error('Unexpected error during logout:', error);
    }
  }

  deleteAccount(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      const userId = currentUser.id;
      this.authService.deleteAccount(userId).subscribe(() => {
        this.loadUsers();
        this.router.navigate(['/login']);
      });
    }
  }

  leaveGroup(groupId: number): void {
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

  joinChannel(groupId: number, channelId: number): void {
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
