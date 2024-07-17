import { Component } from '@angular/core';
import { EReclamationStatus } from 'src/app/Models/EReclamationStatus';

import { ReclamationService } from 'src/app/Services/reclamation.service';
import { StorageServiceService } from 'src/app/Services/storage-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Reclamation } from 'src/app/Models/Reclamation';
import { Router } from '@angular/router';

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
    private strogeService: StorageServiceService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.reclamationForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.getReclamationsByCurrentUser();
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

  goToAdd(){
    this.router.navigate(['menu/ajouterReclamation']);
  }
}
