import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Beneficiaire } from 'src/app/Models/Beneficiaire';
import { BeneficiaireService } from 'src/app/Services/beneficiaire.service';

@Component({
  selector: 'app-beneficiaire-list',
  templateUrl: './beneficiaire-list.component.html',
  styleUrls: ['./beneficiaire-list.component.css'],
})
export class BeneficiaireListComponent implements OnInit {
  beneficiaires: Beneficiaire[] = [];
  selectedBeneficiaire: Beneficiaire | null = null;

  constructor(
    private beneficiaireService: BeneficiaireService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBeneficiaires();
  }

  loadBeneficiaires(): void {
    this.beneficiaireService.getAllBeneficiaires().subscribe(
      (data: Beneficiaire[]) => {
        this.beneficiaires = data;
        console.log(data);
      },
      (error: any) => {
        console.log('Error fetching beneficiaires:', error);
      }
    );
  }

  confirmDelete(beneficiaire: Beneficiaire): void {
    this.selectedBeneficiaire = beneficiaire;
  }

  deleteBeneficiaire(): void {
    if (this.selectedBeneficiaire) {
      this.beneficiaireService
        .deleteBeneficiaire(this.selectedBeneficiaire.id)
        .subscribe(
          () => {
            this.loadBeneficiaires();
          },
          (error: any) => {
            console.log('Error deleting beneficiaire:', error);
          }
        );
    }
  }

  UpdateBeneficiareDetails(prestationId: number): void {
    this.router.navigate(['menu/admin/modifierBeneficiaire', prestationId]);
  }

  addButton()
  {
    this.router.navigate(['menu/admin/ajouterBeneficiaire']);
  }
}
