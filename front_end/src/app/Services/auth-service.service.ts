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

  IsLoggedIn(){
    return localStorage.getItem('auth-user')!=null;
  }
  GetToken(){
   return localStorage.getItem('auth-user')||'';
  }
  HaveAccess(){
    var loggintoken=localStorage.getItem('auth-user')||'';
    var _extractedtoken=loggintoken.split('.')[1];
    var _atobdata=atob(_extractedtoken);
    var _finaldata=JSON.parse(_atobdata);
    console.log(_finaldata);
    if(_finaldata.roles=="ROLE_ADMIN"){
      return true
    }else{
      alert('you not having access');
      return false
    }
  }
  HaveAccessOpt(){
    var loggintoken=localStorage.getItem('auth-user')||'';
    var _extractedtoken=loggintoken.split('.')[1];
    var _atobdata=atob(_extractedtoken);
    var _finaldata=JSON.parse(_atobdata);
    console.log(_finaldata);
    if(_finaldata.roles=="ROLE_OPTICIEN"){
      return true
    }else{
      alert('you not having access');
      return false
    }
  }

  HaveAccessOpt1(){
    var loggintoken=localStorage.getItem('auth-user')||'';
    var _extractedtoken=loggintoken.split('.')[1];
    var _atobdata=atob(_extractedtoken);
    var _finaldata=JSON.parse(_atobdata);
    console.log(_finaldata);
    if(_finaldata.roles=="ROLE_OPTICIEN"){
      return true
    }else{
      return false
    }
  }

  HaveAccessDent(){
    var loggintoken=localStorage.getItem('auth-user')||'';
    var _extractedtoken=loggintoken.split('.')[1];
    var _atobdata=atob(_extractedtoken);
    var _finaldata=JSON.parse(_atobdata);
    console.log(_finaldata);
    if(_finaldata.roles=="ROLE_DENTIST"){
      return true
    }else{
      alert('you not having access');
      return false
    }
  }

  HaveAccessDent1(){
    var loggintoken=localStorage.getItem('auth-user')||'';
    var _extractedtoken=loggintoken.split('.')[1];
    var _atobdata=atob(_extractedtoken);
    var _finaldata=JSON.parse(_atobdata);
    console.log(_finaldata);
    if(_finaldata.roles=="ROLE_DENTIST"){
      return true
    }else{
      return false
    }
  }

  HaveAccessDentC(){
    var loggintoken=localStorage.getItem('auth-user')||'';
    var _extractedtoken=loggintoken.split('.')[1];
    var _atobdata=atob(_extractedtoken);
    var _finaldata=JSON.parse(_atobdata);
    console.log(_finaldata);
    if(_finaldata.roles=="ROLE_DENTIST_CONTROLEUR"){
      return true
    }else{
      alert('you not having access');
      return false
    }
  }

  HaveAccessDentC1(){
    var loggintoken=localStorage.getItem('auth-user')||'';
    var _extractedtoken=loggintoken.split('.')[1];
    var _atobdata=atob(_extractedtoken);
    var _finaldata=JSON.parse(_atobdata);
    console.log(_finaldata);
    if(_finaldata.roles=="ROLE_DENTIST_CONTROLEUR"){
      return true
    }else{
      return false
    }
  }

  HaveAccessOptC(){
    var loggintoken=localStorage.getItem('auth-user')||'';
    var _extractedtoken=loggintoken.split('.')[1];
    var _atobdata=atob(_extractedtoken);
    var _finaldata=JSON.parse(_atobdata);
    console.log(_finaldata);
    if(_finaldata.roles=="ROLE_OPTICIEN_CONTROLEUR"){
      return true
    }else{
      alert('you not having access');
      return false
    }
  }

  HaveAccessOptC1(){
    var loggintoken=localStorage.getItem('auth-user')||'';
    var _extractedtoken=loggintoken.split('.')[1];
    var _atobdata=atob(_extractedtoken);
    var _finaldata=JSON.parse(_atobdata);
    console.log(_finaldata);
    if(_finaldata.roles=="ROLE_OPTICIEN_CONTROLEUR"){
      return true
    }else{
      return false
    }
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

