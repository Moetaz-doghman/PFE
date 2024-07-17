import { Efavore } from './../Models/Efavore';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prestation } from '../Models/Prestation';

interface CalculationRequest {
  adherantId: number;
  actes: string[];
  totalCotation: number;
  assuranceId: number;
  assuranceName: string;
}

interface CalculationResponse {
  totalOrdonnance: number;
  montantTicketModerateur: number;
  montantRembourse: number;
}

@Injectable({
  providedIn: 'root'
})
export class PrestationService {
  private baseUrl = 'http://localhost:8034/api/prest';

  constructor(private http: HttpClient) { }

  ajouterPrestationPourDentiste(
    adherantId: number,
    montantTotal: number,
    montantRembourse: number,
    montantTicketModerateur: number,
    dateCreation: string,
    cleCotation: string,
    actesDentaires: string,
    userId: number,
    totalCotation: number
  ): Observable<any> {
    const params = new HttpParams()
      .set('adherantId', adherantId)
      .set('montantTotal', montantTotal)
      .set('montantRembourse', montantRembourse)
      .set('montant_ticket_moderateur', montantTicketModerateur)
      .set('dateCreation', dateCreation)
      .set('cle_cotation', cleCotation)
      .set('actesDentaires', actesDentaires)
      .set('userId', userId)
      .set('totalCotation', totalCotation);


    return this.http.post(`${this.baseUrl}/prestationDentiste`, null, { params });
  }


  ajouterPrestationPourOpticien(
    adherantId: number,
    userId: number,
    sphereD: number,
    axeD: number,
    acuiteD: number,
    sphereG: number,
    axeG: number,
    acuiteG: number,
    valeurVerreOeilGauche: number,
    valeurVerreOeilDroit: number,
    valeurMonture: number

  ): Observable<any> {
    const params = new HttpParams()
      .set('adherantId', adherantId)
      .set('userId', userId)
      .set('sphereD', sphereD)
      .set('axeD', axeD)
      .set('acuiteD', acuiteD)
      .set('sphereG', sphereG)
      .set('axeG', axeG)
      .set('acuiteG', acuiteG)
      .set('valeurVerreOeilGauche', valeurVerreOeilGauche)
      .set('valeurVerreOeilDroit', valeurVerreOeilDroit)
      .set('valeurMonture', valeurMonture);



    return this.http.post(`${this.baseUrl}/prestationOrdOpt`, null, { params });
  }

  ajouterPrestationBenPourOpticien(
    adherantId: number,
    userId: number,
    beneficiaireId: number,
    sphereD: number,
    axeD: number,
    acuiteD: number,
    sphereG: number,
    axeG: number,
    acuiteG: number,
    valeurVerreOeilGauche: number,
    valeurVerreOeilDroit: number,
    valeurMonture: number

  ): Observable<any> {
    const params = new HttpParams()
      .set('adherantId', adherantId)
      .set('userId', userId)
      .set('beneficiaireId', beneficiaireId)
      .set('sphereD', sphereD)
      .set('axeD', axeD)
      .set('acuiteD', acuiteD)
      .set('sphereG', sphereG)
      .set('axeG', axeG)
      .set('acuiteG', acuiteG)
      .set('valeurVerreOeilGauche', valeurVerreOeilGauche)
      .set('valeurVerreOeilDroit', valeurVerreOeilDroit)
      .set('valeurMonture', valeurMonture);



    return this.http.post(`${this.baseUrl}/prestationBenfOrdOpt`, null, { params });
  }


  ajouterPrestationBenefPourDentiste(
    adherantId: number,
    montantTotal: number,
    montantRembourse: number,
    montantTicketModerateur: number,
    dateCreation: string,
    cleCotation: string,
    actesDentaires: string,
    beneficiaireId: number,
    userId: number,
    totalCotation: number

  ): Observable<any> {
    const params = new HttpParams()
      .set('adherantId', adherantId)
      .set('montantTotal', montantTotal)
      .set('montantRembourse', montantRembourse)
      .set('montant_ticket_moderateur', montantTicketModerateur)
      .set('dateCreation', dateCreation)
      .set('cle_cotation', cleCotation)
      .set('actesDentaires', actesDentaires)
      .set('beneficiaireId', beneficiaireId)
      .set('userId', userId)
      .set('totalCotation', totalCotation);


    return this.http.post(`${this.baseUrl}/adherantBenef/prestationDentiste`, null, { params });
  }

  getPrestationsWithActes(): Observable<Prestation[]> {
    return this.http.get<Prestation[]>(`${this.baseUrl}/prestations-with-actes`);
  }

  getPrestationsWithActesAndBenef(): Observable<Prestation[]> {
    return this.http.get<Prestation[]>(`${this.baseUrl}/withActesAndBenef`);
  }

  getPrestationsWithActesAndBenefAndTypeContreVisite(): Observable<Prestation[]> {
    return this.http.get<Prestation[]>(`${this.baseUrl}/withActesAndBenefAndTypeContreVisite`);
  }

  findAllWithActesAndContreVisite(userId: number): Observable<Prestation[]> {
    return this.http.get<Prestation[]>(`${this.baseUrl}/findAllWithActesAndContreVisite/${userId}`);
  }


  getPrestationsWithActesAndBenefById(id: number): Observable<Prestation> {
    return this.http.get<Prestation>(`${this.baseUrl}/withActesAndBenef/${id}`);
  }


  getPrestationsByAdherantAssuranceAndUserController(assuranceNom: string, matricule: string, userId: any): Observable<Prestation[]> {
    const url = `${this.baseUrl}/prestationsContrevistebyUserController?assuranceNom=${assuranceNom}&matricule=${matricule}&userId=${userId}`;
    return this.http.get<Prestation[]>(url);
  }

  ajouterPrestationContreVisite(idPrestationOrdinaire: number, adherantId: number, userId: number, favore: Efavore): Observable<Prestation> {
    const url = `${this.baseUrl}/contre-visite/${userId}`;
    const body = {
      idPrestationOrdinaire,
      adherantId,
      userId,
      favore
    };
    return this.http.post<Prestation>(url, body);
  }

  deletePrestation(id: number, montantTotale: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deletePrestation/${id}/${montantTotale}`);
  }

  deletePrestationForBenef(id: number, montantTotale: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deletePrestationForBenef/${id}/${montantTotale}`);
  }

  ajouterPrestationContreVisite1(idPrestationOrdinaire: number, adherantId: number, userId: number, favore: Efavore): Observable<Prestation> {
    const url = `${this.baseUrl}/contre-visite/${userId}`;
    const params = new HttpParams()
      .set('adherantId', adherantId.toString())
      .set('idPrestationOrdinaire', idPrestationOrdinaire.toString())
      .set('favore', favore);

    return this.http.post<Prestation>(url, {}, { params });
  }

  ajouterPrestationContreVisite1PourDentiste(idPrestationOrdinaire: number, adherantId: number, userId: number, favore: Efavore): Observable<Prestation> {
    const url = `${this.baseUrl}/contre-visitePourDentiste/${userId}`;
    const params = new HttpParams()
      .set('adherantId', adherantId.toString())
      .set('idPrestationOrdinaire', idPrestationOrdinaire.toString())
      .set('favore', favore);

    return this.http.post<Prestation>(url, {}, { params });
  }

  ajouterPrestationContreVisitePourBeneficiaire(userId: number, beneficiaireId: number, idPrestationOrdinaire: number, adherantId: number, favore: Efavore): Observable<Prestation> {
    const url = `${this.baseUrl}/contre-visitePourBénéficiare/${userId}/beneficiaire`;
    const params = new HttpParams()
      .set('beneficiaireId', beneficiaireId.toString())
      .set('idPrestationOrdinaire', idPrestationOrdinaire.toString())
      .set('adherantId', adherantId.toString())
      .set('favore', favore);

    return this.http.post<Prestation>(url, {}, { params });
  }

  ajouterPrestationContreVisitePourBeneficiaireDentiste(userId: number, beneficiaireId: number, idPrestationOrdinaire: number, adherantId: number, favore: Efavore): Observable<Prestation> {
    const url = `${this.baseUrl}/contre-visitePourBénéficiareDentiste/${userId}/beneficiaire`;
    const params = new HttpParams()
      .set('beneficiaireId', beneficiaireId.toString())
      .set('idPrestationOrdinaire', idPrestationOrdinaire.toString())
      .set('adherantId', adherantId.toString())
      .set('favore', favore);

    return this.http.post<Prestation>(url, {}, { params });
  }


  modifierPrestationPourDentiste(
    prestationId: number,
    montantTotal: number,
    montantRembourse: number,
    montantTicketModerateur: number,
    totalCotation: number,
    cleCotation: string,
    actesDentaires: string,
  ): Observable<any> {
    const params = new HttpParams()
      .set('prestationId', prestationId.toString())
      .set('montantTotal', montantTotal.toString())
      .set('montantRembourse', montantRembourse.toString())
      .set('montantTicketModerateur', montantTicketModerateur.toString())
      .set('totalCotation', totalCotation.toString())
      .set('cleCotation', cleCotation)
      .set('actesDentaires', actesDentaires);

    return this.http.post(`${this.baseUrl}/adherant/modifierPrestationDentiste`, null, { params });
  }

  getPrestationsByUserControlleur(userId: number): Observable<Prestation[]> {
    const url = `${this.baseUrl}/contre-visite/prestations/${userId}`;
    return this.http.get<Prestation[]>(url);
  }

  canAffectContreVisite(prestationId: number): Observable<boolean> {
    const url = `${this.baseUrl}/can-affect-contre-visite/${prestationId}`;
    return this.http.get<boolean>(url);
  }

  canAffectContreVisiteCheck(prestation: Prestation): boolean {
    if (prestation.type === 'Ordinaire' && prestation.contreVisite && prestation.idUserControlleur === 0) {
      return true;
    } else {
      return false;
    }
  }



  getPrestationsByUser(userId: number): Observable<Prestation[]> {
    return this.http.get<Prestation[]>(`${this.baseUrl}/findByUserId/${userId}`);
  }

  getPrestationsByUserAndAdherant(userId: number, adherantId: number): Observable<Prestation[]> {
    return this.http.get<Prestation[]>(`${this.baseUrl}/findByUserIdAndAdherant/${userId}/${adherantId}`);
  }

  getPrestationsById(id: number): Observable<Prestation> {
    return this.http.get<Prestation>(`${this.baseUrl}/byId/${id}`);
  }

  getPrestationsByUserIdAndFavoreAndEtatAndArchive(userId: number): Observable<Prestation[]> {
    return this.http.get<Prestation[]>(`${this.baseUrl}/findByUserIdAndFavoreAndEtat/${userId}`);
  }

  getPrestationsByUserIdAndEtatAndArchiveForcontroller(userId: number): Observable<Prestation[]> {
    return this.http.get<Prestation[]>(`${this.baseUrl}/findByUserIdAndEtat/${userId}`);
  }

  affecterContreVisite(prestationId: number, userId: number): Observable<Prestation> {
    const url = `${this.baseUrl}/affecter-contre-visite/${prestationId}/${userId}`;
    return this.http.put<Prestation>(url, {});
  }

  calculate(data: CalculationRequest): Observable<CalculationResponse> {
    return this.http.post<CalculationResponse>(`${this.baseUrl}/calculate`, data);
  }


}

















