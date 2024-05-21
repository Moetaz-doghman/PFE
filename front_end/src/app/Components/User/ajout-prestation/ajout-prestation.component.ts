import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Adherant } from 'src/app/Models/Adherant';
import { AdherantService } from 'src/app/Services/adherant.service';
import { AjoutVisiteDentaireComponent } from '../../ajout-visite-dentaire/ajout-visite-dentaire.component';
import { Assurance } from 'src/app/Models/Assurance';
import { PrestationService } from 'src/app/Services/prestation-service.service';
import { Prestation } from 'src/app/Models/Prestation';
import { StorageServiceService } from 'src/app/Services/storage-service.service';
import { Beneficiaire } from 'src/app/Models/Beneficiaire';

@Component({
  selector: 'app-ajout-prestation',
  templateUrl: './ajout-prestation.component.html',
  styleUrls: ['./ajout-prestation.component.css'],
})
export class AjoutPrestationComponent {
  assuranceNom: string = '';
  matricule: string = '';
  adherant: Adherant | undefined;
  assuranceNames: string[] = [];
  selectedBeneficiaireIndex: number | undefined;
  prestations: Prestation[] = [];
  selectedPrestation: Prestation | null = null;
  beneficiaire: Beneficiaire;
  startDate: string = '';
  endDate: string = '';
  filteredPrestations: Prestation[] = [];
  searchPerformed: boolean = false;

  constructor(
    private adherantService: AdherantService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private prestationService: PrestationService,
    private storageService: StorageServiceService

  ) { }

  ngOnInit(): void {
    this.searchAssuranceNames();
  }

  getPrestationsByUserAndAdherant(userId: number, adherantId: number) {
    this.prestationService
      .getPrestationsByUserAndAdherant(userId, adherantId)
      .subscribe(
        (prestations: Prestation[]) => {
          this.prestations = prestations;
          console.log(prestations)
          console.log('Prestations récupérées :', this.prestations);
        },
        (error) => {
          console.error(
            'Erreur lors de la récupération des prestations :',
            error
          );
        }
      );
  }

  searchAdherant() {
      this.adherantService
      .findbyAssuranceandMAtricule(this.assuranceNom, this.matricule)
      .subscribe(
        (data: Adherant) => {
          this.adherant = data;
          const userId = this.storageService.getUser().id;
          this.getPrestationsByUserAndAdherant(userId, this.adherant.id);
          this.searchPerformed = true;

        },
        (error) => {
          this.openSnackBar('Aucun adhérent trouvé');
        }
      );
  }

  searchAssuranceNames() {
    this.adherantService.getAllAssuranceNames().subscribe(
      (data: string[]) => {
        this.assuranceNames = data;
        console.log('Liste des noms des assurances :', this.assuranceNames);
      },
      (error) => {
        console.error(
          'Erreur lors de la récupération des noms des assurances',
          error
        );
      }
    );
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
    });
  }

  openAjoutVisiteDentaireDialog(
    isBeneficiaire: boolean = false,
    index: number
  ): void {
    const dialogRef = this.dialog.open(AjoutVisiteDentaireComponent, {
      width: '600px', // Ajustez la largeur selon vos besoins
      data: {
        adherant: this.adherant,
        isBeneficiaire: isBeneficiaire,
        selectedBeneficiaireIndex: index,
      }, // Passer les données ici
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  showDetails(prestation: Prestation): void {
    this.selectedPrestation = prestation;
    if (this.selectedPrestation.beneficiaireId) {
      let beneficiareid = parseInt(this.selectedPrestation.beneficiaireId);
      this.adherantService.getBeneficiaireById(beneficiareid)
        .subscribe(
          (response) => {
            this.beneficiaire = response
          },
          (error) => {
            console.error('Error adding adherent', error);
          }
        );
    }
    else {
      this.beneficiaire = null;
    }
  }

}
