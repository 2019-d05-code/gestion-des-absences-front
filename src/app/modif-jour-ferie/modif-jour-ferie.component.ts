import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { JourFerie } from '../models/JourFerie';
import { NgbModal, NgbCalendar, ModalDismissReasons, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { GestionAbsencesService } from '../gestion-absences/gestion-absences.service';

@Component({
	selector: 'app-modif-jour-ferie',
	templateUrl: 'modif-jour-ferie.component.html',
	styleUrls: ['modif-jour-ferie.component.css'],
	encapsulation: ViewEncapsulation.ShadowDom
})
export class ModifJourFerieComponent implements OnInit {

	edition = false;
	jourFerieModal: JourFerie;
	messageErreur: string;
	messageSucces: string;

	closeResult: string;
	constructor(private modalService: NgbModal, private _serviceGestionAbsence: GestionAbsencesService,
		private calendar: NgbCalendar) { }
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

	ngOnInit() {
	}

	submit() {

	}

	// Pour basculer en mode édition
	afficherModification() {
		this.edition = true;
	}


	// Fonction pour fermer la modal

	quitterModifModal() {
		this.modalService.dismissAll(ModifJourFerieComponent);
	}
}
