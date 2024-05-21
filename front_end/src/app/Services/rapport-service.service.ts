import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rapport_C_V_Optcien } from '../Models/Rapport_C_V_Optcien ';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RapportServiceService {

  private baseUrl = 'http://localhost:8034/api/rapport' ;

  constructor(private http: HttpClient) { }


  ajouterRapportOpticien(rapportOpticien: Rapport_C_V_Optcien, idPrestationOrdinaire: number): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/ajouterRapportopticien/${idPrestationOrdinaire}`, rapportOpticien);
  }


  findRapportByPrestationId(prestationId: number): Observable<Rapport_C_V_Optcien> {
    const url = `${this.baseUrl}/byPrestationId/${prestationId}`;
    return this.http.get<Rapport_C_V_Optcien>(url);
      
  }








}
