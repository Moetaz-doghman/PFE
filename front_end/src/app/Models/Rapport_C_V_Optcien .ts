import { Prestation } from "./Prestation";


export interface Rapport_C_V_Optcien  {
  id: number;
  ref: string;
  refNumber: string;
  dateRapport: Date;
  observation: string;
  sphereD: number;
  axeD: number;
  acuiteD: number;
  sphereG: number;
  axeG: number;
  acuiteG: number;
  valeurVerreMin: number;
  valeurVerreMax: number;
  valeurVerreBlancMin: number;
  valeurVerreBlancMax: number;
  prixMontureMin: number;
  prixMontureMax: number;
  natureVerre: string;
  prestation :Prestation 

}






