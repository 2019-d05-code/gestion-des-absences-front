import { Component, OnInit, ViewEncapsulation, Injectable } from '@angular/core';
import { JourFerie } from '../models/JourFerie';
import { NgbModal, NgbCalendar, ModalDismissReasons, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerI18n, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { GestionAbsencesService } from '../gestion-absences/gestion-absences.service';
import { JourFerieService } from '../jour-ferie-visu/jour-ferie.service';

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
	selector: 'app-modif-jour-ferie',
	templateUrl: 'modif-jour-ferie.component.html',
	styleUrls: ['modif-jour-ferie.component.css'],
	providers: [I18n, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
		{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]

})
export class ModifJourFerieComponent implements OnInit {
	model: NgbDateStruct;

	edition = false;
	jourFerieModal: JourFerie;
	messageErreur: string;
	messageSucces: string;

	closeResult: string;
	constructor(private modalService: NgbModal,
		private calendar: NgbCalendar, private _serviceJourFerie: JourFerieService) { }
	// Récupérer la date de début du calendrier et la formatter

	dateDebut: NgbDateStruct;
	dateDebutModif: any;

	get dateAfficherModal() {
		return new Date(this.dateDebut.year, this.dateDebut.month, this.dateDebut.day);
	}

	isDisabled = (date: NgbDate, current: { month: number }) => date.month !== current.month;
	isWeekend = (date: NgbDate) => this.calendar.getWeekday(date) >= 6;

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
		const erreurModal = this.jourFerieModal;
		this.jourFerieModal.date = new Date(this.dateDebutModif.year, (this.dateDebutModif.month - 1), (this.dateDebutModif.day + 1));
		this._serviceJourFerie.modifierAbsenceCollective(this.jourFerieModal)
			.subscribe(
				() => {
					this.messageSucces = 'Modification enregistrée avec succès';
					setTimeout(
						() => this.messageSucces = undefined,
						7000
					);
					this.quitterModifModal();
				},
				error => {
					this.jourFerieModal = erreurModal;
					this.messageErreur = error.error;
					this.dateDebutModif.
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
		this.modalService.dismissAll(ModifJourFerieComponent);
	}
}
