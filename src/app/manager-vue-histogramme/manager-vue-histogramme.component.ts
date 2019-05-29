import { Component, OnInit, Input } from '@angular/core';
import { Collegue } from '../auth/auth.domains';
import { AuthService } from '../auth/auth.service';
import { SelectionManager } from '../models/SelectionManager';
import { HistoManagerService } from './histo-manager.service';
import { Departement } from '../models/Departement';
import { ManagerVueDptCollabService } from '../manager-vue-dpt-collab/manager-vue-dpt-collab.service';
import { Rapport } from '../models/Rapport';
import { detectChanges } from '@angular/core/src/render3';

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
	public chartDatasets: Array<any> = [{data: [], label: '', backgroundColor: '', borderColor: ''}];

	// Pour mettre les 31 colonnes des jours, utiliser CalculJourParMois() à faire
	public chartLabels = [];

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

		const date: Date = new Date(this.selection.annee, parseInt(this.selection.mois.valueOf(), 10), 0);
		const nbJoursMois = date.getDate();

		const tab: string[] = [];

		for (let i = 1; i <= nbJoursMois; i++) {
			if (i < 10) {
				tab.push(`0${i}/${this.selection.mois}/${this.selection.annee}`);
			} else {
				tab.push(`${i}/${this.selection.mois}/${this.selection.annee}`);
			}
		}

		this.chartLabels = tab;

		this._serviceData.postRapport(this.selection).subscribe(
			rapport => {
				const tab = [];
				let primary = 80;
				for (const absence of rapport.listeAbsences) {
					const datas = {
						data: [],
						label: `${absence.prenomCollegue} ${absence.nomCollegue}`,
						backgroundColor: `rgba(${primary}, ${primary}, 100, 0.3)`,
						borderColor: `rgba(${primary}, ${primary}, 100, 0.8)`
					};
					primary++;
					for (let i = 1; i < 32; i++) {
						if (absence.joursCP.includes(i) || absence.joursRTT.includes(i) || absence.joursCSS.includes(i)) {
							datas.data.push(1);
						} else {
							datas.data.push(0);
						}
					}
					tab.push(datas);
				}
				this.chartDatasets = tab;
			}
		);
	}

	public chartClicked(e: any): void { }
	public chartHovered(e: any): void { }

	constructor(private _authSrv: AuthService, private _service: HistoManagerService, private _serviceData: ManagerVueDptCollabService) { }

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

		// this.calculJourParMois();
	}

}
