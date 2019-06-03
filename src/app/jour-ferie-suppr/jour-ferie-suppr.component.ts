import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { JourFerie } from '../models/JourFerie';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { JourFerieService } from '../jour-ferie-visu/jour-ferie.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Collegue } from '../auth/auth.domains';

@Component({
	selector: 'app-jour-ferie-suppr',
	templateUrl: `./jour-ferie-suppr.component.html`,
	styleUrls: ['./jour-ferie-suppr.css'],
})
export class JourFerieSupprComponent implements OnInit {
	jourFerieModal: JourFerie;
	messageErreur: string;
	messageSucces: string;



	closeResult: string;
	constructor(private modalService: NgbModal, private _serviceJourFerie: JourFerieService,
		public router: Router) { }

	ngOnInit() {
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

	submit(jourFerieModal) {
		if (confirm('Vous êtes sûr, hein ?')) {
			this._serviceJourFerie.supprimerAbsenceCollective(jourFerieModal.id).subscribe(
				() => {
					this.messageSucces = 'Suppression effectuée';
					setTimeout(
						() => {
							this.messageSucces = undefined;
							location.reload();
							this.quitterModifModal();
						},
						2000
					);
				},
				err => {
					console.log(err.error);
					alert('Oops, il y a eu un problème !');
				}
			);
		}
	}

	// Fonction pour fermer la modal
	quitterModifModal() {
		this.modalService.dismissAll(JourFerieSupprComponent);

	}


}


