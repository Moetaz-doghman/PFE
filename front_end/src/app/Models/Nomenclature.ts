import { ActeDentaire } from "./Prestation";

export interface Nomenclature {
  id: number;
  codeActe: string;
  cotation: string;
  avisMedical: string;
  acteDentaire: ActeDentaire;
}
