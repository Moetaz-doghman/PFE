import { Injectable } from '@angular/core';
import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from '../Services/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private service:AuthServiceService,private route:Router){

  }
  canActivate(){
    if(this.service.IsLoggedIn()){
    return true;
    }else{
      this.route.navigate(['login'])
      return false;
    }
  }
  
}
