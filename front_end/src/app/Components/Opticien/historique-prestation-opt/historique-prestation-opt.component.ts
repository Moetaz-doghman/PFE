import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Beneficiaire } from 'src/app/Models/Beneficiaire';
import { Prestation } from 'src/app/Models/Prestation';
import { User } from 'src/app/Models/User';
import { AdherantService } from 'src/app/Services/adherant.service';
import { PrestationService } from 'src/app/Services/prestation-service.service';
import { StorageServiceService } from 'src/app/Services/storage-service.service';

@Component({
  selector: 'app-historique-prestation-opt',
  templateUrl: './historique-prestation-opt.component.html',
  styleUrls: ['./historique-prestation-opt.component.css']
})
export class HistoriquePrestationOptComponent  implements OnInit  {


  prestations: Prestation[] = [];
  selectedPrestation: Prestation | null = null;
  selectedPrestations: Prestation | null = null;
  user:User ;
  beneficiaire: Beneficiaire;
  today: Date = new Date();
  downloadingPDF: boolean = false;
  showSecondContainer: boolean = false;
  prestationRapport : Prestation | null = null;
  qrCodeURL: string;



  constructor(private prestation_service :PrestationService,
    private storageService: StorageServiceService , private router:Router , private adherant_service:AdherantService)
    {}


  ngOnInit(): void {

    this.user = this.storageService.getUser();
    this.getPrestations()

  }

  getPrestations(): void {
    this.prestation_service.getPrestationsByUser(this.user.id)
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
    console.log(prestation)
    let activePrestation = prestation.id;
    console.log(activePrestation)
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


  getStatusBadgeClass(roleStatus: boolean): string {
    if (roleStatus) {
      return 'bg-success';
    } else {
      return 'bg-danger';
    }
  }

  getStatusText(roleStatus: boolean): string {
    return roleStatus ? 'facturé' : 'non facturé';
  }

  getRoleBadgeClass(roleName: string): string {
    switch (roleName) {
      case 'Consultation':
        return 'bg-secondary';
      case 'SoinsDentaire':
        return 'bg-primary';
      case 'ODF':
        return 'bg-info';
      default:
        return 'bg-dark';
    }
  }






}






