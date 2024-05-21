import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Adherant } from 'src/app/Models/Adherant';
import { Assurance } from 'src/app/Models/Assurance';
import { AdherantService } from 'src/app/Services/adherant.service';
import { AssuranceService } from 'src/app/Services/assurance.service';
import { BeneficiaireService } from 'src/app/Services/beneficiaire.service';


@Component({
  selector: 'app-ajouter-beneficiaire',
  templateUrl: './ajouter-beneficiaire.component.html',
  styleUrls: ['./ajouter-beneficiaire.component.css']
})
export class AjouterBeneficiaireComponent implements OnInit {
  adherants : Adherant[] = [];
  beneficiaireForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private beneficiaireService: BeneficiaireService,
    private router: Router,
    private adherantService : AdherantService
  ) {}

  ngOnInit(): void {
    this.beneficiaireForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      prenom: ['', [Validators.required, Validators.minLength(3)]],
      sexe: ['', Validators.required],
      dateNais: ['', [Validators.required, this.dateOfBirthValidator()]],
      qualite: ['', Validators.required],
      plafond: ['', Validators.required],
      adherant: ['', Validators.required]
    });

    this.loadAdherant();
  }

  loadAdherant(): void {
    this.adherantService.getAllAdherants().subscribe(
      (adherants: Adherant[]) => {
        this.adherants = adherants;
      },
      (error) => {
        console.error('Erreur lors de la récupération des adherants :', error);
      }
    );
  }

  onSubmit(): void {
    if (this.beneficiaireForm.valid) {
      const beneficiaireData = this.beneficiaireForm.value;
      console.log(beneficiaireData)
      this.beneficiaireService.createBeneficiaire(beneficiaireData.adherant,beneficiaireData).subscribe(
        (beneficiaire) => {
          console.log('Bénéficiaire ajouté avec succès :', beneficiaire);
          this.router.navigate(['menu/admin/beneficiaire']);
        },
        (error) => {
          console.error('Erreur lors de l\'ajout du bénéficiaire :', error);
        }
      );
    } else {
      this.beneficiaireForm.markAllAsTouched();
    }
  }

  onReset(): void {
    this.beneficiaireForm.reset();
  }

  dateOfBirthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const currentDate = new Date();
      const selectedDate = new Date(control.value);

      if (selectedDate > currentDate) {
        return { 'invalidDateOfBirth': true };
      }
      return null;
    };
  }

  goBack(): void {
    window.history.back();
  }
}
