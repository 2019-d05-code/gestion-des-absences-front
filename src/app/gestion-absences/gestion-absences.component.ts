import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModifDemandeAbsenceComponent } from '../modif-demande-absence/modif-demande-absence.component';
import { SuppressionDemandeAbsenceComponent } from '../suppression-demande-absence/suppression-demande-absence.component';
import { DemandeAbsence } from '../models/DemandeAbsence';
import { Observable } from 'rxjs';
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

	constructor(private modal: NgbModal, private _gestionAbsencesSrv: GestionAbsencesService, private _serviceAuthService: AuthService) { }

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

	chargerModifModal(demande) {
		this.modal.open(ModifDemandeAbsenceComponent,demande);
	}

	chargerSuppresionModal() {
		this.modal.open(SuppressionDemandeAbsenceComponent);
	}
}
