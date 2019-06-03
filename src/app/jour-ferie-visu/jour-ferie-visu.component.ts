import { Component, OnInit, Input, Directive, EventEmitter, Output, ViewChildren, QueryList, LOCALE_ID } from '@angular/core';

import { JourFerieService } from './jour-ferie.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SuppressionDemandeAbsenceComponent } from '../suppression-demande-absence/suppression-demande-absence.component';
import { VisuDemandeAbsenceComponent } from '../visu-demande-absence/visu-demande-absence.component';
import { NgbdSortableHeader } from '../gestion-absences/gestion-absences.component';
import { JourFerie } from '../models/JourFerie';
import { ModifJourFerieComponent } from '../modif-jour-ferie/modif-jour-ferie.component';

// Création des types pour le tri du tableau
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { 'asc': 'desc', 'desc': '', '': 'asc' };
export const compare = (v1, v2) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

export interface SortEvent {
	column: string;
	direction: SortDirection;
}

@Component({
	selector: 'app-jour-ferie-visu',
	templateUrl: './jour-ferie-visu.component.html',
	styles: ['./jour-ferie.css'],
	providers: [
		{ provide: LOCALE_ID, useValue: 'fr-FR' }
]
})
export class JourFerieVisuComponent implements OnInit {

	// rcupération de l'année sélectionnée
	anneeSelect = 2019;

	// Création de la constante qui représente le tableau
	tableauRTT = [];
	tableauInit = [];

	// Création des variables pour les pages
	page = 1;
	pageSize = 5;
	longueurTableau = this.tableauInit.length;

	@ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

	onSort({ column, direction }: SortEvent) {

		// resetting other headers
		this.headers.forEach(header => {
			if (header.sortable !== column) {
				header.direction = '';
			}
		});

		// sorting demandes
		if (direction === '') {
			this.tableauRTT = [...this.tableauInit];
		} else {
			this.tableauRTT = [...this.tableauInit].sort((a, b) => {
				const res = compare(a[column], b[column]);
				return direction === 'asc' ? res : -res;
			});
		}
	}

	// paginate
	get listePaginees() {
		return [...this.tableauRTT]

			.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);

	}



	constructor(private modal: NgbModal, private _service: JourFerieService) { }

	recupAbsencesCollectives(): void {
		this._service.recupListeAbsenceCollectives(this.anneeSelect)
			.subscribe(
				absencesCollec => {
					this.tableauInit = absencesCollec;
					this.longueurTableau = this.tableauInit.length;
					this.onSort({ column: 'date', direction: 'asc' });
				}
			);
	}
	// charger la modal de suppresion au click

	chargerModifModal(absenceCollective: JourFerie) {

		const myModal = this.modal.open(ModifJourFerieComponent);
		myModal.componentInstance.jourFerieModal = absenceCollective;

		myModal.result.then((result) => {
			console.log(result);
		}, (reason) => {
			console.log(reason);
		});

	}

	ngOnInit() {
		this.recupAbsencesCollectives();
	}

	// charger la modal de suppresion au click
	chargerSuppresionModal(absenceCollective: JourFerie) {
		const myModal = this.modal.open(SuppressionDemandeAbsenceComponent);
		myModal.componentInstance.demandeModal = absenceCollective;

		myModal.result.then((result) => {
			console.log(result);
		}, (reason) => {
			console.log(reason);
		});

	}

	// charger la modal de visualisation au click
	chargerVisuModal(absenceCollective: JourFerie) {
		const myModal = this.modal.open(VisuDemandeAbsenceComponent);
		myModal.componentInstance.demandeModal = absenceCollective;

		myModal.result.then((result) => {
			console.log(result);
		}, (reason) => {
			console.log(reason);
		});
	}


}

