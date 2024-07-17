import { Adherant } from "./Adherant";

export interface Assurance {
  id: number;
  nom: string;
  prixCotation: number;
  adherants: Adherant[];
  prix_cotation : number;
  prix_cotationODF: number;
  prix_cotationProthese: number;
}
