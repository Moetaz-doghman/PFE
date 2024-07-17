import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Bordereaux } from 'src/app/Models/Bordereaux';
import { BordereauService } from 'src/app/Services/bordereau.service';
import * as moment from 'moment';

@Component({
  selector: 'app-list-bordereau-contre-visite',
  templateUrl: './list-bordereau-contre-visite.component.html',
  styleUrls: ['./list-bordereau-contre-visite.component.css']
})
export class ListBordereauContreVisiteComponent implements OnInit {
  bordereaux: Bordereaux[] = [];
  selectedBordereaux: Bordereaux | null = null;

  switchState: boolean = false;
  dataSource = new MatTableDataSource<Bordereaux>([]);
  totalItems = 0;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 15, 20, 25, 30, 35, 40];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  currentPage = 0;
  nouveauStatut: string = '';
  prestataires: string[] = [];
  selectedPrestataire: string | null = null;

  constructor(
    private bordereauService: BordereauService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getBordereaux();
  }

  getBordereaux(): void {
    this.bordereauService.getAllBordereaux().subscribe(
      (response) => {
        this.bordereaux = response.filter(bordereau => bordereau.type === 'Contre_visite');
        this.prestataires = this.getUniquePrestataires();
        this.filterBordereaux();
      },
      (error) => {
        console.error('Error fetching bordereaux:', error);
      }
    );
  }

  getUniquePrestataires(): string[] {
    const prestataires = this.bordereaux.map(bordereau => bordereau.prestations[0].user.nom + ' ' + bordereau.prestations[0].user.prenom);
    return [...new Set(prestataires)];
  }

  filterBordereaux(): void {
    let filteredBordereaux = this.bordereaux;
    if (this.selectedPrestataire) {
      filteredBordereaux = this.bordereaux.filter(bordereau => {
        const prestataire = bordereau.prestations[0].user.nom + ' ' + bordereau.prestations[0].user.prenom;
        return prestataire === this.selectedPrestataire;
      });
    }
    this.dataSource.data = filteredBordereaux.slice(0, this.pageSize);
    this.totalItems = filteredBordereaux.length;
  }

  deleteBorderau(): void {
    if (this.selectedBordereaux) {
      this.bordereauService
        .deleteBordereau(this.selectedBordereaux.id)
        .subscribe(
          () => {
            this.getBordereaux();
          },
          (error: any) => {
            console.log('Error deleting borderau:', error);
          }
        );
    }
  }

  confirmDelete(bordereau: Bordereaux): void {
    this.selectedBordereaux = bordereau;
  }

  onPageChange(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.dataSource.data = this.bordereaux.slice(startIndex, endIndex);
    this.currentPage = event.pageIndex;
  }

  showBordereauDetails(bordereauID: number): void {
    this.router.navigate(['menu/admin/bordereauDetail', bordereauID]);
  }

  changerStatutBordereau(bordereau: Bordereaux): void {
    if (this.nouveauStatut && bordereau) {
      this.bordereauService
        .changerStatutBordereau(bordereau.id, this.nouveauStatut)
        .subscribe(
          () => {
            console.log('Statut du bordereau modifié avec succès');
            this.getBordereaux();
            window.location.reload();
          },
          (error: any) => {
            console.error('Erreur lors de la modification du statut du bordereau:', error);
          }
        );
    }
  }

  selectBordereau(bordereau: Bordereaux): void {
    this.selectedBordereaux = bordereau;
    this.nouveauStatut = bordereau.status;
  }

  onPrestataireChange(): void {
    this.filterBordereaux();
  }
}
