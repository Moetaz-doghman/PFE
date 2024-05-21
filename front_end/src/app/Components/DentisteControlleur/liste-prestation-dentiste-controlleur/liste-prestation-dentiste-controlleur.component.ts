import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Prestation } from '../../../Models/Prestation';
import { Beneficiaire } from '../../../Models/Beneficiaire';
import { Rapport_C_V_Optcien } from '../../../Models/Rapport_C_V_Optcien ';
import { User } from '../../../Models/User';
import { PrestationService } from '../../../Services/prestation-service.service';
import { StorageServiceService } from '../../../Services/storage-service.service';
import { AdherantService } from '../../../Services/adherant.service';
import { RapportServiceService } from '../../../Services/rapport-service.service';


@Component({
  selector: 'app-liste-prestation-dentiste-controlleur',
  templateUrl: './liste-prestation-dentiste-controlleur.component.html',
  styleUrls: ['./liste-prestation-dentiste-controlleur.component.css']
})
export class ListePrestationDentisteControlleurComponent implements OnInit  {


  prestations: Prestation[] = [];
  selectedPrestation: Prestation | null = null;
  selectedPrestations: Prestation | null = null;
  user:User ;
  beneficiaire: Beneficiaire | null = null;;
  beneficiaire_rapport: Beneficiaire;
  rapportOpticien :Rapport_C_V_Optcien | null = null;
  today: Date = new Date();
  downloadingPDF: boolean = false;
  showSecondContainer: boolean = false;
  prestationRapport : Prestation | null = null;



  constructor(private prestation_service :PrestationService,
    private storageService: StorageServiceService , private router:Router , private adherant_service:AdherantService,
    private rapportService: RapportServiceService ){}


  ngOnInit(): void {
    this.user = this.storageService.getUser();
    this.getPrestations()

  }

  getPrestations(): void {
    this.prestation_service.getPrestationsByUserControlleur(this.user.id)
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



  showDetails(prestation: Prestation): void {
    let activePrestation = parseInt(prestation.idPrestation);
     this.prestation_service.getPrestationsById(activePrestation) .subscribe(
      (data : Prestation) => {
        this.selectedPrestation =data
        console.log('rapport:', this.selectedPrestation);
      },
      error => {
        console.error('Erreur lors de la récupération des prestations:', error);
      }
    );
    if (this.selectedPrestation.beneficiaireId) {
      let beneficiareid =parseInt(this.selectedPrestation.beneficiaireId);
      this.adherant_service.getBeneficiaireById(beneficiareid)
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

  showPrestationDetails(prestationId: number): void {
    this.router.navigate(['/menu/optc/ajouterRapport', prestationId]);
  }

 }

