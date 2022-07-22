import { UntypedFormControl, Validators } from '@angular/forms';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Message, MessageType } from 'src/app/models/Chat';
import { SocketService } from 'src/app/services/socket.service';
import { ChatService } from 'src/app/services/chat.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  messages: Message[] = []
  messageControl: UntypedFormControl = new UntypedFormControl('', [Validators.required]);

  constructor(public authService: AuthService, private chatService: ChatService, private socketService: SocketService) { }

  ngOnInit(): void {
    this.chatService.getAllChatMessages();
    this.chatService.chatMessages.subscribe(((res) => {
      this.messages = res;
    }));
  }

  sendMessage() {
    if (!this.authService.loggedUser) {
      alert('Iniciá sesión para empezar a chatear');
      return
    }
    if (this.messageControl.valid) {
      this.socketService.sendMessage({
        email: this.authService.loggedUser?.username,
        type: MessageType.USER,
        body: this.messageControl.value
      });
      this.messageControl.setValue('');
    }
  }
}
