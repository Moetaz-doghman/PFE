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
  resetForm!: FormGroup; // Formulaire pour saisir l'email
  resetFormE2!: FormGroup; // Formulaire pour saisir le code OTP
  resetFormE3!: FormGroup; // Formulaire pour saisir le nouveau mot de passe
  error: string = ''; // Variable pour stocker les messages d'erreur
  otpSent: boolean = false; // Indique si le code OTP a été envoyé
  otpVerified: boolean = false; // Indique si le code OTP a été vérifié
  passwordChanged: boolean = false; // Indique si le mot de passe a été changé avec succès
  emailSending: boolean = false; // Indique si l'email est en cours d'envoi


  constructor(private formBuilder: FormBuilder, private forgotPasswordService: ForgotPasswordService, private router: Router) {}

  ngOnInit(): void {
    // Initialisation du formulaire de saisie d'email avec validation
    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });

    // Initialisation du formulaire de saisie du code OTP avec validation
    this.resetFormE2 = this.formBuilder.group({
      otp: ['', Validators.required]
    });

    // Initialisation du formulaire de saisie du nouveau mot de passe avec validation
    this.resetFormE3 = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });
  }

  // Méthode appelée lors de la soumission des formulaires
  onSubmit(step: string): void {
    if (step === 'suivant') {
      // Étape 1 : Envoi de l'email de vérification
      if (this.resetForm.valid) {
        const email = this.resetForm.get('email')!.value;
        this.emailSending = true; // Activer l'indicateur de chargement
        this.forgotPasswordService.sendVerificationEmail(email).subscribe(
          response => {
            console.log(response);
            this.otpSent = true; // Marquer l'OTP comme envoyé avec succès
            this.emailSending = false; // Désactiver l'indicateur de chargement une fois l'email envoyé

          },
          error => {
            console.log(error);
            this.error = 'Erreur lors de l\'envoi de l\'e-mail de vérification';
            this.emailSending = false; // Désactiver l'indicateur de chargement une fois l'email envoyé

          }
        );
      }
    } else if (step === 'valider') {
      // Étape 2 : Vérification du code OTP
      if (this.resetFormE2.valid) {
        const otp = this.resetFormE2.get('otp')!.value;
        const email = this.resetForm.get('email')!.value;
        this.forgotPasswordService.verifyOtp(otp , email).subscribe(
          response => {
            console.log(response);
            this.otpSent = true; // Marquer l'OTP comme envoyé avec succès
            this.otpVerified = true; // Marquer l'OTP comme vérifié avec succès
          },
          error => {
            console.log(error);
            this.error = 'Veuillez verifier le CODE OTP';
          }
        );
      }
    } else if (step === 'done') {
      // Étape 3 : Changement du mot de passe
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
