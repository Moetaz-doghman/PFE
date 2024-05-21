import { StorageServiceService } from 'src/app/Services/storage-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../Models/User';
import { Observable } from 'rxjs';
import { ERole } from '../Models/Role';



@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  private apiUrl = 'http://localhost:8034/api/utilisateurs';

  constructor(private http: HttpClient , private storageService:StorageServiceService) {}

  private getHeaders(): HttpHeaders {
    const token = this.storageService.getBearerToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }); }

  getUtilisateursByRole(role: ERole): Observable<User[]> {
    const headers = this.getHeaders();
    return this.http.get<User[]>(`${this.apiUrl}/byRole/${role}`, { headers });
  }


  getUtilisateursByMat(mat: string): Observable<User[]> {
    const headers = this.getHeaders();

    return this.http.get<User[]>(`${this.apiUrl}/byMat/${mat}`, { headers });
  }

  ajouterRoleAUtilisateur(utilisateurId: number, role: ERole): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}/ajouterRole?utilisateurId=${utilisateurId}&role=${role}`, {}, { headers });
  }

  supprimerRoleUtilisateur(utilisateurId: number, role: ERole): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.apiUrl}/${utilisateurId}/roles/${role}`, { headers });
  }

  ajouterUtilisateur(utilisateur: User, roleName: string): Observable<User> {
    const headers = this.getHeaders();
    return this.http.post<User>(`${this.apiUrl}/${roleName}`, utilisateur, { headers });
  }
  desactiverCompte(userId: number): Observable<string> {
    const headers = this.getHeaders();
    return this.http.put<string>(`${this.apiUrl}/disable/${userId}`, {}, { headers });
  }

  activerCompte(userId: number): Observable<string> {
    const headers = this.getHeaders();
    return this.http.put<string>(`${this.apiUrl}/able/${userId}`, {}, { headers });
  }

  deleteUtilisateur(id: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }

  getUserById(id: number): Observable<User> {
    const headers = this.getHeaders();
    return this.http.get<User>(`${this.apiUrl}/${id}`, { headers });
  }

  getAllUsers(): Observable<User[]> {
    const headers = this.getHeaders();
    return this.http.get<User[]>(`${this.apiUrl}/`, { headers });
  }

  getAllUsersNotadmin(): Observable<User[]> {
    const headers = this.getHeaders();
    return this.http.get<User[]>(`${this.apiUrl}/Notadmin`, { headers });
  }
  ajouterRole(utilisateurId: number, role: ERole): Observable<void> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/ajouterRole`;
    const params = { utilisateurId: utilisateurId.toString(), role: role.toString() };
    return this.http.post<void>(url,null, { params });
  }

  supprimerRole(utilisateurId: number, role: ERole) {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/${utilisateurId}/roles/${role}`;
    return this.http.delete(url, { headers });
  }
  getUtilisateursActifs(): Observable<User[]> {
    const headers = this.getHeaders();
    return this.http.get<User[]>(`${this.apiUrl}/byActive`, { headers });
  }

  editUtilisateur(userId: number, updatedUser: User): Observable<User> {
    const headers = this.getHeaders();
    return this.http.put<User>(`${this.apiUrl}/${userId}`, updatedUser, { headers });
  }





}










