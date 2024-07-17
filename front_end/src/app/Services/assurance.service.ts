import { Injectable } from '@angular/core';
import { Assurance } from '../Models/Assurance';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssuranceService {
  private baseUrl = 'http://localhost:8034/api/assurance';

  constructor(private http: HttpClient) { }

  getAllAssurances(): Observable<Assurance[]> {
    return this.http.get<Assurance[]>(this.baseUrl);
  }

  getAssuranceById(id: number): Observable<Assurance> {
    return this.http.get<Assurance>(`${this.baseUrl}/${id}`);
  }

  createAssurance(assurance: Assurance): Observable<Assurance> {
    return this.http.post<Assurance>(this.baseUrl, assurance);
  }

  updateAssurance(id: number, assurance: Assurance): Observable<Assurance> {
    return this.http.put<Assurance>(`${this.baseUrl}/${id}`, assurance);
  }

  deleteAssurance(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  
}
