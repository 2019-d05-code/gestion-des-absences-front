import { Component, OnInit, Input } from '@angular/core';
import { Collegue } from '../auth/auth.domains';
import { AuthService } from '../auth/auth.service';

@Component({
	selector: 'app-manager-vue-dpt-collab',
	templateUrl: './manager-vue-dpt-collab.component.html',
	styles: []
})
export class ManagerVueDptCollabComponent implements OnInit {
	collegueConnecte: Collegue;
	@Input() connecte: boolean;
	roleManager: string[];

	// récupérer dernier jour du mois - a implémenter en fonction du mois sélectionné
	date = new Date(2019, 5, 0);
	dernierJour = this.date.getDate();

	listeJoursMois: number[] = [];

	constructor(private _authSrv: AuthService) { }


	verifRoleManager(): boolean {
		if (this.connecte) {

			let granted = false;

			const roleManager = this.collegueConnecte.roles.filter(role => role === 'ROLE_MANAGER');

			if (roleManager.length > 0) {
				granted = true;

			}
			return granted;
		}
	}

	ngOnInit() {
		this._authSrv.collegueConnecteObs
			.subscribe(
				collegue => {
					this.collegueConnecte = collegue;

					if (this.collegueConnecte.estAnonyme()) {
						this.connecte = false;

					} else {
						this.connecte = true;

					}
				},
				() => this.connecte = false

			);

		// implémentation du tableau en fonction du nombre de jours dans le mois
		for (let i = 1; i <= this.dernierJour; i++) {
			this.listeJoursMois.push(i);
		}

	}
}
