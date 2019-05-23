import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, ModalDismissReasons, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DemandeAbsence } from '../models/DemandeAbsence';

@Component({
	selector: 'app-modif-demande-absence',
	templateUrl: './modif-demande-absence.component.html',
	styles: []
})

export class ModifDemandeAbsenceComponent implements OnInit {
	// Boolean pour afficher les bouton basculer en mode édition ou valider
	edition = false;

	// création de la demande pour mettre dans le formulaire, qui sera récupérée après

	demande: DemandeAbsence = new DemandeAbsence(undefined, undefined, undefined);

	ngOnInit() {	console.log(this.demande.dateDebut);
	}

	closeResult: string;

	constructor(private modalService: NgbModal) { }

	// Récupérer la date de début du calendrier et la formatter
	dateDebut: NgbDateStruct;
	get dateAfficherModal() {
		return new Date(this.dateDebut.year, this.dateDebut.month, this.dateDebut.day);
	}

	open(content, demande) {
		this.demande = demande;
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
	submit() {
	}

	// Pour basculer en mode édition
	afficherModification() {
		this.edition = true;
	}


	// Fonction pour quand un collègue est demandé
	submitDemande() { }

	// Fonction pour fermer la modal
	quitterModifModal(){
		this.modalService.dismissAll(ModifDemandeAbsenceComponent);
	}

}

