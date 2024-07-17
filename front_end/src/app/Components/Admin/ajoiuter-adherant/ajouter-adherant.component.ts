import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Adherant } from 'src/app/Models/Adherant';
import { Assurance } from 'src/app/Models/Assurance';
import { AdherantService } from 'src/app/Services/adherant.service';
import { AssuranceService } from 'src/app/Services/assurance.service';

@Component({
  selector: 'app-ajoiuter-adherant',
  templateUrl: './ajoiuter-adherant.component.html',
  styleUrls: ['./ajoiuter-adherant.component.css']
})
export class AjoiuterAdherantComponent implements OnInit {
  
 assurances: Assurance[] = [];
  adherantForm: FormGroup;
  
  constructor(private fb: FormBuilder,
              private adherantService: AdherantService,
              private assuranceService: AssuranceService,
              private route :Router) { }

  ngOnInit(): void {
  
    this.adherantForm = this.fb.group({
      cin: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      nom: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      prenom: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      sexe: ['', Validators.required],
      numtel: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      dateNais: ['', Validators.required],
      gouvNais: ['', Validators.required],  
      paysNais: ['', Validators.required],
      email: ['', Validators.required],
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
  

  onSubmit(): void {
    if (this.adherantForm.valid) {
      const adherantData = this.adherantForm.value;

      this.adherantService.ajouterAdherant(adherantData, this.adherantForm.value.assuranceId).subscribe(
        (response) => {
          console.log('Adhérant ajouté avec succès :', response);
          this.route.navigate(['/menu/admin/adherants']); 
        },
        (error) => {
          console.error('Erreur lors d ajout d adhérant :', error);
        }
      );
    } else {
      this.adherantForm.markAllAsTouched();
    }
  
}


  onReset (){
    this.adherantForm.reset();
  }

}

