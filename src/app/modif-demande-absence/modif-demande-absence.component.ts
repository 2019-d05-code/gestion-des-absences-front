import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DemandeAbsence } from '../models/DemandeAbsence';
import { GestionAbsencesService } from '../gestion-absences/gestion-absences.service';



@Component({
	selector: 'app-modif-demande-absence',
	templateUrl: './modif-demande-absence.component.html',

})

export class ModifDemandeAbsenceComponent implements OnInit {

	// Boolean pour afficher les bouton basculer en mode édition ou valider
	edition = false;

	// création de la demande pour mettre dans le formulaire, qui sera récupérée après

	demandeModal: DemandeAbsence;

	messageErreur: string;
	messageSucces: string;
	collegueConnecte: any;

	ngOnInit() {

	}

	closeResult: string;
	constructor(private modalService: NgbModal, private _serviceGestionAbsence: GestionAbsencesService) { }
	// Récupérer la date de début du calendrier et la formatter

	dateDebut: NgbDateStruct;

	get dateAfficherModal() {
		return new Date(this.dateDebut.year, this.dateDebut.month, this.dateDebut.day);
	}

	open(content) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
			this.closeResult = ` `; // Affiche la phrase si résultat ok. On peut récupérer le result en le mettant dans la phrase
		}, (reason) => {
			this.closeResult = `${this.getDismissReason(reason)}`; // Affiche la phrase si la personne a quitté
		});
	}

	private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'Touche Echap';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'Touche retour';
		} else {
			return ` `; // mettre ${reason} si vous voulez afficher la raison
		}
	}
	// Pour récupérer les informations du form et les basculer vers le back
	// /!\ au format de date qui sort du calendrier!!
	submit(demande) {

		this._serviceGestionAbsence.modifDemandeAbsence(demande)
			.subscribe(
				() => {
					this.messageSucces = 'Votre Modification d\'absence a été enregistrée avec succès';
					setTimeout(
						() => this.messageSucces = undefined,
						7000
					);
					this.quitterModifModal();
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


	// Pour basculer en mode édition
	afficherModification() {
		this.edition = true;
	}


	// Fonction pour fermer la modal

	quitterModifModal(){
		this.modalService.dismissAll(ModifDemandeAbsenceComponent);
	  }

}
