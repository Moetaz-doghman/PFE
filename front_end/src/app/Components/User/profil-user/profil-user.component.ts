import { UserServiceService } from './../../../Services/user-service.service';
import { Component, OnInit } from '@angular/core';
import { StorageServiceService } from '../../../Services/storage-service.service';
import { AuthServiceService } from '../../../Services/auth-service.service';
import { Router } from '@angular/router';
import { User } from '../../../Models/User';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profil-user',
  templateUrl: './profil-user.component.html',
  styleUrls: ['./profil-user.component.css'],
})
export class ProfilUserComponent implements OnInit {
  isLoggedIn: boolean;
  roles: any;
  user: User;
  profilForm!: FormGroup;

  constructor(
    private storageService: StorageServiceService,
    private authService: AuthServiceService,
    private router: Router,
    private fb: FormBuilder,
    private userService: UserServiceService
  ) {}

  ngOnInit(): void {
    this.profilForm = this.fb.group({
      nom: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      prenom: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      adresse: ['', [Validators.required]],
      identiteBancaire: ['', [Validators.required]],
      tel: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
    });

    this.isLoggedIn = this.storageService.isLoggedIn();
    if (this.isLoggedIn) {
      this.user = this.storageService.getUser();
    }
    this.profilForm.patchValue(this.user);
  }

  onSubmit() {
    if (this.profilForm.valid) {
      const updatedProfil: User = this.profilForm.value;
      this.userService.editUtilisateur(this.user.id, updatedProfil).subscribe(
        (response) => {
          console.log('utilisateur updated successfully', response);
          this.loadUserDetails();
          this.router.navigate(['/menu/profil']);
        },
        (error) => {
          console.error('Error adding adherent', error);
        }
      );
    }
  }

  loadUserDetails() {
    this.userService.getUserById(this.user.id).subscribe(
      (response: any) => {
        this.user = response;
      },
      (error: any) => {
        console.error('Error fetching ordonnances:', error);
      }
    );
  }

  navigate() {
    this.router.navigate(['/menu/profil']);
  }
}
