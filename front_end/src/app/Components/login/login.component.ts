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
  errorMessage1: string | null = null;

  constructor(private authService: AuthServiceService, private storageService: StorageServiceService, private router: Router) { }

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
        this.isLoggedIn = true;
        this.roles = this.storageService.getUser().roles;
        this.router.navigate(['/menu/home']);
      },
      error: err => {
        this.isLoginFailed = true;
        if (err.status === 401) {
          if (err.error.message === 'Bad credentials' || err.error.message === "Cannot invoke \"com.example.projectPfe.models.Utilisateur.getRoles()\" because \"user\" is null") {
            this.errorMessage = "Adresse ou mot de passe incorrect";
          } else {
            this.errorMessage = 'Erreur de connexion ';
          }
        } else if ( err.status === 400){
          if (err.error.message === 'NotActive') {
            this.errorMessage = 'Votre compte n est pas actif';
          }
        }
         else {
          this.errorMessage = 'Erreur de connexion ';
        }
      }
    });
  }

  reloadPage(): void {
    window.location.reload();
  }
}
