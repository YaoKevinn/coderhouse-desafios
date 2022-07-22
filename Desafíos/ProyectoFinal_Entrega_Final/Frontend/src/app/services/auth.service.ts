import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { SocketService } from './socket.service';
import { Message } from '../models/Chat';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public isLoggedIn: boolean = false
  public loggedUser: any = undefined
  public chatMessages = new BehaviorSubject<Message[]>([]);

  constructor(private apiService: ApiService, private socketService: SocketService, private router: Router) {
    const token = localStorage.getItem('coderToken');
    if (token) {
      this.apiService.getMe().subscribe((res) => {
        console.log(res);
        this.loggedUser = res.user;
        this.socketService.init();
      }, (err) => {
        this.router.navigate(['login']);
      });
    }
  }

  login(username: string, password: string) {
    let obs = this.apiService.login(username, password);
    obs.subscribe((res) => {
      this.isLoggedIn = true;
      this.loggedUser = res.user;
      localStorage.setItem('coderToken', res.token);
      this.socketService.init();
    });
    return obs;
  }

  getAllChatMessages() {
    let obs = this.apiService.getAllChatConversations();
    obs.subscribe((messages: Message[]) => {
      this.chatMessages.next(messages);
    });
    return obs;
  }

  logout() {
    localStorage.removeItem('coderToken');
    this.loggedUser = undefined;
    this.isLoggedIn = false
    this.router.navigate(['login']);
    this.apiService.token = "";
  }
}
