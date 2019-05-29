import { Component, OnInit, Input } from '@angular/core';
import { Collegue } from '../auth/auth.domains';
import { AuthService } from '../auth/auth.service';
import { SelectionManager } from '../models/SelectionManager';
import { ManagerVueDptCollabService } from './manager-vue-dpt-collab.service';
import { map } from 'rxjs/operators';
import { Absences } from '../models/Absences';

@Component({
	selector: 'app-manager-vue-dpt-collab',
	templateUrl: './manager-vue-dpt-collab.component.html',
	styleUrls: ['./manager-vue-dpt-collab.css']
})
export class ManagerVueDptCollabComponent implements OnInit {
	collegueConnecte: Collegue;
	@Input() connecte: boolean;
	roleManager: string[];

	selection: SelectionManager = new SelectionManager();

	// récupérer dernier jour du mois - a implémenter en fonction du mois sélectionné
	date = new Date(2019, 5, 0);
	dernierJour = this.date.getDate();

	listeJoursMois: number[] = [];

	// récupérer la liste des jours du week-end et la liste des absences
	joursWeekend: number[] = [];
	listeDesAbsences: Absences[] = [];

	constructor(private _authSrv: AuthService, private _managerSrv: ManagerVueDptCollabService) { }


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

	// appelle le get pour pouvoir afficher la nouvelle liste des absences
	rechercher(selection) {
		this._managerSrv.postRapport(selection).subscribe(
			rapport => {
				this.joursWeekend = rapport.joursWeekEnd;
				this.listeDesAbsences = rapport.listeAbsences;
			}
		);



	}
}
