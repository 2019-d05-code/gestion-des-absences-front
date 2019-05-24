import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbDateStruct, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DemandeAbsence } from '../models/DemandeAbsence';
import { Observable } from 'rxjs';
import { Collegue } from '../auth/auth.domains';
import { GestionAbsencesService } from '../gestion-absences/gestion-absences.service';
import { AuthService } from '../auth/auth.service';
import { ModifDemandeAbsenceComponent } from '../modif-demande-absence/modif-demande-absence.component';

@Component({
  selector: 'app-suppression-demande-absence',
  templateUrl: `./suppression-demande-absence.component.html`,
  styles: []
})
export class SuppressionDemandeAbsenceComponent implements OnInit {
	edition = false;
	tabDemandes: DemandeAbsence[] = [];
	observableDemandes: Observable<DemandeAbsence[]>;
	collegueConnecte: Collegue;
	messageErreur: string;

	// création de la demande pour mettre dans le formulaire, qui sera récupérée après

	demande: DemandeAbsence = new DemandeAbsence(undefined, undefined, undefined);

	closeResult: string;
	constructor(private modalService: NgbModal, private _gestionAbsencesSrv:
		GestionAbsencesService, private _serviceAuthService: AuthService) { }
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

		// Ensuite on récupère les absences associées
		this.observableDemandes = this._gestionAbsencesSrv.getListeAbsences(this.collegueConnecte.email);
		this.observableDemandes.subscribe(demande => this.tabDemandes = demande,
			error => {
				console.log(error.message);
			});
	}

	submit() {
	}

	// Pour basculer en mode édition
	afficherModification() {
		this.edition = true;
	}


	// Fonction pour quand un collègue est demandé
	submitDemande() { }

	// Fonction pour fermer la modal
	quitterModifModal() {
		this.modalService.dismissAll(ModifDemandeAbsenceComponent);
	}
}
