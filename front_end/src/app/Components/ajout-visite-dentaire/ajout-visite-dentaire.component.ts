import { Component, OnInit, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResumeDialogComponent } from '../Dentiste/resume-dialog/resume-dialog.component';
import { PrestationService } from 'src/app/Services/prestation-service.service';

@Component({
  selector: 'app-ajout-visite-dentaire',
  templateUrl: './ajout-visite-dentaire.component.html',
  styleUrls: ['./ajout-visite-dentaire.component.css'],
})
export class AjoutVisiteDentaireComponent implements OnInit {
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
    private calculationService: PrestationService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.adherant = this.data.adherant;
    console.log(this.adherant)
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

    let beneficaireId: number | null = null;
    if (this.selectedBeneficiaireIndex !== null && this.adherant.beneficiaires && this.adherant.beneficiaires[this.selectedBeneficiaireIndex]) {
      beneficaireId = this.adherant.beneficiaires[this.selectedBeneficiaireIndex].id;
    }

    const requestData = {
      beneficaireId: beneficaireId, 
      adherantId: this.adherant.id,
      actes: selectedActes,
      totalCotation: this.dentaireForm.get('totalCot').value,
      assuranceId: this.adherant.assurance.id,
      assuranceName: this.adherant.assurance.nom
    };

    console.log(requestData)
    this.calculationService.calculate(requestData).subscribe(
      response => {
        this.totalOrdonnance = response.totalOrdonnance;
        this.montantTicketModerateur = response.montantTicketModerateur;
        this.montantRembourse = response.montantRembourse;
        this.showCalculation = true;
        this.plafondErrorMessage = '';
      },
      error => {
        if (error.status === 500) {
          this.plafondErrorMessage = error.error.message;
        } else {
          this.plafondErrorMessage = 'Une erreur est survenue. Veuillez réessayer plus tard.';
        }
        this.showCalculation = false;
      }
    );
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
        selectedBeneficiaireIndex: this.selectedBeneficiaireIndex
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  isNextButtonEnabled(): boolean {
    const selectedActes = this.actesDentaires.filter(acte => acte.selected);
    const isConsultationSelectedAlone = selectedActes.length === 1 && selectedActes[0].name === 'Consultation';
    const isTotalCotationCalculated = this.showCalculation;
    return isConsultationSelectedAlone || isTotalCotationCalculated;
  }

  isCalculateButtonEnabled(): boolean {
    return this.dentaireForm.get('totalCot').value.trim() !== '';
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
