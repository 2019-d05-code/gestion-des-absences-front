import { Component, OnInit } from '@angular/core';
import { DemandeAbsence } from '../models/DemandeAbsence';
import { GestionAbsencesService } from '../gestion-absences/gestion-absences.service';
import { AuthService } from '../auth/auth.service';
import { Collegue } from '../auth/auth.domains';

@Component({
	selector: 'app-creer-demande-absence',
	templateUrl: './creer-demande-absence.component.html'
})
export class CreerDemandeAbsenceComponent implements OnInit {

	demande: DemandeAbsence = new DemandeAbsence(undefined, undefined, undefined);
	messageSucces: string;
	messageErreur: string;
	collegueConnecte: Collegue;

	constructor(private _serviceGestionAbsence: GestionAbsencesService, private _serviceAuthService: AuthService) { }

	/*
	* Transmet la demande d'absence vers le back
	*/
	creerDemande() {

		this.demande.email = this.collegueConnecte.email;

		this._serviceGestionAbsence.ajouterDemandeAbsence(this.demande)
			.subscribe(
				() => {
					this.messageSucces = 'Votre demande d\'absence a été enregistrée avce succès';
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

	ngOnInit() {

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
	}

}
