import { Component, OnInit, ViewChild } from '@angular/core';
import { Prestation } from 'src/app/Models/Prestation';
import { PrestationService } from 'src/app/Services/prestation-service.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ERole, Role } from 'src/app/Models/Role';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/Models/User';
import { UserServiceService } from 'src/app/Services/user-service.service';

@Component({
  selector: 'app-list-prestation-contre-v',
  templateUrl: './list-prestation-contre-v.component.html',
  styleUrls: ['./list-prestation-contre-v.component.css'],
})
export class ListPrestationContreVComponent implements OnInit {
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
  prestationIdToDelete: number;
  prestationss: Prestation[] = [];
  healthcareProfessionals: User[] = [];
  usersByRole: User[] | null = null;
  selectedPrestation: Prestation | null = null;
  selectedHealthcareProfessionalId: number | undefined;
  formSubmitted: boolean = false;
  ps: User | null = null;
  isLoading: boolean;

  constructor(
    private prestationService: PrestationService,
    private router: Router,
    private snackBar: MatSnackBar,
    private user_service: UserServiceService
  ) {}

  ngOnInit(): void {
    this.getPrestationsWithActes();
    this.initializeRoles();
  }

  affecterContreVisite(prestation: Prestation): boolean {
    return this.prestationService.canAffectContreVisiteCheck(prestation);
  }

  getPrestationsWithActes(): void {
    this.prestationService.getPrestationsWithActesAndBenefAndTypeContreVisite().subscribe(
      (prestations) => {
        this.prestations = prestations;
        this.applyFilter();
        this.totalItems = this.prestations.length;
      },
      (error) => {
        console.error('Error fetching prestations:', error);
      }
    );
  }

  getPsWithId(id: number): void {
    this.user_service.getUserById(id).subscribe(
      (user) => {
        this.ps = user;
      },
      (error) => {
        console.error('Error fetching prestations:', error);
      }
    );
  }

  showPrestationDetails(prestationId: number): void {
    this.router.navigate(['menu/admin/prestationDentist', prestationId]);
  }

  initializeRoles(): void {
    this.availableRoles = Object.keys(ERole)
      .filter((key) => isNaN(Number(ERole[key])))
      .map((key) => ({ id: ERole[key], name: ERole[key] }));
  }

  applyFilter(): void {
    console.log(this.selectedRole);
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
    console.log(this.dataSource.data);

    if (this.searchMatricule) {
      this.applyMatriculeFilter();
    }
    this.resetPaginator();
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
        return 'badge-mines';
      case 'SoinsDentaire':
        return 'bg-primary';
      case 'ODF':
        return 'bg-info';
      default:
        return 'bg-dark';
    }
  }

  applyMatriculeFilter(): void {
    this.dataSource.data = this.prestations.filter((prestation) => {
      return prestation.adherant.matricule.includes(this.searchMatricule);
    });
    this.resetPaginator();
  }

  confirmDelete(prestationId: number): void {
    this.prestationIdToDelete = prestationId;
  }

  deletePrestation(): void {
    if (this.prestationIdToDelete) {
      const prestationToDelete = this.prestations.find(
        (prestation) => prestation.id === this.prestationIdToDelete
      );

      if (prestationToDelete) {
        console.log('Prestation to delete:', prestationToDelete.beneficiaire);
        if (prestationToDelete.beneficiaire == null) {
          this.prestationService
            .deletePrestation(
              this.prestationIdToDelete,
              prestationToDelete.montantTotal
            )
            .subscribe(() => {
              console.log('Prestation deleted successfully');
              this.prestations = this.prestations.filter(
                (prestation) => prestation.id !== this.prestationIdToDelete
              );
              this.applyFilter();
              this.resetPaginator();
              this.openSnackBar('Prestation deleted successfully');
            });
        } else {
          this.prestationService
            .deletePrestationForBenef(
              this.prestationIdToDelete,
              prestationToDelete.montantTotal
            )
            .subscribe(() => {
              console.log('Prestation deleted successfully');
              this.prestations = this.prestations.filter(
                (prestation) => prestation.id !== this.prestationIdToDelete
              );
              this.applyFilter();
              this.resetPaginator();
              this.openSnackBar('Prestation deleted successfully');
            });
        }
      }
    }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
    });
  }

  modifierPrestation(prestationId: number): void {
    this.router.navigate(['menu/admin/modifier-prestation', prestationId]);
  }

  showDetails(prestation: Prestation) {
    this.selectedPrestation = prestation;
    if (
      this.selectedPrestation.user.roles.some(
        (role) => role.name == 'ROLE_OPTICIEN'
      )
    ) {
      this.loadUsersByRole(ERole.ROLE_OPTICIEN_CONTROLEUR);
    } else if (
      this.selectedPrestation.user.roles.some(
        (role) => role.name == 'ROLE_DENTIST'
      )
    ) {
      this.loadUsersByRole(ERole.ROLE_DENTIST_CONTROLEUR);
    }
  }

  loadUsersByRole(role: ERole) {
    this.user_service.getUtilisateursByRole(role).subscribe(
      (users) => {
        this.usersByRole = users;
      },
      (error) => {
        console.error(
          'Erreur lors du chargement des utilisateurs par rôle : ',
          error
        );
      }
    );
  }
}
