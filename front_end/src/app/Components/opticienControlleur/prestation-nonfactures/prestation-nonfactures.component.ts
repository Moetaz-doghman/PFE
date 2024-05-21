import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Prestation } from 'src/app/Models/Prestation';
import { BordereauService } from 'src/app/Services/bordereau.service';
import { PrestationService } from 'src/app/Services/prestation-service.service';
import { StorageServiceService } from 'src/app/Services/storage-service.service';

@Component({
  selector: 'app-prestation-nonfactures',
  templateUrl: './prestation-nonfactures.component.html',
  styleUrls: ['./prestation-nonfactures.component.css']
})
export class PrestationNonfacturesComponent   implements OnInit {
  prestations: Prestation[] = [];
  dataSource = new MatTableDataSource<Prestation>([]);
  totalItems = 0;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 15, 20, 25, 30, 35, 40];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  startDate: string = '';
  endDate: string = '';
  filteredPrestations: Prestation[] = [];
  filterApplied: boolean = false;
  today: Date = new Date();
  currentPage = 0;
  constructor(
    private prestationService: PrestationService,
    private storageService: StorageServiceService,
    private snackBar: MatSnackBar,
    private bordereauService: BordereauService
  ) {}

  ngOnInit(): void {
    this.getPrestationsByUser();
  }

  getPrestationsByUser() {
    this.prestationService
      .getPrestationsByUserIdAndEtatAndArchiveForcontroller(
        this.storageService.getUser().id
      )
      .subscribe(
        (prestations: Prestation[]) => {
          this.prestations = prestations;
          this.dataSource.data = this.prestations;
          this.dataSource.data = this.prestations.slice(0, 5);
          this.totalItems = this.prestations.length;
        },
        (error) => {
          console.error(
            'Erreur lors de la récupération des prestations :',
            error
          );
        }
      );
  }

  onPageChange(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.dataSource.data = this.prestations.slice(startIndex, endIndex);
    this.currentPage = event.pageIndex;
  }

  selectAll(event: any) {
    const checked = event.target.checked;
    this.dataSource.data.forEach(
      (prestation) => (prestation.selected = checked)
    );
  }

  onCheckboxChange(prestation: Prestation) {
    prestation.selected = !prestation.selected;
  }

  filterByDate() {
    if (!this.startDate) {
      this.openSnackBar('Veuillez sélectionner une date de début.');
      return;
    }

    let endDate: Date;
    if (!this.endDate) {
      endDate = new Date();
    } else {
      endDate = new Date(this.endDate);
    }

    const startDate = new Date(this.startDate);

    if (startDate > endDate) {
      this.openSnackBar(
        'La date de début doit être antérieure à la date de fin.'
      );
      return;
    }

    this.filteredPrestations = this.prestations.filter((prestation) => {
      const prestationDate = new Date(prestation.dateCreation);
      return prestationDate >= startDate && prestationDate <= endDate;
    });

    this.filterApplied = true;
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
    });
  }

  validateSelection() {
    const selectedPrestations = this.dataSource.data.filter(
      (prestation) => prestation.selected
    );
    const selectedIds = selectedPrestations.map((prestation) => prestation.id);
    console.log(selectedIds);

    this.bordereauService.genererBordereau(selectedIds).subscribe(
      (response) => {
        this.openSnackBar('Borderau génerer avec success.');
        this.prestations = this.prestations.filter(
          (prestation) => !selectedIds.includes(prestation.id)
        );
        this.dataSource.data = this.prestations;
      },
      (error) => {
        console.error('Erreur lors de la requête HTTP :', error);
      }
    );

  }

  isAnyPrestationSelected(): boolean {
    return this.dataSource.data.some((prestation) => prestation.selected);
  }
}


