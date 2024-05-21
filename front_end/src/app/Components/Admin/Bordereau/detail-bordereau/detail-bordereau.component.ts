import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Bordereaux } from 'src/app/Models/Bordereaux';
import { BordereauService } from 'src/app/Services/bordereau.service';

@Component({
  selector: 'app-detail-bordereau',
  templateUrl: './detail-bordereau.component.html',
  styleUrls: ['./detail-bordereau.component.css'],
})
export class DetailBordereauComponent implements OnInit {
  bordereau: Bordereaux;
  bordereauIdToDelete: number;

  constructor(
    private route: ActivatedRoute,
    private bordereauService: BordereauService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getPrestationDetail();
  }

  getPrestationDetail(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.bordereauService.getBordereauxById(id).subscribe(
      (detail) => {
        this.bordereau = detail;
        console.log(detail);
      },
      (error) => {
        console.error('Error fetching bordereau detail:', error);
      }
    );
  }


  confirmDelete(bordereauID: number): void {
    this.bordereauIdToDelete = bordereauID;
  }

  deleteBordereau(): void {
    if (this.bordereauIdToDelete) {
      console.log(this.bordereau);
      this.bordereauService
        .deleteBordereau(
          this.bordereauIdToDelete)
        .subscribe(() => {
          console.log('bordereau deleted successfully');
          window.history.back();
          this.openSnackBar('bordereau deleted successfully');
        });
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

  isOpticien(prestation: any): boolean {
    return prestation.user && prestation.user.roles.some(role => role.name === 'ROLE_OPTICIEN');
  }

  isDentiste(prestation: any): boolean {
    return prestation.user && prestation.user.roles.some(role => role.name === 'ROLE_DENTIST');
  }






}
