import { Component, OnInit } from '@angular/core';
import { DemandeAbsence } from '../models/DemandeAbsence';
import { NgbModal, NgbDateStruct, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ModifDemandeAbsenceComponent } from '../modif-demande-absence/modif-demande-absence.component';
import { GestionAbsencesService } from '../gestion-absences/gestion-absences.service';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';
import { Collegue } from '../auth/auth.domains';

@Component({
	selector: 'app-visu-demande-absence',
	templateUrl: './visu-demande-absence.component.html',
})
export class VisuDemandeAbsenceComponent implements OnInit {
	// récupération de la demande passée par la modal
	demandeModal: DemandeAbsence;

	closeResult: string;
	constructor(private modalService: NgbModal, private _gestionAbsencesSrv:
		GestionAbsencesService, private _serviceAuthService: AuthService) { }


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


	// Fonction pour fermer la modal
	quitterModifModal() {
		this.modalService.dismissAll(ModifDemandeAbsenceComponent);
	}
}
