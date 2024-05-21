import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ERole, Role } from 'src/app/Models/Role';
import { User } from 'src/app/Models/User';
import { UserServiceService } from 'src/app/Services/user-service.service';

@Component({
  selector: 'app-ajouter-ps',
  templateUrl: './ajouter-ps.component.html',
  styleUrls: ['./ajouter-ps.component.css']
})
export class AjouterPsComponent implements OnInit {


  roles: ERole[] = [];
  psForm: FormGroup;
  roless: Role[];
  isLoading: boolean = false; 
  constructor(private fb: FormBuilder, private userService: UserServiceService , private route :Router) { }

  ngOnInit(): void {
    this.psForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeatPassword: ['', [Validators.required, Validators.minLength(6)]],
      nom: ['', [Validators.required,Validators.pattern(/^[a-zA-Z]+$/)]],
      prenom: ['', [Validators.required,Validators.pattern(/^[a-zA-Z]+$/)]],
      adresse: ['', Validators.required],
      tel: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      matricule: ['', [Validators.required]],
      identiteBancaire: ['', [Validators.required]],
      role: ['', Validators.required]
    });

    this.roles = Object.values(ERole).filter(role => role !== ERole.ROLE_ADMIN);

    this.psForm.setValidators(this.passwordsMatchValidator());

  }

  onSubmit(): void {
    if (this.psForm.valid) {
      const utilisateur: User = this.psForm.value;
      const roleName: string = this.psForm.get('role').value;
      this.isLoading = true;
      this.userService.ajouterUtilisateur(utilisateur, roleName).subscribe(
        (response) => {
          console.log('User added successfully:', response);
          this.psForm.reset();

          this.route.navigate(['/menu/admin/ps']);  

          this.route.navigate(['/menu/admin/ps']);
          this.isLoading = false;

        },
        (error) => {
          console.error('Error adding user:', error);
          this.isLoading = false;
        }
      );
    }
  }

  passwordsMatchValidator(): ValidatorFn {
    return (formGroup: FormGroup): ValidationErrors | null => {
      const passwordControl = formGroup.controls['password'];
      const repeatPasswordControl = formGroup.controls['repeatPassword'];

      if (repeatPasswordControl.errors && !repeatPasswordControl.hasError('mismatch')) {
        return null;
      }

      if (passwordControl.value !== repeatPasswordControl.value) {
        repeatPasswordControl.setErrors({ mismatch: true });
      } else {
        repeatPasswordControl.setErrors(null);
      }

      return null;
    };
  }

  onrest (){
    this.psForm.reset();
  }




}
