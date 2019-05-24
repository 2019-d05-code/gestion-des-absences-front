import { Component, OnInit, Input } from '@angular/core';
import { DemandeAbsence } from '../models/DemandeAbsence';
import { GestionAbsencesService } from '../gestion-absences/gestion-absences.service';

@Component({
	selector: 'app-modif-demande-absence',
	templateUrl: './modif-demande-absence.component.html'
})
export class ModifDemandeAbsenceComponent implements OnInit {

	demande: DemandeAbsence;
	messageSucces: string;
	messageErreur: string;

	constructor(private _serviceGestionAbsence: GestionAbsencesService) { }

	/*
	* Transmet la demande d'absence vers le back
	*/
	modifDemande() {

		// this._serviceGestionAbsence.ajouterDemandeAbsence(this.demande)
		// 	.subscribe(
		// 		() => {
		// 			this.messageSucces = 'Votre demande d\'absence a été enregistrée avce succès';
		// 			setTimeout(
		// 				() => this.messageSucces = undefined,
		// 				7000
		// 			);
		// 		},
		// 		error => {
		// 			this.messageErreur = error.error;
		// 			setTimeout(
		// 				() => this.messageErreur = undefined,
		// 				7000
		// 			);
		// 		}
		// 	);

	}

	ngOnInit() {

		this._serviceGestionAbsence.subscribeSubject().subscribe(
			demande => {
				console.log(demande)
				this.demande = demande;
			}
		);

	}

}
