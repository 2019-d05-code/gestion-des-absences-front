import { Component, OnInit, Injectable } from '@angular/core';
import { DemandeAbsence } from '../models/DemandeAbsence';
import { GestionAbsencesService } from '../gestion-absences/gestion-absences.service';
import { AuthService } from '../auth/auth.service';
import { Collegue } from '../auth/auth.domains';
import { NgbCalendar, NgbDate, NgbDateStruct, NgbDatepickerI18n, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

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
	selector: 'app-creer-demande-absence',
	templateUrl: './creer-demande-absence.component.html',
	styleUrls: ['./creer-demande-absence.css'],
	providers: [I18n, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
		{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class CreerDemandeAbsenceComponent implements OnInit {
	model: NgbDateStruct;

	demande: DemandeAbsence = new DemandeAbsence(undefined, undefined, undefined);
	debutCreer: any;
	finCreer: any;
	messageSucces: string;
	messageErreur: string;
	collegueConnecte: Collegue;

	isDisabled = (date: NgbDate, current: { month: number }) => date.month !== current.month;
	isWeekend = (date: NgbDate) => this.calendar.getWeekday(date) >= 6;
	constructor(private _serviceGestionAbsence: GestionAbsencesService, private _serviceAuthService: AuthService,
		private calendar: NgbCalendar) {
	}

	/*
	* Transmet la demande d'absence vers le back
	*/
	creerDemande() {

		this.demande.email = this.collegueConnecte.email;
		this.demande.dateDebut = new Date(this.debutCreer.year, (this.debutCreer.month - 1), (this.debutCreer.day + 1));
		this.demande.dateFin = new Date(this.finCreer.year, (this.finCreer.month - 1), (this.finCreer.day + 1));
		this._serviceGestionAbsence.ajouterDemandeAbsence(this.demande)
			.subscribe(
				() => {
					this.messageSucces = 'Votre demande d\'absence a été enregistrée avce succès';
					setTimeout(
						() => this.messageSucces = undefined,
						7000
					);
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
	}

}
