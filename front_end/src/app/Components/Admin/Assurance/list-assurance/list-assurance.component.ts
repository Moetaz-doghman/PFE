import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Assurance } from 'src/app/Models/Assurance';
import { AssuranceService } from 'src/app/Services/assurance.service';

@Component({
  selector: 'app-list-assurance',
  templateUrl: './list-assurance.component.html',
  styleUrls: ['./list-assurance.component.css']
})
export class ListAssuranceComponent implements OnInit {
  assurances: Assurance[] = [];
  selectedAssurance: Assurance | null = null;

  constructor(
    private assuranceService: AssuranceService,
    private router: Router,
    private snackBar: MatSnackBar,

  ) {}

  ngOnInit(): void {
    this.loadAssurances();
  }

  loadAssurances(): void {
    this.assuranceService.getAllAssurances().subscribe(
      (data: Assurance[]) => {
        this.assurances = data;
        console.log(data);
      },
      (error: any) => {
        console.log('Error fetching assurances:', error);
      }
    );
  }

  confirmDelete(assurance: Assurance): void {
    this.selectedAssurance = assurance;
  }

  deleteAssurance(): void {
    if (this.selectedAssurance) {
      this.assuranceService.deleteAssurance(this.selectedAssurance.id).subscribe(
        () => {
          this.loadAssurances();
        },
        (error: any) => {
          this.openSnackBar('Vous ne pouver pas supprimer cette Assurance car elle est liée a des adherants');
          console.log('Error deleting assurance:', error);
        }
      );
    }
  }

  updateAssuranceDetails(assuranceId: number): void {
    this.router.navigate(['menu/admin/modifierAssurance', assuranceId]);
  }

  addAssurance(): void {
    this.router.navigate(['menu/admin/ajouterAssurance']);
  }


  openSnackBar(message: string) {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
    });
  }

}
