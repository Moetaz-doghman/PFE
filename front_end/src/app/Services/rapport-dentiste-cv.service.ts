import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RapportDentisteCVService {

  private baseUrl = 'http://localhost:8034/api/rapportcvdent' ;

  constructor(private http: HttpClient) {}


  saveContreVisite( data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrl}/rapports`, data, { headers: headers });
  }


  getCombinedRapports(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/getCombinedRapports`);
  }




}

