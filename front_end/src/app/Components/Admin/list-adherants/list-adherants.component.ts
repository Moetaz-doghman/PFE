import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Adherant } from 'src/app/Models/Adherant';
import { AdherantService } from 'src/app/Services/adherant.service';

@Component({
  selector: 'app-list-adherants',
  templateUrl: './list-adherants.component.html',
  styleUrls: ['./list-adherants.component.css']
})
export class ListAdherantsComponent implements OnInit{

  adherants: Adherant[] = [];
  switchState: boolean = false;
  dataSource = new MatTableDataSource<Adherant>([]);
  totalItems = 0;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 15, 20,25,30,35,40];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  currentPage = 0;
  searchQuery: string = '';




  adherentForm: FormGroup;
  constructor(
    private adherantService: AdherantService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getAdherants();

    this.adherentForm = this.fb.group({
      cin: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      matricule: ['', Validators.required],
      nom: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      prenom: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      sexe: ['', Validators.required],
      numtel: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      dateNais: ['', Validators.required],
      gouvNais: ['', Validators.required],
      paysNais: ['', Validators.required],
      plafond: ['', Validators.required],
      assuranceId: [0 , Validators.required],
    });
  }

  getAdherants(): void {
    this.adherantService.getAllAdherants().subscribe(
      (response) => {
        this.adherants = response;
        this.dataSource.data = this.adherants;
        this.dataSource.data = this.adherants.slice(0, this.pageSize);
        this.totalItems = this.adherants.length;
      },
      (error) => {
        console.error('Error fetching adherants:', error);
      }
    );
  }

  onDeleteAdherent(adherent_id: number): void {
    this.adherantService.supprimerAdherant(adherent_id).subscribe(
      (response) => {
        console.log('adherant  deleted successfully', response);
        window.location.reload();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  UpdateAdherentDetails(adherentId: number): void {
    this.router.navigate(['menu/admin/modifierAdherent', adherentId]);
  }

  applyMatriculeFilter(): void {
    this.dataSource.data = this.adherants.filter((adherant) => {
      return adherant.matricule.includes(this.searchQuery);
    });
  }

  applyNameFilter(): void {
    this.dataSource.data = this.adherants.filter((adherant) => {
      return adherant.nom.includes(this.searchQuery);
    });
  }

  applyFilter(): void {
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      this.dataSource.data = this.adherants.filter((adherant) => {
        return adherant.matricule.toLowerCase().includes(query) || adherant.nom.toLowerCase().includes(query);
      });
    } else {
      this.dataSource.data = this.adherants;
    }
  }


  onPageChange(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.dataSource.data = this.adherants.slice(startIndex, endIndex);
    this.currentPage = event.pageIndex;
  }

  onChangeSwitch(id: any, isChecked: boolean): void {
    this.switchState = isChecked;

    if (this.switchState) {
      this.adherantService.desactiverAdherant(id).subscribe(
        (response) => {
          console.log('Adherant deactivated successfully:', response);
          window.location.reload(); 
        },
        (error) => {
          console.error('Error deactivating Adherant:', error);
        }
      );
    } else {
      this.adherantService.activerAdherant(id).subscribe(
        (response) => {
          console.log('Adherant activated successfully:', response);
          window.location.reload(); 
        },
        (error) => {
          console.error('Error activating Adherant:', error);
        }
      );
    }
  }
}
