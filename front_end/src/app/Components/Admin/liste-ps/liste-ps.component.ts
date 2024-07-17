import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ERole } from 'src/app/Models/Role';
import { User } from 'src/app/Models/User';
import { UserServiceService } from 'src/app/Services/user-service.service';

@Component({
  selector: 'app-liste-ps',
  templateUrl: './liste-ps.component.html',
  styleUrls: ['./liste-ps.component.css']
})
export class ListePsComponent implements OnInit {
  ps: User[] = [];
  filteredPs: User[] = [];
  switchState: boolean = false;
  userIdToDelete: any = -1;
  nouveauRole: ERole;
  dataSource = new MatTableDataSource<User>([]);
  totalItems = 0;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 15, 20, 25, 30, 35, 40];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  currentPage = 0;
  searchQuery: string = '';

  constructor(private userService: UserServiceService, private router: Router) {}

  ngOnInit(): void {
    this.getPs();
  }

  getPs(): void {
    if (this.switchState) {
      this.userService.getUtilisateursActifs().subscribe(
        (response) => {
          this.ps = response;
          this.filteredPs = this.ps;
          this.applyFilter();
        },
        (error) => {
          console.error('Error fetching active users:', error);
        }
      );
    } else {
      this.userService.getAllUsersNotadmin().subscribe(
        (response) => {
          this.ps = response;
          this.filteredPs = this.ps;
          this.applyFilter();
        },
        (error) => {
          console.error('Error fetching adherants:', error);
        }
      );
    }
  }

  toggleFilter(): void {
    this.switchState = !this.switchState;
    this.getPs();
  }

  ajouterRole(utilisateurId: number, role: ERole): void {
    this.userService.ajouterRole(utilisateurId, role).subscribe(
      () => {
        console.log('Rôle ajouté avec succès à l\'utilisateur');
        this.getPs();
      },
      (error) => {
        console.error('Error adding role to user:', error);
      }
    );
  }

  hasRoleAdmin(user: User): boolean {
    return user.roles.some(role => role.name === 'ROLE_ADMIN');
  }

  getRoleBadgeClass(roleName: string): string {
    switch (roleName) {
      case 'ROLE_OPTICIEN':
        return 'badge-mines';
      case 'ROLE_DENTIST':
        return 'bg-primary';
      case 'ROLE_OPTICIEN_CONTROLEUR':
        return 'bg-secondary';
      case 'ROLE_DENTIST_CONTROLEUR':
        return 'bg-info';
      default:
        return 'bg-dark';
    }
  }

  onChangeSwitch(id: any, isChecked: boolean): void {
    this.switchState = isChecked;

    if (this.switchState) {
      this.userService.desactiverCompte(id).subscribe(
        (response) => {
          console.log('Etat and status changed successfully:', response);
          window.location.reload();
        },
        (error) => {
          console.error('Error changing Etat and status:', error);
        }
      );
    } else {
      this.userService.activerCompte(id).subscribe(
        (response) => {
          console.log('Etat and status changed successfully:', response);
          window.location.reload();
        },
        (error) => {
          console.error('Error changing Etat and status:', error);
        }
      );
    }
  }

  onDeletePS(ps_id: number): void {
    this.userService.deleteUtilisateur(ps_id).subscribe(
      (response) => {
        console.log('Adherant deleted successfully');
        window.location.reload();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  delete(): void {
    if (this.userIdToDelete) {
      this.onDeletePS(this.userIdToDelete);
    }
  }

  supprimerRole(userId: number, roleName: ERole): void {
    this.userService.supprimerRoleUtilisateur(userId, roleName).subscribe(
      () => {
        console.log('Rôle supprimé avec succès de l\'utilisateur');
        this.getPs();
      },
      (error) => {
        console.error('Error deleting role from user:', error);
      }
    );
  }

  onPageChange(event: PageEvent): void {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.dataSource.data = this.filteredPs.slice(startIndex, endIndex);
    this.currentPage = event.pageIndex;
  }

  applyFilter(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredPs = this.ps.filter((professionnel) => {
      return (
        professionnel.nom.toLowerCase().includes(query) ||
        professionnel.prenom.toLowerCase().includes(query) ||
        professionnel.matricule.toLowerCase().includes(query) ||
        professionnel.email.toLowerCase().includes(query)
      );
    });
    this.updateDataSource();
  }

  updateDataSource(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.dataSource.data = this.filteredPs.slice(startIndex, endIndex);
    this.totalItems = this.filteredPs.length;
  }
}
