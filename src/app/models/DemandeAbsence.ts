import { TypeDemande } from './TypeDemande';
import { StatusDemande } from './StatusDemande';

// Représente une demande d'absence, cet objet est destiné a être envoyé côté back
export class DemandeAbsence {

	public email: string;

	constructor(
		public dateDebut: Date,
		public dateFin: Date,
		public type: TypeDemande,
		public status?: StatusDemande,
		public motif?: string,
		public id?: number) { }

}
