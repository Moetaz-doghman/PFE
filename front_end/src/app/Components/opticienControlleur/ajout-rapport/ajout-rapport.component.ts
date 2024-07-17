import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Prestation } from 'src/app/Models/Prestation';
import { Rapport_C_V_Optcien } from 'src/app/Models/Rapport_C_V_Optcien ';
import { PrestationService } from 'src/app/Services/prestation-service.service';
import { RapportServiceService } from 'src/app/Services/rapport-service.service';

@Component({
  selector: 'app-ajout-rapport',
  templateUrl: './ajout-rapport.component.html',
  styleUrls: ['./ajout-rapport.component.css']
})


export class AjoutRapportComponent implements OnInit {

  prestation: Prestation;
  rapportForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private prestationDetailService: PrestationService,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private rapport_service :RapportServiceService
  ) {}

  ngOnInit(): void {
    this.getPrestationDetail();
    this.rapportForm = this.fb.group({
      observation: ['', Validators.required],
      sphereD: ['', [Validators.required]],
      axeD: ['', [Validators.required]],
      acuiteD: ['', [Validators.required]],
      sphereG: ['', [Validators.required]],
      axeG: ['', [Validators.required]],
      acuiteG: ['', [Validators.required]],
      valeurVerreMin: ['', [Validators.required]],
      valeurVerreMax: ['', [Validators.required]],
      prixMontureMin: ['', [Validators.required]],
      prixMontureMax: ['', [Validators.required]],
      natureVerre: ['', Validators.required]
    });


  }


  onSubmit(): void {
    if (this.rapportForm.valid) {
      const formData: Rapport_C_V_Optcien = this.rapportForm.value;
      this.rapport_service.ajouterRapportOpticien(formData ,this.prestation.id)
        .subscribe(response => {
          console.log(response);
          this.rapportForm.reset();
          this.router.navigate(['/menu/optc/prestationCOntreVisite'], { queryParamsHandling: 'preserve' });
        }, error => {
          console.log(error);
        });


    }
  }

  onrest (){
    this.rapportForm.reset();
  }



  getPrestationDetail(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.prestationDetailService
      .getPrestationsWithActesAndBenefById(id)
      .subscribe(
        (detail) => {
          this.prestation = detail;
          console.log(detail);
        },
        (error) => {
          console.error('Error fetching prestations detail:', error);
        }
      );
  }




}
