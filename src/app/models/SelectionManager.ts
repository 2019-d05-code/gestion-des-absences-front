export class SelectionManager {
	public mois: string;
	public annee: number;
	public departement: number;

	constructor() {
		this.departement = 1;
		const date = new Date();
		this.annee = date.getFullYear();

		const mois = date.getMonth() + 1;

		if (mois < 10) {
			this.mois = `0${mois}`;
		} else {
			this.mois = `${mois}`;
		}
	}
}
