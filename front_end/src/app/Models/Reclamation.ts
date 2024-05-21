import { EReclamationStatus } from "./EReclamationStatus";
import { User } from "./User";

export interface Reclamation {

    id: number;
    titre: string;
    description: string;
    dateCreation: Date;
    statut: EReclamationStatus; 
    user: User;
}
