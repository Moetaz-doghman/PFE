import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reclamation } from '../Models/Reclamation';



@Injectable({
  providedIn: 'root'
})
export class ReclamationService {

  private apiUrl = 'http://localhost:8034/api/reclamation';

  constructor(private http: HttpClient) { }


  createReclamation(reclamation: Reclamation, userId: number): Observable<Reclamation> {
    return this.http.post<Reclamation>(`${this.apiUrl}?utilisateurId=${userId}`, reclamation);
  }

  
  getAllReclamations(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(this.apiUrl);
  }

  getReclamationById(id: number): Observable<Reclamation> {
    return this.http.get<Reclamation>(`${this.apiUrl}/${id}`);
  }


  getReclamationsByUtilisateurId(utilisateurId: number): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(`${this.apiUrl}/utilisateur/${utilisateurId}`);
  }

  
  updateReclamationStatus(id: number, newStatus: string): Observable<Reclamation> {
    return this.http.put<Reclamation>(`${this.apiUrl}/${id}/updateStatus?newStatus=${newStatus}`, {});
  }


  deleteReclamation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
