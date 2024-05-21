import { Component, OnInit, ViewChild } from '@angular/core';
import { Prestation } from 'src/app/Models/Prestation';
import { PrestationService } from 'src/app/Services/prestation-service.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ERole, Role } from 'src/app/Models/Role';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataSharingService } from 'src/app/Services/data-sharing-service.service';
import { StorageServiceService } from 'src/app/Services/storage-service.service';
import { User } from 'src/app/Models/User';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  prestations: Prestation[] = [];
  prestation: Prestation;
  dataSource = new MatTableDataSource<Prestation>([]);
  totalItems = 0;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 15, 20, 25, 30, 35, 40];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  currentPage = 0;
  selectedRole: ERole | null = null;
  availableRoles: Role[] = [];
  searchMatricule: string = '';
  selectedPrestations: Prestation[] = [];
  user:User ;


  constructor(
    private prestationService: PrestationService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dataSharingService: DataSharingService,
    private storageService: StorageServiceService
  ) { }

  ngOnInit(): void {
    this.user = this.storageService.getUser();
    this.getPrestationsWithActes();
    this.initializeRoles();
  }

  getPrestationsWithActes(): void {
    this.prestationService.findAllWithActesAndContreVisite(this.user.id).subscribe(
      (prestations) => {
        console.log(prestations)
        this.prestations = prestations;
        this.totalItems = this.prestations.length;
        this.applyFilter();
      },
      (error) => {
        console.error('Error fetching prestations:', error);
      }
    );
  }

  applyFilter(): void {
    this.dataSource.data = this.selectedRole
      ? this.prestations.filter((prestation) => {
        if (prestation.user.roles && prestation.user.roles.length > 0) {
          return prestation.user.roles.some(
            (role) => role.name === this.selectedRole
          );
        } else {
          return false;
        }
      })
      : this.prestations;

    if (this.searchMatricule) {
      this.applyMatriculeFilter();
    }
    this.resetPaginator();
  }

  applyMatriculeFilter(): void {
    this.dataSource.data = this.prestations.filter((prestation) => {
      return prestation.adherant.matricule.includes(this.searchMatricule);
    });
    this.resetPaginator();
  }

  initializeRoles(): void {
    this.availableRoles = Object.keys(ERole)
      .filter((key) => isNaN(Number(ERole[key])))
      .map((key) => ({ id: ERole[key], name: ERole[key] }));
  }

  onPageChange(event: PageEvent): void {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.dataSource.data = this.prestations.slice(startIndex, endIndex);
    this.currentPage = event.pageIndex;
  }

  resetPaginator(): void {
    if (this.paginator) {
      this.paginator.firstPage();
    }
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

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
    });
  }

  updateCheckboxStates() {
    if (this.selectedPrestations.length === 0) {
      // Si aucune prestation n'est sélectionnée, toutes les cases à cocher sont activées
      this.prestations.forEach(prestation => prestation.disabled = false);
    } else {
      const selectedBeneficiaireId = this.selectedPrestations[0].beneficiaire ? this.selectedPrestations[0].beneficiaire.id : null;
      const selectedAdherantId = this.selectedPrestations[0].adherant.id;

      this.prestations.forEach(prestation => {
        const currentBeneficiaireId = prestation.beneficiaire ? prestation.beneficiaire.id : null;
        const currentAdherantId = prestation.adherant.id;

        prestation.disabled =
          (selectedBeneficiaireId !== currentBeneficiaireId) ||
          (selectedAdherantId !== currentAdherantId) ||
          (selectedBeneficiaireId === null && prestation.beneficiaire !== null) ||
          (selectedBeneficiaireId !== null && prestation.beneficiaire === null);
      });
    }
  }


  onCheckboxChange(prestation: Prestation) {
    if (prestation.selected) {
      this.selectedPrestations.push(prestation);
    } else {
      this.selectedPrestations = this.selectedPrestations.filter(item => item !== prestation);
    }
    this.updateCheckboxStates();
  }




  addReport(): void {
    this.dataSharingService.setSelectedPrestations(this.selectedPrestations);
    this.router.navigate(['/menu/dentc/rapportCV']);
  }

  hasSelection(): boolean {
    return this.selectedPrestations.length > 0;
  }
}
