import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { GroupService } from '../../services/group.service';
import { ChatService } from '../../services/chat.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  groups: { id: number; name: string }[] = [];
  message: string = '';
  messages: string[] = [];
  userId: number = 3; // Example: Hardcoded user ID
  groupName: string = ''; // Added this variable to hold the group name for registering interest

  constructor(
    private authService: AuthService,
    private groupService: GroupService,
    private chatService: ChatService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadGroups();
    this.loadMessages();
  }

  loadGroups(): void {
    this.groupService.getGroups().subscribe(
      (data) => {
        this.groups = data;
        console.log('Groups loaded:', this.groups);
      },
      (error) => {
        console.error('Error loading groups:', error);
      }
    );
  }

  loadMessages(): void {
    this.chatService.getMessage().subscribe(
      (message: string) => {
        this.messages.push(message);
        console.log('Received message:', message);
      },
      (error) => {
        console.error('Error receiving messages:', error);
      }
    );
  }

  sendMessage(): void {
    if (this.message.trim()) {
      try {
        this.chatService.sendMessage(this.message);
        this.message = '';
      } catch (error) {
        console.error('Error sending message:', error);
      }
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
    try {
      this.authService.deleteAccount(this.userId).subscribe(
        () => {
          alert('Account deleted successfully');
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error('Error deleting account:', error);
          alert('Error deleting account');
        }
      );
    } catch (error) {
      console.error('Unexpected error during account deletion:', error);
    }
  }

  leaveGroup(groupId: number): void {
    try {
      this.groupService.leaveGroup(groupId).subscribe(
        (response) => {
          if (response.message) {
            alert(response.message);
            this.loadGroups();
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
