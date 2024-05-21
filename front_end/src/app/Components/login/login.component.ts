import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../../Services/auth-service.service';
import { StorageServiceService } from 'src/app/Services/storage-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: any = {
    email: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  errorMessage1 = 'adresse ou mot de passe incorrect';
  constructor(private authService: AuthServiceService, private storageService: StorageServiceService, private route: Router) { }
  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.roles = this.storageService.getUser().roles;
    }
  }
  onSubmit(): void {
    const { email, password } = this.form;
    this.authService.login(email, password).subscribe({
      next: data => {
        this.storageService.saveUser(data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.storageService.getUser().roles;
        this.route.navigate(['/menu']);

      },
      error: err => {
        this.isLoginFailed = true;
        this.errorMessage1 = 'adresse ou mot de passe incorrect';
        this.errorMessage = err.error.message;
      }
    });
  }

  reloadPage(): void {
    window.location.reload();
  }
}



