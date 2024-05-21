import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PrestationService } from 'src/app/Services/prestation-service.service';
import { StorageServiceService } from 'src/app/Services/storage-service.service';

@Component({
  selector: 'app-resume-dialog',
  templateUrl: './resume-dialog.component.html',
  styleUrls: ['./resume-dialog.component.css']
})
export class ResumeDialogComponent implements OnInit {
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

  getActesDentairesChoisis(): string {
    return this.data.actesDentaires
      .filter(acte => acte.selected)
      .map(acte => acte.name)
      .join(',');
  }

  validerPrestation(isBeneficiaire): void {

    if(isBeneficiaire){
      this.service.ajouterPrestationBenefPourDentiste(
        this.data.adherant.id,
        this.data.totalOrdonnance,
        this.data.montantRembourse,
        this.data.montantTicketModerateur,
        this.currentDate,
        'D',
        this.getActesDentairesChoisis().replace(/\s+/g, ''),
        this.data.adherant.beneficiaires[0].id,
        this.storageService.getUser().id,
        this.data.totalCotation
      ).subscribe(
        (response) => {
          this.openSnackBar('Requête réussie');
           this.dialog.closeAll(); // Ferme tous les dialogs ouverts

        },
        (error) => {
          this.openSnackBar('Erreur lors de la requête');

        }
      );

    } else {
      this.service.ajouterPrestationPourDentiste(
        this.data.adherant.id,
        this.data.totalOrdonnance,
        this.data.montantRembourse,
        this.data.montantTicketModerateur,
        this.currentDate,
        'D',
        this.getActesDentairesChoisis().replace(/\s+/g, ''),
        this.storageService.getUser().id,
        this.data.totalCotation
      ).subscribe(
        (response) => {
          this.openSnackBar('Requête réussie');
           this.dialog.closeAll(); // Ferme tous les dialogs ouverts

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

