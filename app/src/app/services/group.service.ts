import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private groups: any[] = [];

  constructor() {
    this.loadGroupsFromStorage();
  }

  // Load groups from localStorage
  private loadGroupsFromStorage() {
    if (typeof window !== 'undefined' && localStorage.getItem('groups')) {
      this.groups = JSON.parse(localStorage.getItem('groups')!);
    }
  }

  // Save groups to localStorage
  private saveGroupsToStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('groups', JSON.stringify(this.groups));
    }
  }

  getGroups(): Observable<any[]> {
    this.loadGroupsFromStorage(); // Ensure the latest data is loaded
    return of(this.groups);
  }

  createGroup(name: string) {
    const newGroup = { id: this.groups.length + 1, name, channels: [] };
    this.groups.push(newGroup);
    this.saveGroupsToStorage();
  }

  createChannel(channelName: string, groupId: number) {
    console.log('hii');
    this.groups.forEach((group) => {
      console.log(group.id);
      if (group.id == groupId) {
        console.log('hi');
        const newChannel = { id: group.channels.length + 1, name: channelName };
        group.channels.push(newChannel);
        this.saveGroupsToStorage();
      }
    });
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
    const groupIndex = this.groups.findIndex((group) => group.id === groupId);
    if (groupIndex !== -1) {
      this.groups.splice(groupIndex, 1);
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
