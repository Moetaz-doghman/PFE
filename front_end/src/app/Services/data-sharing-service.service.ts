import { Injectable } from '@angular/core';
import { Prestation } from '../Models/Prestation';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {
  private selectedPrestations: Prestation[] = [];

  constructor() { }

  setSelectedPrestations(prestations: Prestation[]) {
    this.selectedPrestations = prestations;
  }

  getSelectedPrestations(): Prestation[] {
    return this.selectedPrestations;
  }
}
