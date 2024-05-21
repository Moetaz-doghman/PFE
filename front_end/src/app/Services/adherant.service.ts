import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Adherant } from '../Models/Adherant';
import { Assurance } from '../Models/Assurance';
import { Beneficiaire } from '../Models/Beneficiaire';

@Injectable({
  providedIn: 'root'
})
export class AdherantService {

  private baseUrl = 'http://localhost:8034/api/adherant' ;


  constructor(private http: HttpClient) { }

  findbyAssuranceandMAtricule(assuranceNom: string , matricule: string): Observable<Adherant> {
    return this.http.get<Adherant>(`${this.baseUrl}/findbyAssuranceandMAtricule/${assuranceNom}/${matricule}`, {});
  }

  getAllAssuranceNames(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/getAllAssuranceNames`);
  }

    ajouterAdherant(adherant: Adherant, idAssurance: number): Observable<Adherant> {
      return this.http.post<Adherant>(`${this.baseUrl}/${idAssurance}`, adherant);
    }

    getAdherantById(id: number): Observable<Adherant> {
      return this.http.get<Adherant>(`${this.baseUrl}/${id}`);
    }

    getBeneficiaireById(id: number): Observable<Beneficiaire> {
      return this.http.get<Beneficiaire>(`${this.baseUrl}/beneficiaire/${id}`);
    }

    getAllAdherants(): Observable<Adherant[]> {
      return this.http.get<Adherant[]>(`${this.baseUrl}/`);
    }

    modifierAdherent(id: number, nouvelAdherent: Adherant, assuranceId: number): Observable<Adherant> {
      return this.http.put<Adherant>(`${this.baseUrl}/${id}?assuranceId=${assuranceId}`, nouvelAdherent);
    }

    supprimerAdherant(id: number): Observable<void> {
      return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }


}

