import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Beneficiaire } from 'src/app/Models/Beneficiaire';
import { Adherant } from 'src/app/Models/Adherant';
import { AdherantService } from 'src/app/Services/adherant.service';
import { BeneficiaireService } from 'src/app/Services/beneficiaire.service';

@Component({
  selector: 'app-modifier-beneficiaire',
  templateUrl: './modifier-beneficiaire.component.html',
  styleUrls: ['./modifier-beneficiaire.component.css'],
})
export class ModifierBeneficiaireComponent implements OnInit {
  beneficiaireForm: FormGroup;
  beneficiaireId: number;
  beneficiaire: Beneficiaire;
  adherants: Adherant[];

  constructor(
    private fb: FormBuilder,
    private beneficiaireService: BeneficiaireService,
    private adherantService: AdherantService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBeneficiaire();

    this.beneficiaireForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      prenom: ['', [Validators.required, Validators.minLength(3)]],
      sexe: ['', Validators.required],
      dateNais: ['', [Validators.required, this.dateOfBirthValidator()]],
      qualite: ['', Validators.required],
      plafond: ['', Validators.required],
      adherant: ['', Validators.required],
    });

    this.loadAdherants();
  }

  loadBeneficiaire(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.beneficiaireService.getBeneficiaireById(id).subscribe(
      (beneficiaire: Beneficiaire) => {
        this.beneficiaire = beneficiaire;
        const formattedDate = new Date(beneficiaire.dateNais).toISOString().slice(0, 16);
        this.beneficiaireForm.patchValue({
          nom: beneficiaire.nom,
          prenom: beneficiaire.prenom,
          sexe: beneficiaire.sexe || '',
          dateNais: formattedDate,
          qualite: beneficiaire.qualite,
          plafond: beneficiaire.plafond,
          adherant: beneficiaire.adherant ? beneficiaire.adherant.id : null,
        });
      },
      (error) => {
        console.error('Erreur lors du chargement du bénéficiaire :', error);
      }
    );
  }

  loadAdherants(): void {
    this.adherantService.getAllAdherants().subscribe(
      (adherants: Adherant[]) => {
        this.adherants = adherants;
      },
      (error) => {
        console.error('Erreur lors de la récupération des adhérents :', error);
      }
    );
  }

  onSubmit(): void {
    if (this.beneficiaireForm.valid) {
      const id = +this.route.snapshot.paramMap.get('id');
      const beneficiaireData = this.beneficiaireForm.value;
      console.log(beneficiaireData);
      this.beneficiaireService.updateBeneficiaire(id, beneficiaireData, beneficiaireData.adherant)
        .subscribe(
          (beneficiaire) => {
            console.log('Bénéficiaire modifié avec succès :', beneficiaire);
            this.router.navigate(['menu/admin/beneficiaire']);
          },
          (error) => {
            console.error(
              'Erreur lors de la modification du bénéficiaire :',
              error
            );
          }
        );
    } else {
      this.beneficiaireForm.markAllAsTouched();
    }
  }


  goBack(): void {
    window.history.back();
  }

  onReset(): void {
    // this.beneficiaireForm.reset();
    this.loadBeneficiaire();
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
}
