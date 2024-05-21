import { Assurance } from "./Assurance";
import { Beneficiaire } from "./Beneficiaire";
import { Prestation } from "./Prestation";

export interface Adherant {
  id: number;
  cin: string;
  matricule: string;
  nom: string;
  prenom: string;
  sexe: string;
  numtel: string;
  dateNais: Date;
  gouvNais: string;
  paysNais: string;
  plafond: number;
  prestations: Prestation[];
  beneficiaires: Beneficiaire[];
  assurance: Assurance;
}
