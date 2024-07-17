import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PrestationService } from 'src/app/Services/prestation-service.service';
import { Prestation } from 'src/app/Models/Prestation';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-detail-prestation',
  templateUrl: './detail-prestation.component.html',
  styleUrls: ['./detail-prestation.component.css'],
})
export class DetailPrestationComponent implements OnInit {
  prestation: Prestation;
  prestationIdToDelete: number;

  constructor(
    private route: ActivatedRoute,
    private prestationDetailService: PrestationService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getPrestationDetail();
  }

  getPrestationDetail(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.prestationDetailService
      .getPrestationsWithActesAndBenefById(id)
      .subscribe(
        (detail) => {
          this.prestation = detail;
          console.log(detail);
        },
        (error) => {
          console.error('Error fetching prestations detail:', error);
        }
      );
  }

  confirmDelete(prestationId: number): void {
    this.prestationIdToDelete = prestationId;
  }

  deletePrestation(): void {
    if (this.prestationIdToDelete) {
      console.log(this.prestation.beneficiaire);
      if (this.prestation.beneficiaire == null) {
        this.prestationDetailService
          .deletePrestation(
            this.prestationIdToDelete,
            this.prestation.montantTotal
          )
          .subscribe(() => {
            console.log('Prestation deleted successfully');
            window.history.back();
            this.openSnackBar('Prestation deleted successfully');
          });
      } else {
        this.prestationDetailService
          .deletePrestationForBenef(
            this.prestationIdToDelete,
            this.prestation.montantTotal
          )
          .subscribe(() => {
            console.log('Prestation deleted successfully');
            window.history.back();
            this.openSnackBar('Prestation deleted successfully');
          });
      }
    }
  }

  goBack(): void {
    window.history.back();
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000, 
    });
  }
}
