import { Adherant } from "./Adherant";
import { Beneficiaire } from "./Beneficiaire";
import { EPrest } from "./EPrest";
import { Efavore } from "./Efavore";
import { Nomenclature } from "./Nomenclature";
import { User } from "./User";

export interface Prestation {
  id: number;
  ref: string;
  refNumber: string;
  description: string;
  dateCreation: Date;
  etat: boolean;
  statut: boolean;
  montantTotal: number;
  montantRembourse: number;
  montantTicketModerateur: number;
  type: EPrest;
  sphereD: number;
  axeD: number;
  acuiteD: number;
  sphereG: number;
  axeG: number;
  acuiteG: number;
  valeurVerreOeilGauche: number;
  valeurVerreOeilDroit: number;
  valeurMonture: number;
  favore: Efavore;
  cleCotation: string;
  totalCotation: number;
  idUserControlleur:number,
  contreVisite: boolean;
  beneficiaireId: string;
  rapportcontreVisite:boolean;
  idPrestation :string
  actes: ActeDentaire[];
  adherant: Adherant;
  user: User;
  beneficiaire : Beneficiaire;
  montant_ticket_moderateur: number;
  cle_cotation : string;
  professionalName:String
  selected?: boolean;
  disabled?: boolean;



}



export class ActeDentaire {
  id: number;
  nom: EActe;
  nomenclatures: Nomenclature[];

}

export enum EActe {
  Consultation = 'Consultation',
  SoinsDentaire = 'SoinsDentaire',
  Prothese = 'Prothese',
  ODF = 'ODF'
}




