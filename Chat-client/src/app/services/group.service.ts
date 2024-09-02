import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

interface Notification {
  message: string;
  groupId: number;
  userId: number;
}

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private groups: any[] = [];
  private notifications: Notification[] = []; // Use the Notification interface

  constructor() {
    if (this.isLocalStorageAvailable()) {
      this.loadGroupsFromStorage();
      this.loadNotificationsFromStorage();
    }
  }

  private isLocalStorageAvailable(): boolean {
    try {
      const test = '__test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Load groups from localStorage
  private loadGroupsFromStorage() {
    if (this.isLocalStorageAvailable() && localStorage.getItem('groups')) {
      this.groups = JSON.parse(localStorage.getItem('groups')!);
    }
  }

  // Save groups to localStorage
  private saveGroupsToStorage() {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('groups', JSON.stringify(this.groups));
    }
  }

  // Load notifications from localStorage
  private loadNotificationsFromStorage() {
    if (
      this.isLocalStorageAvailable() &&
      localStorage.getItem('notifications')
    ) {
      this.notifications = JSON.parse(localStorage.getItem('notifications')!);
    }
  }

  // Save notifications to localStorage
  private saveNotificationsToStorage() {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('notifications', JSON.stringify(this.notifications));
    }
  }

  getAllGroups(): Observable<any[]> {
    this.loadGroupsFromStorage(); // Ensure the latest data is loaded
    return of(this.groups);
  }
  // getGroups(): Observable<any[]> {
  //   this.loadGroupsFromStorage();
  //   return of(this.groups);
  // }

  getUserGroups(): Observable<any[]> {
    if (this.isLocalStorageAvailable()) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser')!);
      const userGroups = this.groups.filter((group) =>
        group.userIds.includes(currentUser.id)
      );
      return of(userGroups);
    }
    return of([]);
  }

  getNotifications(): Observable<Notification[]> {
    this.loadNotificationsFromStorage();
    return of(this.notifications);
  }

  sendJoinRequest(groupId: number): Observable<any> {
    if (this.isLocalStorageAvailable()) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser')!);
      const group = this.groups.find((g) => g.id === groupId);
      if (group) {
        const notification: Notification = {
          message: `${currentUser.username} has requested to join ${group.name}`,
          groupId: groupId,
          userId: currentUser.id,
        };
        this.notifications.push(notification);
        this.saveNotificationsToStorage();
        return of({ message: 'Join request sent successfully' });
      }
    }
    return of({ error: 'Group not found' });
  }

  approveJoinRequest(groupId: number, userId: number): Observable<any> {
    const group = this.groups.find((g) => g.id === groupId);
    console.log(group);
    if (group && !group.userIds.includes(userId)) {
      group.userIds.push(userId);
      this.saveGroupsToStorage();
      console.log(group);
      return of({ message: 'User added to group successfully' });
    }
    return of({ error: 'Group not found or user already in group' });
  }

  deleteNotification(index: number): void {
    this.notifications.splice(index, 1);
    this.saveNotificationsToStorage();
  }

  createGroup(name: string) {
    const newGroup = {
      id: this.groups.length + 1,
      name,
      userIds: [],
      channels: [],
    };
    this.groups.push(newGroup);
    this.saveGroupsToStorage();
  }

  createChannel(channelName: string, groupId: number) {
    const group = this.groups.find((g) => g.id == groupId);
    if (group) {
      const newChannel = { id: group.channels.length + 1, name: channelName };
      group.channels.push(newChannel);
      this.saveGroupsToStorage();
    }
  }

  removeGroup(groupId: number) {
    this.groups = this.groups.filter((group) => group.id !== groupId);
    this.saveGroupsToStorage();
  }

  removeChannel(groupId: number, channelId: number) {
    const group = this.groups.find((group) => group.id === groupId);
    if (group) {
      group.channels = group.channels.filter(
        (channel: any) => channel.id !== channelId
      );
      this.saveGroupsToStorage();
    }
  }

  banUserFromChannel(groupId: number, channelId: number, userId: number) {
    console.log(
      `User ${userId} is banned from Channel ${channelId} in Group ${groupId}`
    );
  }

  leaveGroup(groupId: number): Observable<any> {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')!);

    // Find the group by ID
    const group = this.groups.find((g) => g.id === groupId);

    if (group) {
      // Remove the current user's ID from the group's userIds array
      group.userIds = group.userIds.filter(
        (id: number) => id !== currentUser.id
      );

      // Save the updated groups to localStorage
      this.saveGroupsToStorage();

      return of({ message: 'Left group successfully' });
    }

    return of({ error: 'Group not found' });
  }

  registerInterest(groupName: string): Observable<any> {
    return of({ message: `Registered interest in group ${groupName}` });
  }

  joinChannel(groupId: number, channelId: number): Observable<any> {
    const group = this.groups.find((group) => group.id === groupId);
    if (group) {
      const channel = group.channels.find(
        (channel: any) => channel.id === channelId
      );
      if (channel) {
        return of({
          message: `Joined channel ${channel.name} in group ${group.name}`,
        });
      }
    }
    return of({ error: 'Channel or Group not found' });
  }
}
