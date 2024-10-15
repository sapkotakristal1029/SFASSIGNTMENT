import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { localStorageService } from './localStorage.service';

interface Notification {
  message: string;
  groupId: string;
  userId: string;
}

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(
    private http: HttpClient,
    private localStorageService: localStorageService
  ) {}

  getAllGroups(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/groups`);
  }

  getUserGroups(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/groups/user-groups/${
        this.localStorageService.getCurrentUser()._id
      }`
    );
  }

  getNotifications(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/requests/request-by-admin/${
        this.localStorageService.getCurrentUser()._id
      }`
    );
  }

  sendJoinRequest(groupId: any, userId: any) {
    this.http
      .post(`${this.apiUrl}/requests/request-access`, {
        userId: userId,
        groupId: groupId,
      })
      .subscribe({
        next: (response) => {
          alert('Join request sent successfully.');
        },
        error: (error) => {
          alert('Error sending join request.');
        },
      });
  }

  approveJoinRequest(requestId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/requests/approve-request`, {
      requestId,
      status: 'Approved',
    });
  }

  deleteNotification(index: number): void {}

  createGroup(name: string, id: any, callback?: () => void) {
    alert(id);
    const newGroup = {
      // id: this.getGroupCount() + 1,
      name,
      admins: [id],
      users: [id],
      channels: [],
    };

    this.http.post(`${this.apiUrl}/groups`, newGroup).subscribe({
      next: (response) => {
        callback && callback();
        alert('Group created successfully.');
      },
      error: (error) => {
        alert('Error creating group.');
      },
    });
  }

  createChannel(name: string, group: any, callback?: () => void) {
    const newChannel = {
      name,
      group,
    };

    this.http.post(`${this.apiUrl}/channels`, newChannel).subscribe({
      next: (response) => {
        callback && callback();
        alert('Channel created successfully.');
      },
      error: (error) => {
        alert('Error creating channel.');
      },
    });
  }

  removeGroup(groupId: string, callback?: () => void) {
    this.http.delete(`${this.apiUrl}/groups/${groupId}`).subscribe({
      next: (response) => {
        callback && callback();
        alert('Group removed successfully.');
      },
      error: (error) => {
        alert('Error removing group.');
      },
    });
  }

  removeChannel(channelId: string, callback?: () => void) {
    this.http.delete(`${this.apiUrl}/channels/${channelId}`).subscribe({
      next: (response) => {
        callback && callback();
        alert('Channel removed successfully.');
      },
      error: (error) => {
        alert('Error removing channel.');
      },
    });
  }

  banUserFromChannel(groupId: string, channelId: string, userId: string) {}

  sendUserRemovalNotification(userId: string): Observable<any> {
    return of({ error: 'User not found.' });
  }

  leaveGroup(groupId: string): Observable<any> {
    return of({ error: 'Group not found' });
  }

  registerInterest(groupName: string): Observable<any> {
    return of({ message: `Registered interest in group ${groupName}` });
  }

  joinChannel(groupId: string, channelId: string): Observable<any> {
    return of({ error: 'Channel or Group not found' });
  }
}
