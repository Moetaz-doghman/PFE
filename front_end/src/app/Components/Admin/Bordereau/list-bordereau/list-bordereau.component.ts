import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Bordereaux } from 'src/app/Models/Bordereaux';
import { BordereauService } from 'src/app/Services/bordereau.service';
import * as moment from 'moment';

@Component({
  selector: 'app-list-bordereau',
  templateUrl: './list-bordereau.component.html',
  styleUrls: ['./list-bordereau.component.css'],
})
export class ListBordereauComponent implements OnInit {
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
        this.bordereaux = response;
        this.bordereaux.forEach(bordereau => {
          bordereau.dateCreationF = new Date(moment(bordereau.dateCreationF).format('L'));
        });
        console.log(response);
        this.dataSource.data = this.bordereaux;
        this.dataSource.data = this.bordereaux.slice(0, this.pageSize);
        this.totalItems = this.bordereaux.length;
      },
      (error) => {
        console.error('Error fetching bordereaux:', error);
      }
    );
  }

  deleteBorderau(): void {
    console.log(this.selectedBordereaux)
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
    console.log(this.nouveauStatut)
    if (this.nouveauStatut && bordereau) {
      this.bordereauService
        .changerStatutBordereau(bordereau.id, this.nouveauStatut)
        .subscribe(
          () => {
            console.log('Statut du bordereau modifié avec succès');
            this.getBordereaux();

          },
          (error: any) => {
            console.error('Erreur lors de la modification du statut du bordereau:', error);
          }
        );
    }
  }

  selectBordereau(bordereau: Bordereaux): void {
    this.selectedBordereaux = bordereau;
    // Réinitialiser le statut sélectionné à celui du bordereau
    this.nouveauStatut = bordereau.status;
  }
}
