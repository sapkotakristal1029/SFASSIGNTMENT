import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';
import { localStorageService } from './localStorage.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket = io('http://localhost:5000', {
    transports: ['websocket', 'polling'],
    withCredentials: true,
  });

  constructor(
    private localStorageService: localStorageService,
    private http: HttpClient
  ) {}

  joinChannel(channelId: any) {
    this.socket.emit('joinChannelRoom', channelId);
  }

  sendMessage(message: string, selectedChannel: string) {
    this.socket.emit('sendMessage', {
      text: message,
      userId: this.localStorageService.getCurrentUser()._id,
      channelId: selectedChannel,
    });
  }

  revicedMessage(): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket.on('receiveMessage', (message) => {
        console.log('Received message:', message);
        observer.next(message);
      });
    });
  }

  getMessage(channelId: string): Observable<any> {
    return this.http.get(
      `http://localhost:5000/api/messages/channel/${channelId}`
    );
  }
}
