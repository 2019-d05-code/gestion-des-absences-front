import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { Collegue } from '../auth/auth.domains';
import { AuthService } from '../auth/auth.service';
import { SelectionManager } from '../models/SelectionManager';
import { ManagerVueDptCollabService } from './manager-vue-dpt-collab.service';

import { Absences } from '../models/Absences';

import { CsvDataService } from './Csv-Data.Service'
import { Departement } from '../models/Departement';
import { HistoManagerService } from '../manager-vue-histogramme/histo-manager.service';


@Component({
	selector: 'app-manager-vue-dpt-collab',
	templateUrl: './manager-vue-dpt-collab.component.html',
	styleUrls: ['./manager-vue-dpt-collab.css']
})
export class ManagerVueDptCollabComponent implements OnInit {
	collegueConnecte: Collegue;
	@Input() connecte: boolean;
	roleManager: string[];
	departements: Departement[];

	selection: SelectionManager = new SelectionManager();

	// implémentation du nombre de jours dans le mois
	listeJoursMois: number[] = [];
	// récupérer la liste des jours du week-end et la liste des absences
	joursWeekend: number[] = [];
	listeDesAbsences: Absences[] = [];

	constructor(private _authSrv: AuthService, private _managerSrv: ManagerVueDptCollabService,
		private _histoServ: HistoManagerService) { }


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


		this._histoServ.recupDepartements().subscribe(
			departements => this.departements = departements
		);


		this.rechercher(this.selection);

	}

	// trouver nb jour du mois
	nbJours(selectionFaite) {
		// implémentation du tableau en fonction du nombre de jours dans le mois
		// récupérer dernier jour du mois - a implémenter en fonction du mois sélectionné
		const date = new Date(selectionFaite.annee, Number(selectionFaite.mois), 0);
		const dernierJour = date.getDate();
		for (let i = 1; i <= dernierJour; i++) {
			this.listeJoursMois.push(i);
		}
	}

	// appelle le get pour pouvoir afficher la nouvelle liste des absences
	rechercher(selection) {
		// remise à zéro du tableau du nb de jours par mois pour pas qu'il s'affiche plusieurs fois
		this.listeJoursMois = [];
		this._managerSrv.postRapport(selection).subscribe(
			rapport => {
				this.joursWeekend = rapport.joursWeekEnd;
				this.listeDesAbsences = rapport.listeAbsences;
				this._managerSrv.recupRapportAvecMissions(selection)
					.subscribe(
						rapportMissions => {
							this.listeDesAbsences.concat(rapportMissions.listeAbsences);
						}
					);
			}
		);
		this.nbJours(this.selection);
	}

	export() {
		const tableauExport: any[] = [];
		const enTete: string[] = [];
		enTete.push('Nom');
		for (let i = 0; i <= 31; i++) {
			enTete.push(i.toString());
		}
		tableauExport.push(enTete);


		for (let absences of this.listeDesAbsences) {
			const corps: string[] = [];
			corps.push(`${absences.nomCollegue.toString()} ${absences.prenomCollegue.toString()}`);
			for (let i = 1; i <= 31; i++) {
				if (absences.joursCP && absences.joursCP.includes(i)) {
					corps.push('C');

				} else if (absences.joursRTT && absences.joursRTT.includes(i)) {
					corps.push('R');

				} else if (absences.joursCSS && absences.joursCSS.includes(i)) {
					corps.push('S');

				} else if (absences.joursMISSIONS && absences.joursMISSIONS.includes(i)) {
					corps.push('M');

				} else {
					corps.push(' ');

				}

			}
			tableauExport.push(corps);

		}


		CsvDataService.exportToCsv('test.csv', tableauExport);
	}

}
