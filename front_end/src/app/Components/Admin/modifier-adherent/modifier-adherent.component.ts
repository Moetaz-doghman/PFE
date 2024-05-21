import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Adherant } from 'src/app/Models/Adherant';
import { Assurance } from 'src/app/Models/Assurance';
import { Beneficiaire } from 'src/app/Models/Beneficiaire';
import { AdherantService } from 'src/app/Services/adherant.service';
import { AssuranceService } from 'src/app/Services/assurance.service';

@Component({
  selector: 'app-modifier-adherent',
  templateUrl: './modifier-adherent.component.html',
  styleUrls: ['./modifier-adherent.component.css']
})
export class ModifierAdherentComponent implements OnInit{
  adherantForm: FormGroup;
  adherentId: number;
  adherant: Adherant;
  assurances: Assurance[];

  constructor(
    private fb: FormBuilder,
    private adherantService: AdherantService,
    private assuranceService: AssuranceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAdherent();
   

    this.adherantForm = this.fb.group({
      cin: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      matricule: ['', Validators.required],
      nom: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      prenom: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      sexe: ['', Validators.required],
      numtel: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      dateNais: ['', Validators.required],
      gouvNais: ['', Validators.required],  
      paysNais: ['', Validators.required],
      plafond: ['', Validators.required],
      assuranceId: [0 , Validators.required],
    });

    this.assuranceService.getAllAssurances().subscribe(
      (assurances: Assurance[]) => {
        this.assurances = assurances;
      },
      (error) => {
        console.error('Erreur lors de la récupération des assurances :', error);
      }
    );
  }

  loadAdherent(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.adherantService.getAdherantById(id).subscribe(
      (adherent: Adherant) => {
        this.adherant = adherent;

        this.adherantForm.patchValue({
          cin: adherent.cin,
          matricule: adherent.matricule,
          nom: adherent.nom,
          prenom: adherent.prenom,
          sexe: adherent.sexe,
          numtel: adherent.numtel,
          dateNais: adherent.dateNais,
          gouvNais: adherent.gouvNais,
          paysNais: adherent.paysNais,
          plafond: adherent.plafond,
          assuranceId: adherent.assurance.id,
        });
      },
      (error) => {
        console.error('Erreur lors du chargement du bénéficiaire :', error);
      }
    );
  }


onSubmit(): void {
  if (this.adherantForm.valid) {
    const id = +this.route.snapshot.paramMap.get('id');
    const adherentData = this.adherantForm.value;
    const assuranceId = adherentData.assuranceId; 
    delete adherentData.assuranceId; 
    console.log(adherentData);
    this.adherantService.modifierAdherent(id, adherentData, assuranceId) 
      .subscribe(
        (adherent) => {
          console.log('Adhérent modifié avec succès :', adherent);
          this.router.navigate(['menu/admin/adherants']);
        },
        (error) => {
          console.error(
            'Erreur lors de la modification du adhérent :',
            error
          );
        }
      );
  } else {
    this.adherantForm.markAllAsTouched();
  }
}



  goBack(): void {
    window.history.back();
  }

  onReset(): void {
    this.loadAdherent();
  }

 
}
