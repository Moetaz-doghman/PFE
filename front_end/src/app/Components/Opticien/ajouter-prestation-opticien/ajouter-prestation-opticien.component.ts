import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Adherant } from 'src/app/Models/Adherant';
import { Beneficiaire } from 'src/app/Models/Beneficiaire';
import { Prestation } from 'src/app/Models/Prestation';
import { AdherantService } from 'src/app/Services/adherant.service';
import { PrestationService } from 'src/app/Services/prestation-service.service';
import { StorageServiceService } from 'src/app/Services/storage-service.service';
import { PrestationFormComponent } from '../prestation-form/prestation-form.component';

@Component({
  selector: 'app-ajouter-prestation-opticien',
  templateUrl: './ajouter-prestation-opticien.component.html',
  styleUrls: ['./ajouter-prestation-opticien.component.css']
})
export class AjouterPrestationOpticienComponent {

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

  ) {}

  ngOnInit(): void {
    this.searchAssuranceNames();
    const savedAssuranceNom = localStorage.getItem('assuranceNom');
    const savedMatricule = localStorage.getItem('matricule');

    if (savedAssuranceNom && savedMatricule) {
      this.assuranceNom = savedAssuranceNom;
      this.matricule = savedMatricule;
      this.searchAdherant();
    }
    this.getPrestationsByUser();
  }

  getPrestationsByUser() {
    this.prestationService.getPrestationsByUser(this.storageService.getUser().id)
      .subscribe(
        (prestations: Prestation[]) => {
          this.prestations = prestations;
          console.log('Prestations récupérées :', this.prestations);
        },
        (error) => {
          console.error('Erreur lors de la récupération des prestations :', error);
        }
      );
  }


  searchAdherant() {
    this.adherantService
      .findbyAssuranceandMAtricule(this.assuranceNom, this.matricule)
      .subscribe(
        (data: Adherant) => {
          this.adherant = data;
          this.searchPerformed = true;
           localStorage.removeItem('assuranceNom');
           localStorage.removeItem('matricule');
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

  openAjoutPrestationOptiqueDialog(
    isBeneficiaire: boolean = false,
    index: number
  ): void {
    const dialogRef = this.dialog.open(PrestationFormComponent, {
      width: '600px',
      data: {
        adherant: this.adherant,
        isBeneficiaire: isBeneficiaire,
        selectedBeneficiaireIndex: index,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  showDetails(prestation: Prestation): void {
    this.selectedPrestation = prestation;
    if (this.selectedPrestation.beneficiaireId) {
      let beneficiareid =parseInt(this.selectedPrestation.beneficiaireId);
      this.adherantService.getBeneficiaireById(beneficiareid)
      .subscribe(
        (response) => {
          this.beneficiaire =response
        },
        (error) => {
          console.error('Error adding adherent', error);
        }
      );
    }
    else {
      this.beneficiaire = null ;
    }
  }




}
