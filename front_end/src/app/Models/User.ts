import { Role } from "./Role";

export interface User {
  id: number;
  email: string;
  password: string;
  matricule: string;
  nom: string;
  prenom: string;
  adresse: string;
  tel: string;
  identiteBancaire: string;
  active: boolean;
  roles: Role[];


}
