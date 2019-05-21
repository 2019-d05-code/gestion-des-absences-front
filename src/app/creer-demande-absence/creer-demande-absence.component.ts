import { Component, OnInit } from '@angular/core';
import { DemandeAbsence } from '../models/DemandeAbsence';
import { GestionAbsencesService } from '../gestion-absences/gestion-absences.service';

@Component({
	selector: 'app-creer-demande-absence',
	templateUrl: './creer-demande-absence.component.html'
})
export class CreerDemandeAbsenceComponent implements OnInit {

	demande: DemandeAbsence = new DemandeAbsence(undefined, undefined, undefined);
	messageSucces: string;
	messageErreur: string;

	constructor(private _serviceGestionAbsence: GestionAbsencesService) { }

	creerDemande() {

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
	}

}
