import { TypeDemande } from './TypeDemande';

// Représente une demande d'absence, cet objet est destiné a être envoyé côté back
export class DemandeAbsence {

	public email: string;

	constructor(public dateDebut: Date, public dateFin: Date, public type: TypeDemande, public motif?: string) {}

}
