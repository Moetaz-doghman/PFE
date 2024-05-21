import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActeDentaire } from '../Models/Prestation';

@Injectable({
  providedIn: 'root'
})
export class ActeDentaireService {

  private apiUrl = 'http://localhost:8034/api/actes' ;


  constructor(private http: HttpClient) { }

  createActeDentaire(acteDentaire: ActeDentaire): Observable<ActeDentaire> {
    return this.http.post<ActeDentaire>(this.apiUrl, acteDentaire);
  }

  getActeDentaireById(id: number): Observable<ActeDentaire> {
    return this.http.get<ActeDentaire>(`${this.apiUrl}/${id}`);
  }

  getAllActeDentaires(): Observable<ActeDentaire[]> {
    return this.http.get<ActeDentaire[]>(this.apiUrl);
  }

  updateActeDentaire(id: number, acteDentaire: ActeDentaire): Observable<ActeDentaire> {
    return this.http.put<ActeDentaire>(`${this.apiUrl}/${id}`, acteDentaire);
  }

  deleteActeDentaire(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
