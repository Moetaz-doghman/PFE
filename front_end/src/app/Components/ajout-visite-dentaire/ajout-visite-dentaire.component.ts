import { Component, OnInit, Inject, Input, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResumeDialogComponent } from '../Dentiste/resume-dialog/resume-dialog.component';
import { PrestationService } from 'src/app/Services/prestation-service.service';

@Component({
  selector: 'app-ajout-visite-dentaire',
  templateUrl: './ajout-visite-dentaire.component.html',
  styleUrls: ['./ajout-visite-dentaire.component.css'],
})
export class AjoutVisiteDentaireComponent implements OnInit, AfterContentChecked {
  isBeneficiaire: boolean = false;
  selectedBeneficiaireIndex: number;

  @Input() adherant: any;
  currentDate: string = new Date().toISOString();
  actesDentaires: any[] = [
    { name: 'Consultation', selected: false, disabled: false },
    { name: 'Soins Dentaire', selected: false, disabled: false },
    { name: 'Prothese', selected: false, disabled: false },
    { name: 'ODF', selected: false, disabled: false },
  ];

  dentaireForm: FormGroup;
  showSecondPage: boolean = false;
  showCalculation: boolean = false;
  showFormControls: boolean = false;

  totalOrdonnance: number = 0;
  montantTicketModerateur: number = 0;
  montantRembourse: number = 0;

  plafondErrorMessage: string = '';

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private calculationService: PrestationService, // Assurez-vous d'avoir un service pour les calculs
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.adherant = this.data.adherant;
    this.isBeneficiaire = this.data.isBeneficiaire;
    this.selectedBeneficiaireIndex = this.data.selectedBeneficiaireIndex;


    this.dentaireForm = this.formBuilder.group({
      totalCot: ['', Validators.required],
    });

    this.actesDentaires.forEach((acte) => (acte.selected = false));
  }

  calculer(): void {
    const selectedActes = this.actesDentaires
      .filter(acte => acte.selected)
      .map(acte => acte.name);

    const requestData = {
      adherantId: this.adherant.id,
      actes: selectedActes,
      totalCotation: this.dentaireForm.get('totalCot').value,
      assuranceId: this.adherant.assurance.id,
      assuranceName: this.adherant.assurance.nom
    };

    this.calculationService.calculate(requestData).subscribe(response => {
      this.totalOrdonnance = response.totalOrdonnance;
      this.montantTicketModerateur = response.montantTicketModerateur;
      this.montantRembourse = response.montantRembourse;
      this.showCalculation = true;
    });
  }


  openResumeDialog(): void {
    const dialogRef = this.dialog.open(ResumeDialogComponent, {
      width: '400px',
      data: {
        adherant: this.adherant,
        actesDentaires: this.actesDentaires,
        totalOrdonnance: this.totalOrdonnance,
        montantTicketModerateur: this.montantTicketModerateur,
        montantRembourse: this.montantRembourse,
        isBeneficiaire: this.isBeneficiaire,
        totalCotation: this.dentaireForm.get('totalCot').value,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  isNextButtonEnabled(): boolean {
    const selectedActes = this.actesDentaires.filter(acte => acte.selected);
    console.log('Selected Actes:', selectedActes);
    return (
      this.dentaireForm.valid  &&
      (this.showCalculation || (selectedActes.length === 1 && selectedActes[0].name === 'Consultation')) &&
      !this.plafondCheck() &&
      (this.totalOrdonnance !== 0 || selectedActes.some(acte => acte.name === 'Consultation')) &&
      (this.montantTicketModerateur !== 0 || selectedActes.some(acte => acte.name === 'Consultation')) &&
      (this.montantRembourse !== 0 || selectedActes.some(acte => acte.name === 'Consultation'))
    );
  }

  isCalculateButtonEnabled(): boolean {
    return this.dentaireForm.get('totalCot').value.trim() !== '';
  }

  ngAfterContentChecked(): void {
    this.plafondCheck();
  }

  plafondCheck(): boolean {
    if (this.totalOrdonnance > this.data.adherant.plafond) {
      this.plafondErrorMessage = "Le montant total de la prestation dépasse le plafond de l'adhérent (" + this.data.adherant.plafond + ").";
      return true;
    } else {
      this.plafondErrorMessage = "";
      return false;
    }
  }

  toggleActeSelection(acte: any): void {
    acte.selected = !acte.selected;
    this.updateActesStatus();
    this.updateFormControlsVisibility();
    this.updateDefaultValues();
  }

  updateActesStatus(): void {
    const selectedActes = this.actesDentaires.filter(acte => acte.selected).map(acte => acte.name);
    if (selectedActes.includes('Consultation')) {
      this.actesDentaires.forEach(acte => {
        acte.disabled = (selectedActes.length > 1 && acte.name !== 'Consultation' && !selectedActes.includes(acte.name));
      });
    } else {
      this.actesDentaires.forEach(acte => {
        if (selectedActes.includes('Soins Dentaire')) {
          acte.disabled = acte.name !== 'Consultation' && acte.name !== 'Soins Dentaire';
        } else if (selectedActes.includes('ODF')) {
          acte.disabled = acte.name !== 'Consultation' && acte.name !== 'ODF';
        } else if (selectedActes.includes('Prothese')) {
          acte.disabled = acte.name !== 'Consultation' && acte.name !== 'Prothese';
        } else {
          acte.disabled = false;
        }
      });
    }
  }

  updateFormControlsVisibility(): void {
    const selectedActes = this.actesDentaires.filter(acte => acte.selected).map(acte => acte.name);
    this.showFormControls = selectedActes.includes('Consultation') && selectedActes.length > 1;
  }

  updateDefaultValues(): void {
    const selectedActes = this.actesDentaires.filter(acte => acte.selected).map(acte => acte.name);
    if (selectedActes.length === 1 && selectedActes.includes('Consultation')) {
      this.totalOrdonnance = 40;
      this.montantTicketModerateur = 10;
      this.montantRembourse = 30;
      this.showCalculation = true;
    } else {
      this.totalOrdonnance = 0;
      this.montantTicketModerateur = 0;
      this.montantRembourse = 0;
      this.showCalculation = false;
    }
  }
}
