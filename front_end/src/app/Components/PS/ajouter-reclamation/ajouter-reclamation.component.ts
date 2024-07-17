import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReclamationService } from 'src/app/Services/reclamation.service';
import { StorageServiceService } from 'src/app/Services/storage-service.service';

@Component({
  selector: 'app-ajouter-reclamation',
  templateUrl: './ajouter-reclamation.component.html',
  styleUrls: ['./ajouter-reclamation.component.css']
})
export class AjouterReclamationComponent implements OnInit {
  reclamationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private strogeService: StorageServiceService,
    private reclamationService: ReclamationService,
    private _snackBar: MatSnackBar
  ) {
    this.reclamationForm = this.fb.group({
      type: ['', Validators.required],
      convention: ['', Validators.required],
      qualifications: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(20)]]
    });
  }

  ngOnInit(): void { }

  onSubmit(): void {
    if (this.reclamationForm.valid) {
      const reclamation = this.reclamationForm.value;
      console.log('Reclamation:', reclamation);
      const userId = this.strogeService.getUser().id;

      this.reclamationService.createReclamation(reclamation, userId)
        .subscribe(createdReclamation => {
          console.log('Réclamation créée avec succès :', createdReclamation);
          this.reclamationForm.reset();
          this.openSnackBar('Réclamation créée avec succès');
          this.goBack();
        });
    } else {
      this.reclamationForm.markAllAsTouched();
    }
  }

  onReset(): void {
    this.reclamationForm.reset();
  }

  goBack(): void {
    window.history.back();
  }

  openSnackBar(message: string): void {
    this._snackBar.open(message, 'Fermer', {
      duration: 2000,
    });
  }
}
