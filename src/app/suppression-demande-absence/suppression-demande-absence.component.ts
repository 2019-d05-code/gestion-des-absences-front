import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbDateStruct, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DemandeAbsence } from '../models/DemandeAbsence';
import { Observable } from 'rxjs';
import { Collegue } from '../auth/auth.domains';
import { SuppressionDemandeService } from './suppression-demande.service';

@Component({
	selector: 'app-suppression-demande-absence',
	templateUrl: `./suppression-demande-absence.component.html`,
	styles: []
})
export class SuppressionDemandeAbsenceComponent implements OnInit {
	// récupération de la demande passée par la modal
	demandeModal: DemandeAbsence;

	closeResult: string;
	constructor(private modalService: NgbModal, private _suppressionServ: SuppressionDemandeService) { }

	// Récupérer la date de début du calendrier et la formatter
	dateDebut: NgbDateStruct;
	get dateAfficherModal() {
		return new Date(this.dateDebut.year, this.dateDebut.month, this.dateDebut.day);
	}

	open(content) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-suppression' }).result.then((result) => {
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
			return `C'est OKAAAY `; // mettre ${reason} si vous voulez afficher la raison
		}
	}

	ngOnInit() {

	}

	// validation du formulaire
	submit(demande) {
		if (confirm('Vous êtes sûr, hein ?')) {
			this._suppressionServ.supprimerDemandeAbsence(demande).subscribe(
				() => {
					this.quitterModifModal();
				},
				err => {
					alert('Oops, il y a eu un problème !');
				}
			);
		}
	}

	// Fonction pour fermer la modal
	quitterModifModal() {
		this.modalService.dismissAll(SuppressionDemandeAbsenceComponent);
	}
}
