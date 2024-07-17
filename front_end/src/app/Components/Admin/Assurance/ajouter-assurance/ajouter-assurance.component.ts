import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AssuranceService } from 'src/app/Services/assurance.service';

@Component({
  selector: 'app-ajouter-assurance',
  templateUrl: './ajouter-assurance.component.html',
  styleUrls: ['./ajouter-assurance.component.css']
})
export class AjouterAssuranceComponent implements OnInit {
  assuranceForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private assuranceService: AssuranceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.assuranceForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      prix_cotation: ['', [Validators.required, Validators.min(0)]],
      prix_cotationODF: ['', [Validators.required, Validators.min(0)]],
      prix_cotationProthese: ['', [Validators.required, Validators.min(0)]],
    });
  }

  onSubmit(): void {
    if (this.assuranceForm.valid) {
      const assuranceData = this.assuranceForm.value;
      console.log(assuranceData);
      this.assuranceService.createAssurance(assuranceData).subscribe(
        (assurance) => {
          console.log('Assurance ajoutée avec succès :', assurance);
          this.router.navigate(['menu/admin/assurance']);
        },
        (error) => {
          console.error('Erreur lors de l\'ajout de l\'assurance :', error);
        }
      );
    } else {
      this.assuranceForm.markAllAsTouched();
    }
  }

  onReset(): void {
    this.assuranceForm.reset();
  }

  goBack(): void {
    window.history.back();
  }
}
