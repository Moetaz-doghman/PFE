import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthServiceService } from '../Services/auth-service.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DentisteControleurGuard implements CanActivate {


  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.HaveAccessDentC()) {
      return true;
    } else {
      this.router.navigate(['']);
      return false;
    }
  }
}