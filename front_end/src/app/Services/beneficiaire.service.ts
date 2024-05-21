import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Adherant } from '../Models/Adherant';
import { Assurance } from '../Models/Assurance';
import { Beneficiaire } from '../Models/Beneficiaire';

@Injectable({
  providedIn: 'root'
})

export class BeneficiaireService {

  private baseUrl = 'http://localhost:8034/api/beneficiaires' ;

  constructor(private http: HttpClient) { }

  getAllBeneficiaires(): Observable<Beneficiaire[]> {
    return this.http.get<Beneficiaire[]>(this.baseUrl);
  }

  getBeneficiaireById(id: number): Observable<Beneficiaire> {
    return this.http.get<Beneficiaire>(`${this.baseUrl}/${id}`);
  }

  createBeneficiaire(adherantId: number , beneficiaire: Beneficiaire): Observable<Beneficiaire> {
    return this.http.post<Beneficiaire>(`${this.baseUrl}/adherant/${adherantId}`, beneficiaire);
  }

  updateBeneficiaire(id: number, beneficiaire: Beneficiaire, idBenef: number): Observable<Beneficiaire> {
    return this.http.put<Beneficiaire>(`${this.baseUrl}/update/${id}/${idBenef}`, beneficiaire);
  }


  deleteBeneficiaire(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

}
