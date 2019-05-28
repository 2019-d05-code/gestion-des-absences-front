import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { Collegue } from '../auth/auth.domains';
import { GestionAbsencesService } from '../gestion-absences/gestion-absences.service';
import { compare, SortEvent, NgbdSortableHeader } from '../gestion-absences/gestion-absences.component';
import { DemandeAbsence } from '../models/DemandeAbsence';
import { Observable } from 'rxjs';
import { TypeDemande } from '../models/TypeDemande';
import { ValidationDemandeService } from './validation-demandes.service';

@Component({
	selector: 'app-validation-demandes',
	templateUrl: './validation-demandes.component.html',
	styleUrls: ['./validation-demandes.css']
})
export class ValidationDemandesComponent implements OnInit {
	collegueConnecte: Collegue;
	@Input() connecte: boolean;
	roleManager: string[];

	tabDemandes: DemandeAbsence[] = [];
	observableDemandes: Observable<DemandeAbsence[]>;
	messageErreur: string;
	messageSucces: string;
	demande = new DemandeAbsence(undefined, undefined, undefined);

	typeDde: TypeDemande;

	// Création de la constante qui représente le tableau
	tableauDemandes = [];
	tableauInit = [];
	tableauInitMission = [];

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

	constructor(private _authSrv: AuthService,
		private _validationDdesServ: ValidationDemandeService) { }


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


		// Ensuite on récupère les absences associées
		this.observableDemandes = this._validationDdesServ.getListeAbsencesAttenteValidation(this.collegueConnecte.email);
		this.observableDemandes.subscribe(demandeTab => {
			this.tableauInit = demandeTab;
			this.longueurTableau = this.tableauInit.length;
			this.onSort({ column: 'dateDebut', direction: 'asc' });
		},
			error => {
				console.log(error.message);
			});


	}


	// composant pour valider la demande d'absence
	validerDemande(demande) {
		this._validationDdesServ.envoieValiderDemande(demande).subscribe(
			() => {
				this.messageSucces = 'La demande d\'absence a bien été validée';
				alert(this.messageSucces);
				setTimeout(
					() => this.messageSucces = undefined,
					7000
				);
			},
			error => {
				this.messageErreur = error.error;
				setTimeout(
					() => this.messageErreur = undefined,
					7000
				);
			}
		);

	}

	// composant pour invalider la demande d'absence
	invaliderDemande(demande) {
		this._validationDdesServ.envoieValiderDemande(demande).subscribe(
			() => {
				this.messageSucces = 'La demande d\'absence a bien été déclinée';
				alert(this.messageSucces);
				setTimeout(
					() => this.messageSucces = undefined,
					7000
				);
			},
			error => {
				this.messageErreur = error.error;
				setTimeout(
					() => this.messageErreur = undefined,
					7000
				);
			}
		);


	}



}
