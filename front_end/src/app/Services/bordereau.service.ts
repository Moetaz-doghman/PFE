import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bordereaux } from '../Models/Bordereaux';

@Injectable({
  providedIn: 'root'
})
export class BordereauService {

  private baseUrl = 'http://localhost:8034/api/bordereaux' ;

  constructor(private http: HttpClient) { }

  genererBordereau(prestationsIds: number[]): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/genererBorderau`, prestationsIds)
  }

  getAllBordereaux(): Observable<Bordereaux[]> {
    return this.http.get<Bordereaux[]>(`${this.baseUrl}/findAll`);
  }

  getBordereauxByUserId(userId: number): Observable<Bordereaux[]> {
    return this.http.get<Bordereaux[]>(`${this.baseUrl}/getBordereauxByUserId/${userId}`);
  }

  getBordereauxById(id: number): Observable<Bordereaux> {
    return this.http.get<Bordereaux>(`${this.baseUrl}/getByID/${id}`);
  }

  deleteBordereau(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  changerStatutBordereau(id: number, nouveauStatut: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/changerStatut?nouveauStatut=${nouveauStatut}`, {});
  }





}
