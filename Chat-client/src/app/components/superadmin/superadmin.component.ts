import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { GroupService } from '../../services/group.service';
import { Router } from '@angular/router';
import { localStorageService } from '../../services/localStorage.service';

@Component({
  selector: 'app-super-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './superadmin.component.html',
  styleUrls: ['./superadmin.component.css'],
})
export class SuperAdminComponent implements OnInit {
  users: any[] = []; // To hold the list of users
  notifications: { status: string; group: any; user: any; _id: string }[] = [];

  username: string = '';
  password: string = '';
  regUsername: string = ''; // Registration Username
  regEmail: string = ''; // Registration Email
  regPassword: string = ''; // Registration Password
  errorMessage: string = '';

  currentUser: {
    id: number;
    username: string;
    password: string;
    roles: string[];
    groups: string[];
  } | null = null;

  groupName: string = '';
  channelName: string = '';
  selectedGroupId: number | null = null;
  groups: {
    _id: string;
    name: string;
    userIds: [];
    channels: { _id: string; name: string }[];
  }[] = [];

  // Add this variable to toggle visibility
  showGroupManagement: boolean = false;
  showRegister: boolean = false;

  constructor(
    private authService: AuthService,
    private groupService: GroupService,
    private localStorageService: localStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    this.currentUser = currentUser;

    this.loadNotifications();
    this.loadUsers();
    this.groupService.getAllGroups().subscribe((groups) => {
      this.groups = groups;
    });
  }
  toggleGroupManagement(): void {
    this.showGroupManagement = !this.showGroupManagement;
  }
  toggleRegister(): void {
    this.showRegister = !this.showRegister;
  }

  loadNotifications(): void {
    this.groupService.getNotifications().subscribe(
      (notifications) => {
        this.notifications = notifications;
      },
      (error) => {
        console.error('Error loading notifications:', error);
      }
    );
  }

  onApprove(notificationId: string): void {
    this.groupService.approveJoinRequest(notificationId).subscribe({
      next: (response) => {
        alert('Join request approved successfully.');
        this.loadNotifications();
      },
      error: (error) => {
        alert('Error approving join request.');
      },
    });
  }

  onDelete(index: number): void {
    this.notifications.splice(index, 1); // Remove from array in memory
    this.groupService.deleteNotification(index); // Remove from localStorage
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

  // Method to load groups and update the view
  loadGroups(): void {
    this.groupService.getAllGroups().subscribe((groups) => {
      this.groups = groups;
      console.log(groups);
    });
  }

  promoteToGroupAdmin(userId: number): void {
    this.authService.promoteToGroupAdmin(userId).subscribe(() => {
      this.loadUsers(); // Refresh user list after promotion
    });
  }

  removeUser(userId: string): void {
    this.authService.removeUser(userId).subscribe(() => {
      this.loadUsers(); // Refresh user list after removal
    });
  }

  upgradeToSuperAdmin(userId: number): void {
    this.authService.upgradeToSuperAdmin(userId).subscribe(() => {
      this.loadUsers(); // Refresh user list after upgrade
    });
  }
  logout(): void {
    try {
      this.authService.logout();
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

  onCreateGroup(): void {
    const currentUser = this.localStorageService.getCurrentUser();

    if (this.groupName.trim()) {
      this.groupService.createGroup(this.groupName, currentUser.id);
      this.groupName = '';
      this.loadGroups();
    } else {
      alert('Please enter a valid group name.');
    }
  }

  onCreateChannel(): void {
    if (this.selectedGroupId) {
      // Ensure a group is selected
      if (this.channelName.trim()) {
        this.groupService.createChannel(this.channelName, this.selectedGroupId);
        this.channelName = ''; // Clear the input field after creation
        this.loadGroups(); // Reload the groups to reflect the new channel
      } else {
        alert('Please enter a valid channel name.');
      }
    } else {
      alert('Please select a group first.');
    }
  }

  onRemoveGroup(groupId: string): void {
    this.groupService.removeGroup(groupId);
    this.loadGroups(); // Reload groups to reflect the removal
  }

  onRemoveChannel(channelId: string): void {
    this.groupService.removeChannel(channelId);
    this.loadGroups(); // Reload groups to reflect the removal
  }

  onBanUserFromChannel(groupId: number, channelId: number): void {
    const userId = 1; // Example: assuming user ID 1 is to be banned
    alert(`User ${userId} has been banned from channel ${channelId}.`);
  }
  onRegister() {
    const newUser = {
      username: this.regUsername,
      email: this.regEmail,
      password: this.regPassword,
    };

    this.authService.register(newUser).subscribe({
      next: () => {
        alert('Registration successful. Please log in.');
        this.clearRegistrationForm();
      },
      error: (error) => {
        alert(error.message); // This will catch and show the custom error message from AuthService
        this.errorMessage = error.message;
      },
    });
  }

  clearRegistrationForm() {
    this.regUsername = '';
    this.regEmail = '';
    this.regPassword = '';
  }
}
