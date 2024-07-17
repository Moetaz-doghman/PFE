import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ForgotPasswordService } from 'src/app/Services/forgot-password-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})

export class ForgotPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  resetFormE2!: FormGroup;
  resetFormE3!: FormGroup;
  error: string = '';
  otpSent: boolean = false;
  otpVerified: boolean = false;
  passwordChanged: boolean = false;
  emailSending: boolean = false;

  constructor(private formBuilder: FormBuilder, private forgotPasswordService: ForgotPasswordService, private router: Router) {}

  ngOnInit(): void {
    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.resetFormE2 = this.formBuilder.group({
      otp: ['', Validators.required]
    });

    this.resetFormE3 = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit(step: string): void {
    if (step === 'suivant') {
      if (this.resetForm.valid) {
        const email = this.resetForm.get('email')!.value;
        this.emailSending = true;
        this.forgotPasswordService.sendHtmlEmail(email).subscribe(
          response => {
            console.log(response);
            this.otpSent = true;
            this.emailSending = false;
          },
          error => {
            console.log(error);
            this.error = 'Erreur lors de l\'envoi de l\'e-mail de vérification';
            this.emailSending = false;
          }
        );
      }
    } else if (step === 'valider') {
      if (this.resetFormE2.valid) {
        const otp = this.resetFormE2.get('otp')!.value;
        const email = this.resetForm.get('email')!.value;
        this.forgotPasswordService.verifyOtp(otp, email).subscribe(
          response => {
            console.log(response);
            this.otpSent = true;
            this.otpVerified = true;
          },
          error => {
            console.log(error);
            this.error = 'Veuillez vérifier le CODE OTP';
          }
        );
      }
    } else if (step === 'done') {
      if (this.resetFormE3.valid && this.resetFormE3.get('password')!.value === this.resetFormE3.get('confirmPassword')!.value) {
        const email = this.resetForm.get('email')!.value;
        const newPassword = this.resetFormE3.get('password')!.value;
        const repeatPassword = this.resetFormE3.get('confirmPassword')!.value;

        const passwordData = {
          password: newPassword,
          repeatPassword: repeatPassword
        };

        this.forgotPasswordService.changePassword(email, passwordData).subscribe(
          response => {
            console.log(response);
            this.passwordChanged = true;
            this.router.navigate(['/login']);
          },
          error => {
            console.log(error);
            this.error = 'Erreur lors du changement de mot de passe';
          }
        );
      }
    }
  }
}
