import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EReclamationStatus } from 'src/app/Models/EReclamationStatus';
import { Reclamation } from 'src/app/Models/Reclamation';
import { ReclamationService } from 'src/app/Services/reclamation.service';

@Component({
  selector: 'app-liste-reclamation',
  templateUrl: './liste-reclamation.component.html',
  styleUrls: ['./liste-reclamation.component.css']
})
export class ListReclamationComponent implements OnInit {

  reclamations: Reclamation[] = [];
  selectedReclamation: Reclamation | null = null;
  statusForm: FormGroup;
  statusList = Object.values(EReclamationStatus);

  constructor(
    private fb: FormBuilder,
    private reclamationService: ReclamationService
  ) { }

  ngOnInit(): void {
    this.getReclamations();
    this.statusForm = this.fb.group({
      status: ['', Validators.required]
    });
  }

  getReclamations(): void {
    this.reclamationService.getAllReclamations().subscribe(reclamations => {
      this.reclamations = reclamations;
    });
  }

  viewReclamationDetails(reclamation: Reclamation): void {
    this.selectedReclamation = reclamation;
  }

  updateStatus(): void {
    if (this.selectedReclamation && this.statusForm.valid) {
      const newStatus: EReclamationStatus = this.statusForm.get('status').value;
      this.reclamationService.updateReclamationStatus(this.selectedReclamation.id, newStatus)
        .subscribe(updatedReclamation => {
          console.log('Statut mis à jour avec succès :', updatedReclamation);
          this.getReclamations();
          this.selectedReclamation = null;
        });
    }
  }
}
