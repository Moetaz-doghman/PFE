import { EReclamationStatus } from "./EReclamationStatus";
import { User } from "./User";

export interface Reclamation {

    id: number;
    titre: string;
    type: string;
    convention : string;
    qualifications: string;
    description: string;
    dateCreation: Date;
    statut: EReclamationStatus;
    user: User;
}
