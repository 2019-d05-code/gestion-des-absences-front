import { TypeDemande } from './TypeDemande';

export class JourFerie {
	constructor(public date: Date, public type: TypeDemande, public commentaire?: string, public id?: number) {}
}
