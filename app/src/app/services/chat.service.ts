import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket = io('http://localhost:3000');

  sendMessage(message: string, selectedChannel: number) {
    this.socket.emit('message', message);
  }

  getMessage(channelId: number): Observable<string> {
    return new Observable((observer) => {
      this.socket.on('message', (message: string) => {
        observer.next(message);
      });
    });
  }
}
