import { DemandeAbsence } from './DemandeAbsence';
import { TypeDemande } from './TypeDemande';
import { StatusDemande } from './StatusDemande';

export class DemandeAbsenceValidation extends DemandeAbsence {

	constructor(
		public nomCollegue: string,
		public prenomCollegue: string,
		dateDebut: Date,
		dateFin: Date,
		type: TypeDemande,
		status: StatusDemande,
		motif: string,
		id: number

	) {
		super(dateDebut, dateFin, type, status, motif, id);

	}
}
