import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ChangePasswordRequest } from 'src/app/Models/ChangePasswordRequest ';
import { User } from 'src/app/Models/User';
import { StorageServiceService } from 'src/app/Services/storage-service.service';
import { UserServiceService } from 'src/app/Services/user-service.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  passwordForm: FormGroup;
  errorMessage: string = '';
  isLoggedIn: boolean;
  user: User;



  constructor(private fb: FormBuilder, private userService: UserServiceService , private route :Router ,private snackBar: MatSnackBar
    , private storageService: StorageServiceService,
  ) { }


  ngOnInit(): void {

    this.isLoggedIn = this.storageService.isLoggedIn();
    if (this.isLoggedIn) {
      this.user = this.storageService.getUser();
    }

    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.passwordMatchValidator
    });
  }


  onSubmit(): void {
    if (this.passwordForm.valid) {
      const userId = this.user.id 
      const changePasswordRequest: ChangePasswordRequest = {
        oldPassword: this.passwordForm.get('oldPassword').value,
        newPassword: this.passwordForm.get('newPassword').value,
        confirmPassword: this.passwordForm.get('confirmPassword').value
      };

      this.userService.changePassword(userId, changePasswordRequest).subscribe({
        next: response => {
          this.snackBar.open('Password changed successfully', 'Close', {
            duration: 3000 
          });  
          this.passwordForm.reset();
        },
        error: err => {
          console.log(err)
          this.errorMessage = "ancien mot de passe est incorrect "
        }
      });
    }
  }

  onReset(): void {
    this.passwordForm.reset();
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const newPassword = formGroup.get('newPassword').value;
    const confirmPassword = formGroup.get('confirmPassword').value;

    if (newPassword !== confirmPassword) {
      formGroup.get('confirmPassword').setErrors({ passwordMismatch: true });
    } else {
      formGroup.get('confirmPassword').setErrors(null);
    }
  }

  }



