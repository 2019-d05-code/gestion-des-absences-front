import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DemandeAbsence } from '../models/DemandeAbsence';
import { Observable, Subject } from 'rxjs';
import { GestionAbsencesService } from './gestion-absences.service';
import { AuthService } from '../auth/auth.service';
import { Collegue } from '../auth/auth.domains';

@Component({
	selector: 'app-gestion-absences',
	templateUrl: './gestion-absences.component.html',
	styles: []
})
export class GestionAbsencesComponent implements OnInit {
	tabDemandes: DemandeAbsence[] = [];
	observableDemandes: Observable<DemandeAbsence[]>;
	collegueConnecte: Collegue;
	messageErreur: string;
	demande = new DemandeAbsence(undefined, undefined, undefined,);

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
		this.observableDemandes.subscribe(demande => this.tabDemandes = demande,
			error => {
				console.log(error.message);
			});
	}

}
