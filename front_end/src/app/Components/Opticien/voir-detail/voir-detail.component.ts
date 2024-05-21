import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PrestationService } from 'src/app/Services/prestation-service.service';
import { StorageServiceService } from 'src/app/Services/storage-service.service';
import { ResumeDialogComponent } from '../../Dentiste/resume-dialog/resume-dialog.component';

@Component({
  selector: 'app-voir-detail',
  templateUrl: './voir-detail.component.html',
  styleUrls: ['./voir-detail.component.css']
})
export class VoirDetailComponent implements OnInit {
  currentDate: string = new Date().toISOString();

  constructor(
    public dialogRef: MatDialogRef<ResumeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: PrestationService, private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private storageService: StorageServiceService
  ) { }

  ngOnInit(): void {

    // console.log(this.data.totalCotation)

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  

  validerPrestation(isBeneficiaire): void {
    if(isBeneficiaire){
      this.service.ajouterPrestationBenPourOpticien(
        this.data.adherant.id,
      this.storageService.getUser().id,
      this.data.adherant.beneficiaires[0].id,
      this.data.sphereD,
      this.data.axeD,
      this.data.acuiteD,
      this.data.sphereG,
      this.data.axeG,
      this.data.acuiteG,
      this.data.valeurVerreOeilGauche,
      this.data.valeurVerreOeilDroit,
      this.data.valeurMonture,
        
      ).subscribe(
        (response) => {
          this.openSnackBar('Requête réussie');
           this.dialog.closeAll(); // Ferme tous les dialogs ouverts

        },
        (error) => {
          this.openSnackBar('Erreur lors de la requête');

        }
      );

    } else{
    this.service.ajouterPrestationPourOpticien(
      this.data.adherant.id,
      this.storageService.getUser().id,
      this.data.sphereD,
      this.data.axeD,
      this.data.acuiteD,
      this.data.sphereG,
      this.data.axeG,
      this.data.acuiteG,
      this.data.valeurVerreOeilGauche,
      this.data.valeurVerreOeilDroit,
      this.data.valeurMonture,

    ).subscribe(
      (response) => {
        this.openSnackBar('Requête réussie');
         this.dialog.closeAll(); 

      },
      (error) => {
        this.openSnackBar('Erreur lors de la requête');

      }
    );
    
  }
  }

  openSnackBar(message: string): void {
    this._snackBar.open(message, 'Fermer', {
      duration: 2000,
    });
  }




}
