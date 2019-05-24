import { Component, OnInit, Directive, Input, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DemandeAbsence } from '../models/DemandeAbsence';
import { Observable } from 'rxjs';
import { GestionAbsencesService } from './gestion-absences.service';
import { AuthService } from '../auth/auth.service';
import { Collegue } from '../auth/auth.domains';
import { TypeDemande } from '../models/TypeDemande';
import { SuppressionDemandeAbsenceComponent } from '../suppression-demande-absence/suppression-demande-absence.component';
import { VisuDemandeAbsenceComponent } from '../visu-demande-absence/visu-demande-absence.component';

// Création des types pour le tri du tableau
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { 'asc': 'desc', 'desc': '', '': 'asc' };
export const compare = (v1, v2) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

export interface SortEvent {
	column: string;
	direction: SortDirection;
}

@Directive({
	selector: 'th[sortable]',
	host: {
		'[class.asc]': 'direction === "asc"',
		'[class.desc]': 'direction === "desc"',
		'(click)': 'rotate()'
	}
})

export class NgbdSortableHeader {

	@Input() sortable: string;
	@Input() direction: SortDirection = '';
	@Output() sort = new EventEmitter<SortEvent>();

	rotate() {
		this.direction = rotate[this.direction];
		this.sort.emit({ column: this.sortable, direction: this.direction });
	}
}

@Component({
	selector: 'app-gestion-absences',
	templateUrl: './gestion-absences.component.html',
	styleUrls: ['./gestion-absences.component.css']
})
export class GestionAbsencesComponent implements OnInit {
	tabDemandes: DemandeAbsence[] = [];
	observableDemandes: Observable<DemandeAbsence[]>;
	collegueConnecte: Collegue;
	messageErreur: string;
	demande = new DemandeAbsence(undefined, undefined, undefined);

	typeDde: TypeDemande;

	// Création de la constante qui représente le tableau
	tableauDemandes = [];
	tableauInit = []

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
			this.tableauDemandes = [...this.tableauInit];
		} else {
			this.tableauDemandes = [...this.tableauInit].sort((a, b) => {
				const res = compare(a[column], b[column]);
				return direction === 'asc' ? res : -res;
			});
		}
	}

	// paginate
	get listePaginees() {
		return [...this.tableauDemandes]

			.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);

	}



	constructor(private modal: NgbModal, private _gestionAbsencesSrv: GestionAbsencesService, private _serviceAuthService: AuthService) { }

	recupDemande(demande: DemandeAbsence): void {
		this._gestionAbsencesSrv.subject.next(demande);
	}

	ngOnInit() {
		// D'abord on récupère le collègue connecté
		this._serviceAuthService.collegueConnecteObs.subscribe(
			collegue => this.collegueConnecte = collegue,
			error => {
				this.messageErreur = error.error;
				setTimeout(
					() => this.messageErreur = undefined,
					7000
				);
			}
		);

		// Ensuite on récupère les absences associées
		this.observableDemandes = this._gestionAbsencesSrv.getListeAbsences(this.collegueConnecte.email);
		this.observableDemandes.subscribe(demandeTab => {
			this.tableauInit = demandeTab;
			this.longueurTableau = this.tableauInit.length;
			this.onSort({ column: 'dateDebut', direction: 'asc' });
		},
			error => {
				console.log(error.message);
			});



	}

	// charger la modal de suppresion au click
	chargerSuppresionModal(demande: DemandeAbsence) {
		console.log(demande);
		const myModal = this.modal.open(SuppressionDemandeAbsenceComponent);
		myModal.componentInstance.demandeModal = demande;

		myModal.result.then((result) => {
			console.log(result);
		}, (reason) => {
			console.log(reason);
		});

	}

	// charger la modal de visualisation au click
	chargerVisuModal(demande: DemandeAbsence) {
		console.log(demande);
		const myModal = this.modal.open(VisuDemandeAbsenceComponent);
		myModal.componentInstance.demandeModal = demande;

		myModal.result.then((result) => {
			console.log(result);
		}, (reason) => {
			console.log(reason);
		});
	}


}
