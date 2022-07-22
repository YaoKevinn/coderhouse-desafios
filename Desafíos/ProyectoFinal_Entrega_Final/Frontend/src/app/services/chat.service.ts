import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Message } from '../models/Chat';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  public chatMessages = new BehaviorSubject<Message[]>([]);

  constructor(private apiService: ApiService) { }

  getAllChatMessages() {
    let obs = this.apiService.getAllChatConversations();
    obs.subscribe((messages: Message[]) => {
      this.chatMessages.next(messages);
    });
    return obs;
  }
}
