import { Adherant } from "./Adherant";

export interface Beneficiaire {
  id: number;
  nom: string;
  prenom: string;
  sexe: string;
  dateNais: Date;
  qualite: string;
  adherant: Adherant;
  plafond: number;
}
