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
      sphereD: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      axeD: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      acuiteD: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      sphereG: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      axeG: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      acuiteG: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      valeurVerreMin: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      valeurVerreMax: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      prixMontureMin: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      prixMontureMax: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
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
          this.router.navigate(['/menu/optc/prestationCOntreVisite']);
        }, error => {
          console.log(error);
        });

        this.router.navigate(['/menu/optc/prestationCOntreVisite']);

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
