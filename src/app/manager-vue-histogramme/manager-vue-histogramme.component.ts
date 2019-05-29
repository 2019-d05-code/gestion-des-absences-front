import { Component, OnInit, Input } from '@angular/core';
import { Collegue } from '../auth/auth.domains';
import { AuthService } from '../auth/auth.service';
import { SelectionManager } from '../models/SelectionManager';
import { HistoManagerService } from './histo-manager.service';
import { Departement } from '../models/Departement';

@Component({
	selector: 'app-manager-vue-histogramme',
	templateUrl: './manager-vue-histogramme.component.html',
})
export class ManagerVueHistogrammeComponent implements OnInit {
	collegueConnecte: Collegue;
	@Input() connecte: boolean;
	roleManager: string[];
	selection: SelectionManager = new SelectionManager();
	departements: Departement[];

	// Type du graphique
	public chartType = 'bar';

	// Jeu de données
	public chartDatasets: Array<any> = [
		{ data: [0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0], label: 'this.Absence.nomCollegue1' },
		{ data: [0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0], label: 'this.Absence.nomCollegue2' },

	];

	// Pour mettre les 31 colonnes des jours, utiliser CalculJourParMois() à faire
	public chartLabels = [];

	public chartColors: Array<any> = [
		{
			backgroundColor: [
				'rgba(255, 99, 132, 0.2)',
				'rgba(54, 162, 235, 0.2)',
				'rgba(255, 206, 86, 0.2)',
				'rgba(75, 192, 192, 0.2)',
				'rgba(153, 102, 255, 0.2)',
				'rgba(255, 159, 64, 0.2)',
				'rgba(255, 159, 64, 0.2)'
			],
			borderColor: [
				'rgba(255,99,132,1)',
				'rgba(54, 162, 235, 1)',
				'rgba(255, 206, 86, 1)',
				'rgba(75, 192, 192, 1)',
				'rgba(153, 102, 255, 1)',
				'rgba(255, 159, 64, 1)',
				'rgba(255, 159, 64, 1)'

			],
			borderWidth: 2,
		},
		{
			backgroundColor: [
				'rgba(255, 125, 158, 0.2)',
				'rgba(3, 111, 184, 0.2)',
				'rgba(255, 255, 137, 0.2)',
				'rgba(75, 192, 192, 0.2)',
				'rgba(126, 243, 243, 0.2)',
				'rgba(255, 210, 115, 0.2)',
				'rgba(255, 210, 115, 0.2)'
			],
			borderColor: [
				'rgba(255, 125, 158, 1)',
				'rgba(3, 111, 184, 1)',
				'rgba(255, 255, 137, 1)',
				'rgba(75, 192, 192, 1)',
				'rgba(126, 243, 243, 1)',
				'rgba(255, 210, 115, 1)',
				'rgba(255, 210, 115, 1)'

			],
			borderWidth: 2,
		},
	];

	public chartOptions: any = {
		responsive: true,
		scales: {
			xAxes: [{
				scaleLabel: { labelString: 'Dates', display: true },
				stacked: true,

			}],

			yAxes: [{
				stacked: true,
				ticks: {
					precision: 0
				}

			}]
		}

	};

	calculJourParMois() {

		const date: Date = new Date(this.selection.annee, parseInt( this.selection.mois.valueOf(), 10 ), 0);
		const nbJoursMois =  date.getDate();

		const tab: string[] = [];

		for (let i = 1; i <= nbJoursMois; i++) {
			if (i < 10) {
				tab.push(`0${i}/${this.selection.mois}/${this.selection.annee}`);
			} else {
				tab.push(`${i}/${this.selection.mois}/${this.selection.annee}`);
			}
		}

		this.chartLabels = tab;
	}

	calculWeekendParMois() {

	}

	public chartClicked(e: any): void { }
	public chartHovered(e: any): void { }


	constructor(private _authSrv: AuthService, private _service: HistoManagerService) { }

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

		this._service.recupDepartements().subscribe(
			departements => this.departements = departements
		);

		this.calculJourParMois();
	}

}
