import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Adherant } from 'src/app/Models/Adherant';
import { Beneficiaire } from 'src/app/Models/Beneficiaire';
import { Efavore } from 'src/app/Models/Efavore';
import { Prestation } from 'src/app/Models/Prestation';
import { User } from 'src/app/Models/User';
import { AdherantService } from 'src/app/Services/adherant.service';
import { PrestationService } from 'src/app/Services/prestation-service.service';
import { StorageServiceService } from 'src/app/Services/storage-service.service';

@Component({
  selector: 'app-ajouter-contre-visite-dentiste',
  templateUrl: './ajouter-contre-visite-dentiste.component.html',
  styleUrls: ['./ajouter-contre-visite-dentiste.component.css'],
})
export class AjouterContreVisiteDentisteComponent implements OnInit {
  assuranceNom: string = '';
  matricule: string = '';
  adherant: Adherant;
  assuranceNames: string[] = [];
  prestations: Prestation[] = [];
  user: User;
  selectedPrestation: Prestation | null = null;
  isFavored: boolean;
  isUnfavored: boolean;
  beneficiaire: Beneficiaire;
  searchPerformed: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private adherantService: AdherantService,
    private snackBar: MatSnackBar,
    private prestation_service: PrestationService,
    private storageService: StorageServiceService,
    private router: Router,
    private adherant_service: AdherantService
  ) {}

  ngOnInit(): void {
    this.user = this.storageService.getUser();
    this.searchAssuranceNames();

    const savedAssuranceNom = localStorage.getItem('assuranceNom');
    const savedMatricule = localStorage.getItem('matricule');

    if (savedAssuranceNom && savedMatricule) {
      this.assuranceNom = savedAssuranceNom;
      this.matricule = savedMatricule;
      this.searchAdherant();
    }
  }

  searchAdherant() {
    this.adherantService
      .findbyAssuranceandMAtricule(this.assuranceNom, this.matricule)
      .subscribe(
        (data: Adherant) => {
          this.adherant = data;
          console.log(this.adherant);
          this.getPrestations();
          if (!this.adherant) {
            this.openSnackBar('Aucun adhérent trouvé');
          }
          this.searchPerformed = true;
          localStorage.removeItem('assuranceNom');
          localStorage.removeItem('matricule');
        },
        (error) => {
          console.error("Erreur lors de la recherche de l'adhérent", error);
          this.openSnackBar("Erreur lors de la recherche de l'adhérent");
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

  getPrestations(): void {
    this.prestation_service
      .getPrestationsByAdherantAssuranceAndUserController(
        this.assuranceNom,
        this.matricule,
        this.user.id
      )
      .subscribe(
        (data: Prestation[]) => {
          this.prestations = data;
          console.log('Prestations:', this.prestations);
        },
        (error) => {
          console.error(
            'Erreur lors de la récupération des prestations:',
            error
          );
        }
      );
  }

  getBeneficiaireDetails(id: number) {
    return this.adherantService.getBeneficiaireById(id);
  }

  showDetails(prestation: Prestation): void {
    this.selectedPrestation = prestation;

    if (this.selectedPrestation.beneficiaireId) {
      let beneficiareid = parseInt(this.selectedPrestation.beneficiaireId);
      this.adherantService.getBeneficiaireById(beneficiareid).subscribe(
        (response) => {
          this.beneficiaire = response;
        },
        (error) => {
          console.error('Error adding adherent', error);
        }
      );
    } else {
      this.beneficiaire = null;
    }
  }

  setFavored(event: any): void {
    if (event.target.checked) {
      this.isFavored = true;
    } else {
      this.isUnfavored = false;
    }
  }

  setUnfavored(event: any): void {
    if (event.target.checked) {
      this.isFavored = false;
    } else {
      this.isUnfavored = true;
    }
  }

  ajouterContreVisite(idPrestationOrdinaires: number, adherantIds: number) {
    const assuranceNom = this.assuranceNom;
    const matricule = this.matricule;

    const favore: Efavore = this.isFavored ? Efavore.Favore : Efavore.NonFavore;
    const beneficiaireId = this.selectedPrestation.beneficiaireId;
    if (beneficiaireId !== null) {
      this.prestation_service
        .ajouterPrestationContreVisitePourBeneficiaireDentiste(
          this.user.id,
          parseInt(beneficiaireId),
          idPrestationOrdinaires,
          adherantIds,
          favore
        )
        .subscribe(
          (response) => {
            console.log('Prestation ajoutée avec succès:', response);
            localStorage.setItem('assuranceNom', assuranceNom);
            localStorage.setItem('matricule', matricule);
            window.location.reload();
          },
          (error) => {
            this.errorMessage = 'le plafond du bénéficire est insuffisant';

            console.error("Erreur lors de l'ajout de la prestation:", error);
          }
        );
    } else {
      this.prestation_service
        .ajouterPrestationContreVisite1PourDentiste(
          idPrestationOrdinaires,
          adherantIds,
          this.user.id,
          favore
        )
        .subscribe(
          (response) => {
            console.log('Prestation ajoutée avec succès:', response);
            localStorage.setItem('assuranceNom', assuranceNom);
            localStorage.setItem('matricule', matricule);
            window.location.reload();
          },
          (error) => {
            this.errorMessage = "le plafond de l'adhérant est insuffisant";

            console.error("Erreur lors de l'ajout de la prestation:", error);
          }
        );
    }
  }

  closeModal(): void {
    this.errorMessage = '';
  }
}
