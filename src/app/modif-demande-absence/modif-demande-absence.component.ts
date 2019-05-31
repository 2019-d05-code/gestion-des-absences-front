import { Component, OnInit, Injectable } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerI18n, NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { DemandeAbsence } from '../models/DemandeAbsence';
import { GestionAbsencesService } from '../gestion-absences/gestion-absences.service';


const I18N_VALUES = {
	'fr': {
		weekdays: ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'],
		months: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aou', 'Sep', 'Oct', 'Nov', 'Déc'],
	}
};

// Define a service holding the language. You probably already have one if your app is i18ned. Or you could also
// use the Angular LOCALE_ID value
@Injectable()
export class I18n {
	language = 'fr';
}

// Define custom service providing the months and weekdays translations
@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {

	constructor(private _i18n: I18n) {
		super();
	}

	getWeekdayShortName(weekday: number): string {
		return I18N_VALUES[this._i18n.language].weekdays[weekday - 1];
	}
	getMonthShortName(month: number): string {
		return I18N_VALUES[this._i18n.language].months[month - 1];
	}
	getMonthFullName(month: number): string {
		return this.getMonthShortName(month);
	}

	getDayAriaLabel(date: NgbDateStruct): string {
		return `${date.year}/${date.month}/${date.day}`;
	}
}

function padNumber(value: number) {
	if (isNumber(value)) {
		return `0${value}`.slice(-2);
	} else {
		return "";
	}
}

function isNumber(value: any): boolean {
	return !isNaN(toInteger(value));
}

function toInteger(value: any): number {
	return parseInt(`${value}`, 10);
}

@Injectable()
export class NgbDateFRParserFormatter extends NgbDateParserFormatter {
	parse(value: string): NgbDateStruct {
		if (value) {
			const dateParts = value.trim().split('/');
			if (dateParts.length === 1 && isNumber(dateParts[0])) {
				return { year: toInteger(dateParts[0]), month: null, day: null };
			} else if (dateParts.length === 2 && isNumber(dateParts[0]) && isNumber(dateParts[1])) {
				return { year: toInteger(dateParts[1]), month: toInteger(dateParts[0]), day: null };
			} else if (dateParts.length === 3 && isNumber(dateParts[0]) && isNumber(dateParts[1]) && isNumber(dateParts[2])) {
				return { year: toInteger(dateParts[2]), month: toInteger(dateParts[1]), day: toInteger(dateParts[0]) };
			}
		}
		return null;
	}

	format(date: NgbDateStruct): string {
		let stringDate: string = '';
		if (date) {
			stringDate += isNumber(date.day) ? padNumber(date.day) + '/' : '';
			stringDate += isNumber(date.month) ? padNumber(date.month) + '/' : '';
			stringDate += date.year;
		}
		return stringDate;
	}
}


@Component({
	selector: 'app-modif-demande-absence',
	templateUrl: './modif-demande-absence.component.html',
	styleUrls:['./modif-demande.css'],
	providers: [I18n, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
		{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]

})

export class ModifDemandeAbsenceComponent implements OnInit {
	model: NgbDateStruct;



	// Boolean pour afficher les bouton basculer en mode édition ou valider
	edition = false;

	// création de la demande pour mettre dans le formulaire, qui sera récupérée après

	demandeModal: DemandeAbsence;

	messageErreur: string;
	messageSucces: string;
	collegueConnecte: any;


	isDisabled = (date: NgbDate, current: { month: number }) => date.month !== current.month;
	isWeekend = (date: NgbDate) => this.calendar.getWeekday(date) >= 6;

	ngOnInit() {

	}

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

	quitterModifModal() {
		this.modalService.dismissAll(ModifDemandeAbsenceComponent);
	}

}
