import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Nomenclature } from '../Models/Nomenclature';

@Injectable({
  providedIn: 'root'
})

export class NomenclatureService {
  private baseUrl = 'http://localhost:8034/api/nomenclature' ;

  constructor(private http: HttpClient) { }

  findByActeDentaire_Nom(nomActe: string): Observable<Nomenclature[]> {
    return this.http.get<Nomenclature[]>(`${this.baseUrl}/findByActeDentaire_Nom/${nomActe}`);
  }

  createNomenclature(nomenclature: Nomenclature): Observable<Nomenclature> {
    return this.http.post<Nomenclature>(this.baseUrl, nomenclature);
  }

  getNomenclatureById(id: number): Observable<Nomenclature> {
    return this.http.get<Nomenclature>(`${this.baseUrl}/${id}`);

  }

  getAllNomenclatures(): Observable<Nomenclature[]> {
    return this.http.get<Nomenclature[]>(this.baseUrl);
  }

  updateNomenclature(id: number, nomenclature: Nomenclature): Observable<Nomenclature> {
    return this.http.put<Nomenclature>(`${this.baseUrl}/${id}`, nomenclature);
  }

  deleteNomenclature(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }


}
