import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../services/group.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { localStorageService } from '../../services/localStorage.service';

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css'],
})
export class GroupComponent implements OnInit {
  notifications: { status: any; group: any; user: any; _id: string }[] = [];

  groupName: string = '';
  channelName: string = '';
  selectedGroupId: string | null = null;

  currentUser: {
    _id: string;
    username: string;
    password: string;
    roles: string[];
    groups: string[];
  } | null = null;

  users: any[] = [];
  activeUsers: any[] = [];

  groups: {
    _id: string;
    name: string;
    userIds: [];
    channels: { _id: string; name: string }[];
  }[] = [];

  constructor(
    private groupService: GroupService,
    private authService: AuthService,
    private localStorageService: localStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const currentUser = this.localStorageService.getCurrentUser();
    console.log('Current user:', currentUser);
    this.currentUser = currentUser;

    if (this.currentUser) {
      this.loadGroupsAndNotifications();
    }

    this.loadUsers();
    this.loadGroups();
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
        console.log(groups);
        // Filter groups where the current user is in the userIds and has the role of "Group Admin"
        this.groups = groups.filter(
          (group) =>
            group.admins.includes(this.currentUser?._id) &&
            this.currentUser?.roles.includes('Group Admin')
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
                group._id.includes(this.currentUser?._id) &&
                this.currentUser!.roles.includes('Group Admin')
            );
            console.log('Filtered groups:', this.groups);
            return this.groups;
          })
        )
        .subscribe();

      this.groupService.getNotifications().subscribe(
        (notifications) => {
          // Filter notifications to only include those with a groupId present in this.groups
          this.notifications = notifications;
          console.log('Filtered notifications:', this.notifications);
        },
        (error) => {
          console.error('Error loading notifications:', error);
        }
      );
    }
  }

  onApprove(notificationId: string): void {
    this.groupService.approveJoinRequest(notificationId).subscribe({
      next: (response) => {
        alert('Join request approved!');
        this.loadGroupsAndNotifications();
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

  onCreateGroup(): void {
    const currentUser = this.localStorageService.getCurrentUser();
    console.log('Current user 2:', currentUser);
    if (this.groupName.trim()) {
      this.groupService.createGroup(
        this.groupName,
        currentUser._id,
        this.loadGroups.bind(this)
      );
      this.groupName = '';
    } else {
      alert('Please enter a valid group name.');
    }
  }

  onCreateChannel(): void {
    if (this.selectedGroupId) {
      console.log('Selected group ID:', this.selectedGroupId);
      // Ensure a group is selected
      if (this.channelName.trim()) {
        this.groupService.createChannel(
          this.channelName,
          this.selectedGroupId,
          this.loadGroups.bind(this)
        );
        this.channelName = ''; // Clear the input field after creation
      } else {
        alert('Please enter a valid channel name.');
      }
    } else {
      alert('Please select a group first.');
    }
  }

  onRemoveGroup(groupId: string): void {
    this.groupService.removeGroup(groupId, this.loadGroups.bind(this));
  }

  onRemoveChannel(channelId: string): void {
    this.groupService.removeChannel(channelId, this.loadGroups.bind(this));
  }

  removeUser(userId: string): void {
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
}
