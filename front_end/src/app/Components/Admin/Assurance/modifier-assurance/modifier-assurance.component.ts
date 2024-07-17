import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AssuranceService } from 'src/app/Services/assurance.service';
import { Assurance } from 'src/app/Models/Assurance';

@Component({
  selector: 'app-modifier-assurance',
  templateUrl: './modifier-assurance.component.html',
  styleUrls: ['./modifier-assurance.component.css']
})
export class ModifierAssuranceComponent implements OnInit {
  assuranceForm: FormGroup;
  assuranceId: number;
  assurance: Assurance;

  constructor(
    private fb: FormBuilder,
    private assuranceService: AssuranceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.assuranceId = +this.route.snapshot.paramMap.get('id');
    this.loadAssurance();

    this.assuranceForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      prix_cotation: [0, [Validators.required, Validators.min(0)]],
      prix_cotationODF: [0, [Validators.required, Validators.min(0)]],
      prix_cotationProthese: [0, [Validators.required, Validators.min(0)]]
    });
  }

  loadAssurance(): void {
    this.assuranceService.getAssuranceById(this.assuranceId).subscribe(
      (assurance: Assurance) => {
        this.assurance = assurance;
        this.assuranceForm.patchValue({
          nom: assurance.nom,
          prix_cotation: assurance.prix_cotation,
          prix_cotationODF: assurance.prix_cotationODF,
          prix_cotationProthese: assurance.prix_cotationProthese
        });
      },
      (error) => {
        console.error('Erreur lors du chargement de l\'assurance :', error);
      }
    );
  }

  onSubmit(): void {
    if (this.assuranceForm.valid) {
      const updatedAssurance = this.assuranceForm.value;
      this.assuranceService.updateAssurance(this.assuranceId, updatedAssurance)
        .subscribe(
          (assurance) => {
            console.log('Assurance modifiée avec succès :', assurance);
            this.router.navigate(['/menu/admin/assurance']);
          },
          (error) => {
            console.error('Erreur lors de la modification de l\'assurance :', error);
          }
        );
    } else {
      this.assuranceForm.markAllAsTouched();
    }
  }

  onReset(): void {
    this.loadAssurance();
  }

  goBack(): void {
    this.router.navigate(['/menu/admin/assurance']);
  }
}
