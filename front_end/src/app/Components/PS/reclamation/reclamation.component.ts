import { Component } from '@angular/core';
import { EReclamationStatus } from 'src/app/Models/EReclamationStatus';

import { ReclamationService } from 'src/app/Services/reclamation.service';
import { StorageServiceService } from 'src/app/Services/storage-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Reclamation } from 'src/app/Models/Reclamation';

@Component({
  selector: 'app-reclamation',
  templateUrl: './reclamation.component.html',
  styleUrls: ['./reclamation.component.css']
})
export class ReclamationComponent {

  reclamations: Reclamation[];
  currentDate: string = new Date().toISOString();
  reclamationForm: FormGroup;
  selectedReclamation: Reclamation | null = null;

  constructor(
    private fb: FormBuilder,
    private reclamationService: ReclamationService,
    private strogeService: StorageServiceService
  ) { }

  ngOnInit(): void {
    this.reclamationForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.getReclamationsByCurrentUser();
  }


  onSubmit(): void {
    if (this.reclamationForm.invalid) {
      return;
    }

    const newReclamation: Reclamation = {
      id: null, // L'ID sera généré automatiquement côté serveur
      titre: this.reclamationForm.get('titre').value,
      description: this.reclamationForm.get('description').value,
      dateCreation: null,
      statut: null, // Initial status can be set here if needed
      user: null // User will be set on the server-side
    };

    const userId = this.strogeService.getUser().id;

    this.reclamationService.createReclamation(newReclamation, userId)
      .subscribe(createdReclamation => {
        console.log('Réclamation créée avec succès :', createdReclamation);
        this.getReclamationsByCurrentUser();
        this.reclamationForm.reset();
      });
  }

  
  confirmDelete(reclamation: Reclamation): void {
    this.selectedReclamation = reclamation;
  }

  deleteReclamation(): void {
    if (this.selectedReclamation) {
    this.reclamationService.deleteReclamation(this.selectedReclamation.id)
      .subscribe(() => {
        this.getReclamationsByCurrentUser();
        console.log('Réclamation supprimée avec succès');
      });
    }
  }

  getReclamationsByCurrentUser(): void {
    const userId = this.strogeService.getUser().id;
    this.reclamationService.getReclamationsByUtilisateurId(userId)
      .subscribe(reclamations => {
        this.reclamations = reclamations;
      });
  }
}
