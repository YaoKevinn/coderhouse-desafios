import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public isLoggedIn: boolean = false
  public loggedUser: any = undefined

  constructor(private apiService: ApiService, private cookieService: CookieService, private router: Router) {
    const token = localStorage.getItem('coderToken');
    if (token) {
      this.apiService.getMe().subscribe((res) => {
        console.log(res);
          this.loggedUser = res.user
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
