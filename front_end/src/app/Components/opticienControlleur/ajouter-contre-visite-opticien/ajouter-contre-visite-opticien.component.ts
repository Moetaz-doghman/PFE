import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdherantService } from 'src/app/Services/adherant.service';
import { Adherant } from 'src/app/Models/Adherant';
import { Prestation } from 'src/app/Models/Prestation';
import { PrestationService } from 'src/app/Services/prestation-service.service';
import { StorageServiceService } from 'src/app/Services/storage-service.service';
import { User } from 'src/app/Models/User';
import { Efavore } from 'src/app/Models/Efavore';
import { Route, Router } from '@angular/router';
import { Beneficiaire } from 'src/app/Models/Beneficiaire';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-ajouter-contre-visite-opticien',
  templateUrl: './ajouter-contre-visite-opticien.component.html',
  styleUrls: ['./ajouter-contre-visite-opticien.component.css']
})
export class AjouterContreVisiteOpticienComponent implements OnInit {

  assuranceNom: string = "";
  matricule: string = "";
  adherant: Adherant ;
  assuranceNames: string[] = [];
  prestations: Prestation[] = [];
  user:User ;
  selectedPrestation: Prestation | null = null;
  isFavored: boolean;
  isUnfavored: boolean;
  beneficiaire: Beneficiaire;
  searchPerformed: boolean = false;


constructor(private adherantService: AdherantService, private snackBar: MatSnackBar , private prestation_service :PrestationService,
  private storageService: StorageServiceService , private router:Router , private adherant_service:AdherantService
 ) {}

  ngOnInit(): void {
    this.user = this.storageService.getUser();
    this.searchAssuranceNames();



  }
  searchAdherant() {
    this.adherantService.findbyAssuranceandMAtricule(this.assuranceNom, this.matricule)
      .subscribe(
        (data: Adherant) => {
          this.adherant = data;
          console.log(this.adherant);
          this.searchPerformed = true;
          this.getPrestations();

          if (!this.adherant) {
            this.openSnackBar('Aucun adhérent trouvé');
          }
        },
        (error) => {
          console.error('Erreur lors de la recherche de l\'adhérent', error);
          this.openSnackBar('Erreur lors de la recherche de l\'adhérent');
        }
      );
  }
  searchAssuranceNames() {
    this.adherantService.getAllAssuranceNames()
      .subscribe(
        (data: string[]) => {
          this.assuranceNames = data;
          console.log('Liste des noms des assurances :', this.assuranceNames);
        },
        error => {
          console.error('Erreur lors de la récupération des noms des assurances', error);
        }
      );
  }

   openSnackBar(message: string) {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000
    });
  }


  getPrestations(): void {
    this.prestation_service.getPrestationsByAdherantAssuranceAndUserController(this.assuranceNom, this.matricule, this.user.id)
      .subscribe(
        (data: Prestation[]) => {
          this.prestations = data;

          console.log('Prestations:', this.prestations);
        },
        error => {
          console.error('Erreur lors de la récupération des prestations:', error);
        }
      );
  }

  getBeneficiaireDetails(id: number) {
    return this.adherantService.getBeneficiaireById(id);
  }

  showDetails(prestation: Prestation): void {
    this.selectedPrestation = prestation;

    // if(this.isFavored)
    // {prestation.favore === 'favore'; }
    // else {
    //   prestation.favore ==="non_favore"
    // }
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
  const favore: Efavore = this.isFavored ? Efavore.Favore : Efavore.NonFavore;
  const beneficiaireId = this.selectedPrestation.beneficiaireId;

  if (beneficiaireId !== null) {
    this.prestation_service.ajouterPrestationContreVisitePourBeneficiaire(
      this.user.id,
      parseInt(beneficiaireId),
      idPrestationOrdinaires,
      adherantIds,
      favore
    ).subscribe(
      (response) => {
        console.log('Prestation ajoutée avec succès:', response);
        this.router.navigate(['/menu/optc/prestationCOntreVisite']);
      },
      (error) => {
        console.error('Erreur lors de l\'ajout de la prestation:', error);
      }
    );
  } else {
    this.prestation_service.ajouterPrestationContreVisite1(
      idPrestationOrdinaires,
      adherantIds,
      this.user.id,
      favore
    ).subscribe(
      (response) => {
        console.log('Prestation ajoutée avec succès:', response);
        this.router.navigate(['/menu/optc/prestationCOntreVisite']);
      },
      (error) => {
        console.error('Erreur lors de l\'ajout de la prestation:', error);
      }
    );
  }
}

}


