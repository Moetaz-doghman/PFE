import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Prestation } from 'src/app/Models/Prestation';
import { PrestationService } from 'src/app/Services/prestation-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-modifier-prestation',
  templateUrl: './modifier-prestation.component.html',
  styleUrls: ['./modifier-prestation.component.css'],
})
export class ModifierPrestationComponent implements OnInit {
  prestationId: number;
  prestation: Prestation;
  prestationForm: FormGroup;
  actesDentaires: any[]; // Déclaration de la propriété actesDentaires

  constructor(
    private route: ActivatedRoute,
    private prestationService: PrestationService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.prestationId = +this.route.snapshot.paramMap.get('id');
    this.getPrestationDetails();
    this.initializeForm();
    this.actesDentaires = [
      // Initialisation des données des actes dentaires
      { name: 'Consultation', selected: false },
      { name: 'SoinsDentaire', selected: false },
      { name: 'Prothese', selected: false },
      { name: 'ODF', selected: false },
    ];
  }

  getPrestationDetails(): void {
    this.prestationService
      .getPrestationsWithActesAndBenefById(this.prestationId)
      .subscribe((prestation) => {
        this.prestation = prestation;
        console.log(prestation)
        this.populateForm();
        this.updateActesDentairesSelection();
      });
  }

  updateActesDentairesSelection(): void {
    this.actesDentaires.forEach((acte) => {
      acte.selected = this.prestation.actes.some((a) => a.nom === acte.name);
    });
  }

  toggleActeSelection(acte: any): void {
    acte.selected = !acte.selected;
  }

  logSelectedActes(): void {
    const selectedActes = this.actesDentaires.filter(acte => acte.selected).map(acte => acte.name);
    console.log("Actes sélectionnés :", selectedActes);
  }

  initializeForm(): void {
    this.prestationForm = this.formBuilder.group({
      montantTotal: ['', Validators.required],
      montantRembourse: ['', Validators.required],
      montantTicketModerateur: ['', Validators.required],
      totalCotation: [''],
      cleCotation: [''],
      actesDentaires: [''],
    });
  }

  populateForm(): void {
    this.prestationForm.patchValue({
      montantTotal: this.prestation.montantTotal,
      montantRembourse: this.prestation.montantRembourse,
      montantTicketModerateur: this.prestation.montant_ticket_moderateur,
      totalCotation: this.prestation.totalCotation,
      cleCotation: this.prestation.cle_cotation,
      actesDentaires: this.prestation.actes.map((acte) => acte.nom).join(','), 
    });

    this.updateActesDentairesSelection();
  }

  onSubmit(): void {
    if (this.prestationForm.valid) {
      const formValue = this.prestationForm.value;

      const selectedActes = this.actesDentaires.filter(acte => acte.selected).map(acte => acte.name).join(',');

      this.prestationService
        .modifierPrestationPourDentiste(
          this.prestationId,
          formValue.montantTotal,
          formValue.montantRembourse,
          formValue.montantTicketModerateur,
          formValue.totalCotation,
          formValue.cleCotation,
          selectedActes
        )
        .subscribe(
          (response) => {
            this.openSnackBar('Requête réussie');
            this.router.navigate(['menu/prestationDentist']);

          },
          (error) => {
            this.openSnackBar('Erreur lors de la requête');

          }
        );
    } else {
      this.openSnackBar('Erreur lors de la requête');
    }
  }

  calculer(): void {
    let montantTotal = 0;
    let montantRembourse = 0;
    let montantTicketModerateur = 0;

    const totalCotation = this.prestationForm.get('totalCotation').value || 0;

    let consultationSelected = false;
    let otherActSelected = false;
    this.actesDentaires.forEach((acte) => {
      if (acte.selected) {
        switch (acte.name) {
          case 'Consultation':
            consultationSelected = true;
            break;
          case 'SoinsDentaire':
          case 'Prothese':
          case 'ODF':
            otherActSelected = true;
            break;
          default:
            break;
        }
      }
    });

    if (consultationSelected && otherActSelected) {
      montantTotal = totalCotation * this.prestation.adherant.assurance.prix_cotation;
      montantTicketModerateur = 40;
      montantRembourse = montantTotal - montantTicketModerateur;
    } else if (otherActSelected) {
      montantTotal = totalCotation * this.prestation.adherant.assurance.prix_cotation;
      montantTicketModerateur = 40;
      montantRembourse = montantTotal - montantTicketModerateur;
    } else if (consultationSelected) {
      montantTotal = 40;
      montantTicketModerateur = 40;
      montantRembourse = 40;
      this.prestationForm.get('totalCotation').setValue(40);

    }

    this.prestationForm.get('montantTotal').setValue(montantTotal);
    this.prestationForm.get('montantRembourse').setValue(montantRembourse);
    this.prestationForm.get('montantTicketModerateur').setValue(montantTicketModerateur);
  }

  openSnackBar(message: string): void {
    this._snackBar.open(message, 'Fermer', {
      duration: 2000,
    });
  }

  goBack(): void {
    window.history.back();
  }

}
