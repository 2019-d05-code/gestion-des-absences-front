import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Collegue } from '../auth/auth.domains';
import { AuthService } from '../auth/auth.service';
import { SelectionManager } from '../models/SelectionManager';
import { HistoManagerService } from './histo-manager.service';
import { Departement } from '../models/Departement';
import { ManagerVueDptCollabService } from '../manager-vue-dpt-collab/manager-vue-dpt-collab.service';
import { BaseChartDirective } from 'angular-bootstrap-md';
import { Rapport } from '../models/Rapport';
import { CsvDataService } from '../manager-vue-dpt-collab/Csv-Data.Service';

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
	@ViewChild(BaseChartDirective) childCmpBaseChartRef: any;
	rapport: Rapport;

	// Type du graphique
	public chartType = 'bar';

	// Jeu de données
	public chartDatasets: Array<any>;

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
				if (rapport.listeAbsences.length === 0) {
					this.chartDatasets = [{
						data: [],
						label: ``,
						backgroundColor: ``,
						borderColor: ``
					}];
				} else {
					this.rapport = rapport;

					let primary = 80;

					this.chartDatasets = rapport.listeAbsences
						.map(
							absence => {
								const datas = {
									data: [],
									label: `${absence.prenomCollegue}-${absence.nomCollegue}`,
									backgroundColor: `rgba(${primary}, ${primary}, 100, 0.3)`,
									borderColor: `rgba(${primary}, ${primary}, 100, 0.8)`
								};
								primary++;
								for (let i = 1; i < 32; i++) {
									if (
										!rapport.joursWeekEnd.includes(i) &&
										(absence.joursCP.includes(i) ||
										absence.joursRTT.includes(i) ||
										absence.joursCSS.includes(i))
									) {
										datas.data.push(1);
									} else {
										datas.data.push(0);
									}
								}
								return datas;
							}
						);

					// Force le dataCharset à prendre en compte les données reçues
					if (
						this.childCmpBaseChartRef &&
						this.childCmpBaseChartRef.datasets &&
						this.childCmpBaseChartRef.datasets.length !== this.chartDatasets.length
					) {
						this.childCmpBaseChartRef.datasets = this.chartDatasets;
						this.childCmpBaseChartRef.ngOnInit();
					}
				}

			}
		);
	}

	public chartClicked(e: any): void { }
	public chartHovered(e: any): void { }

	genererCSV(): void {

		const tableauExport: any[] = [];
		const enTete: string[] = [];

		enTete.push('Departement');
		enTete.push('Nom');
		this.chartLabels.forEach(
			label => enTete.push(label)
		);

		tableauExport.push(enTete);

		this.chartDatasets.forEach(
			set => {
				const corps: string[] = [];
				corps.push(this.selection.departement.toString());
				corps.push(set.label);
				set.data.forEach(element => {
					corps.push(element);
				});
				tableauExport.push(corps);
			}
		);

		CsvDataService.exportToCsv(`donnees_${this.selection.departement}_${this.selection.mois}_${this.selection.annee}.csv`, tableauExport);

	}

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

		this.calculJourParMois();
	}

}
