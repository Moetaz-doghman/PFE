import { Prestation } from "./Prestation";

export interface Bordereaux {
  id: number;
  ref: string;
  refNumber: string;
  numFacture: string;
  dateCreationF: Date;
  nbPrestation: number;
  montant_total: number;
  montant_total_Remboursable: number;
  montant_ticket_moderateur: number;
  status: string;
  prestations: Prestation[];
  type : EType;
}

export enum EType {
  Ordinaire = 'Ordinaire',
  Contre_visite = 'Contre_visite'
}


