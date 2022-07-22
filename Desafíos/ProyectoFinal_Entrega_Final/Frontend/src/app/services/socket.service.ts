import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { Message } from '../models/Chat';
import { ChatService } from './chat.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor(private chatService: ChatService) {
    this.socket = io(environment.socketUrl);
  }

  init() {
    this.socket.removeAllListeners();
    this.socket.on('newUserMessage', (data: Message) => {
        const newMessages = this.chatService.chatMessages.value;
        newMessages.push(data);
        this.chatService.chatMessages.next(newMessages);
    });
  }

  sendMessage(data: { email: string, type: string, body: string }) {
    this.socket.emit('newMessage', data);
  }
}
