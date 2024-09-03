import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../services/group.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, switchMap } from 'rxjs';

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css'],
})
export class GroupComponent implements OnInit {
  notifications: { message: string; groupId: number; userId: number }[] = [];

  groupName: string = '';
  channelName: string = '';
  selectedGroupId: number | null = null;
  currentUser: {
    id: number;
    username: string;
    password: string;
    roles: string[];
    groups: string[];
  } | null = null;

  users: any[] = [];
  activeUsers: any[] = [];

  groups: {
    id: number;
    name: string;
    userIds: [];
    channels: { id: number; name: string }[];
  }[] = [];

  constructor(
    private groupService: GroupService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    this.currentUser = currentUser;

    if (this.currentUser) {
      this.loadGroupsAndNotifications();
    }

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
    this.authService.getUsers().subscribe(
      (data) => {
        // Filter users to include only those with the role 'User'
        this.activeUsers = data.filter((user) => user.roles.includes('User'));
        console.log('Active users:', this.activeUsers);
      },
      (error) => {
        console.error('Error loading users:', error);
      }
    );
  }

  // Method to load groups and update the view
  loadGroups(): void {
    if (this.currentUser) {
      this.groupService.getAllGroups().subscribe((groups) => {
        // Filter groups where the current user is in the userIds and has the role of "Group Admin"
        this.groups = groups.filter(
          (group) =>
            group.userIds.includes(this.currentUser!.id) &&
            this.currentUser!.roles.includes('Group Admin')
        );
        console.log(this.groups);
      });
    }
  }

  loadGroupsAndNotifications(): void {
    if (this.currentUser) {
      this.groupService
        .getAllGroups()
        .pipe(
          map((groups) => {
            // Filter groups where the current user is in the userIds and has the role of "Group Admin"
            this.groups = groups.filter(
              (group) =>
                group.userIds.includes(this.currentUser!.id) &&
                this.currentUser!.roles.includes('Group Admin')
            );
            console.log('Filtered groups:', this.groups);
            return this.groups;
          }),
          switchMap(() => this.groupService.getNotifications()) // switchMap waits for the first observable to complete
        )
        .subscribe(
          (notifications) => {
            // Filter notifications to only include those with a groupId present in this.groups
            this.notifications = notifications.filter((notification) =>
              this.groups.some((group) => group.id === notification.groupId)
            );
            console.log('Filtered notifications:', this.notifications);
          },
          (error) => {
            console.error('Error loading notifications:', error);
          }
        );
    }
  }

  onApprove(notification: any, index: number): void {
    this.groupService
      .approveJoinRequest(notification.groupId, notification.userId)
      .subscribe(
        () => {
          this.notifications.splice(index, 1); // Remove from array in memory
          this.groupService.deleteNotification(index); // Remove from localStorage
        },
        (error) => {
          console.error('Error approving join request:', error);
        }
      );
  }

  onDelete(index: number): void {
    this.notifications.splice(index, 1); // Remove from array in memory
    this.groupService.deleteNotification(index); // Remove from localStorage
  }

  onCreateGroup(): void {
    const currentUser = this.authService.getCurrentUser();
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

  onRemoveGroup(groupId: number): void {
    this.groupService.removeGroup(groupId);
    this.loadGroups(); // Reload groups to reflect the removal
  }

  onRemoveChannel(groupId: number, channelId: number): void {
    this.groupService.removeChannel(groupId, channelId);
    this.loadGroups(); // Reload groups to reflect the removal
  }

  removeUser(userId: number): void {
    this.authService.removeUser(userId).subscribe(() => {
      this.loadUsers(); // Refresh user list after removal
    });

    // Send notification to the Super Admin
    this.groupService.sendUserRemovalNotification(userId).subscribe(() => {
      console.log('Notification sent to Super Admin.');
    });
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
}
