import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageServiceService } from './storage-service.service';



const AUTH_API = 'http://localhost:8034/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class AuthServiceService {

  isLoggedIn: boolean = false;
  roles: string[] = [];
  constructor(
              private http: HttpClient,
              private storageService: StorageServiceService) {this.checkLoggedIn();}

  login(email: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'signin',
      {
        email,
        password,
      },
      httpOptions
      
    );
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'signup',
      {
        username,
        email,
        password,
      },
      httpOptions
    );
  }

  logout(): Observable<any> {
    return this.http.post(AUTH_API + 'signout', { }, httpOptions);
  }

  private checkLoggedIn() {
    this.isLoggedIn = this.storageService.isLoggedIn();
    if (this.isLoggedIn) {
      const user = this.storageService.getUser();
      this.roles = user.roles;
    }
  }

  isAdmin(): boolean {
    return this.roles.includes('ROLE_ADMIN');
  }

  isOpticien(): boolean {
    return this.roles.includes('ROLE_OPTICIEN');
  }

  isDentist(): boolean {
    return this.roles.includes('ROLE_DENTIST');
  }

  isOpticienControleur(): boolean {
    return this.roles.includes('ROLE_OPTICIEN_CONTROLEUR');
  }

  isDentistControleur(): boolean {
    return this.roles.includes('ROLE_DENTIST_CONTROLEUR');
  }
}

