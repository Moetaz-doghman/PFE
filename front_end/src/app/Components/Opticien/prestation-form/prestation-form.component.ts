import { AfterContentChecked, Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { VoirDetailComponent } from '../voir-detail/voir-detail.component';

@Component({
  selector: 'app-prestation-form',
  templateUrl: './prestation-form.component.html',
  styleUrls: ['./prestation-form.component.css']
})
export class PrestationFormComponent implements OnInit, AfterContentChecked{

  isBeneficiaire: boolean = false;
  selectedBeneficiaireIndex: number;

  @Input() adherant: any;
  currentDate: string = new Date().toISOString();


  optiqueForm: FormGroup;
  showSecondPage: boolean = false;
  showCalculation: boolean = false;

  totalOrdonnance: number = 0;
  montantTicketModerateur: number = 0;
  montantRembourse: number = 0;

  plafondErrorMessage: string = '';

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.adherant = this.data.adherant;

    this.isBeneficiaire = this.data.isBeneficiaire;
    console.log(this.data.adherant);
    this.selectedBeneficiaireIndex = this.data.selectedBeneficiaireIndex;

    this.optiqueForm = this.formBuilder.group({
      sphereD: [0, Validators.required],
      sphereG: [0, Validators.required],
      axeD: [0, Validators.required],
      axeG: [0, Validators.required],
      acuiteD: [0, Validators.required],
      acuiteG: [0, Validators.required],
      valeurVerreOeilGauche: [0, Validators.required],
      valeurVerreOeilDroit: [0, Validators.required],
      valeurMonture: [0, Validators.required],

    });

  }

  calculer(): void {
    this.totalOrdonnance = 0;
    this.montantTicketModerateur = 0;
    this.montantRembourse = 0;

    const prixVG = this.optiqueForm.get('valeurVerreOeilGauche')?.value || 0;
    const prixVD = this.optiqueForm.get('valeurVerreOeilDroit')?.value || 0;
    const prixMont = this.optiqueForm.get('valeurMonture')?.value || 0;

    this.totalOrdonnance = prixVG + prixVD + prixMont;
    this.montantTicketModerateur = 40;
    this.montantRembourse = this.totalOrdonnance - this.montantTicketModerateur;

    if (this.totalOrdonnance > this.data.adherant.plafond) {
        this.plafondErrorMessage = "Le montant total de la prestation dépasse le plafond de l'adhérent";
        this.showCalculation = false;
    } else {
        this.plafondErrorMessage = "";
        this.showCalculation = true;
    }
}




  openResumeDialog(): void {
    const dialogRef = this.dialog.open(VoirDetailComponent, {
      width: '400px',
      data: {
        adherant: this.adherant,
        totalOrdonnance: this.totalOrdonnance,
        montantTicketModerateur: this.montantTicketModerateur,
        montantRembourse: this.montantRembourse,
        isBeneficiaire: this.isBeneficiaire,
        sphereD : this.optiqueForm.get('sphereD').value,
        sphereG : this.optiqueForm.get('sphereG').value,
        axeD : this.optiqueForm.get('axeD').value,
        axeG : this.optiqueForm.get('axeG').value,
        acuiteD : this.optiqueForm.get('acuiteD').value,
        acuiteG : this.optiqueForm.get('acuiteG').value,
        valeurVerreOeilGauche : this.optiqueForm.get('valeurVerreOeilGauche').value,
        valeurVerreOeilDroit : this.optiqueForm.get('valeurVerreOeilDroit').value,
        valeurMonture : this.optiqueForm.get('valeurMonture').value,
        selectedBeneficiaireIndex : this.selectedBeneficiaireIndex

      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  isNextButtonEnabled(): boolean {
    return (
      this.optiqueForm.valid &&
      this.showCalculation &&
      !this.plafondCheck() &&
      this.totalOrdonnance !== 0 &&
      this.montantTicketModerateur !== 0 &&
      this.montantRembourse !== 0
    );
  }


  ngAfterContentChecked(): void {
    this.plafondCheck();
  }

  plafondCheck(): boolean {
    if (this.totalOrdonnance > this.data.adherant.plafond) {
      this.plafondErrorMessage = "Le montant total de la prestation dépasse le plafond de l'adhérent";
      return true;
    } else {
      this.plafondErrorMessage = "";
      return false;
    }
  }

  toggleActeSelection(acte: any): void {
    acte.selected = !acte.selected;
  }


}
