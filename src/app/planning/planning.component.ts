import {
	Component,
	ChangeDetectionStrategy,
	OnInit,
	ChangeDetectorRef,
} from '@angular/core';
import {
	CalendarDateFormatter,
	CalendarEvent,
	CalendarView,
	DAYS_OF_WEEK
} from 'angular-calendar';
import { CustomDateFormatter } from './custom-date-formatter.provider';
import { addYears, subYears, startOfDay, addDays } from 'date-fns';
import { DemandeAbsence } from '../models/DemandeAbsence';
import { Observable } from 'rxjs';
import { GestionAbsencesService } from '../gestion-absences/gestion-absences.service';


// couleurs du calendrier
const colors: any = {
	red: {
		primary: '#ad2121',
		secondary: '#FAE3E3'
	}
};

@Component({
	selector: 'app-planning',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './planning.component.html',
	styleUrls: ['./planning.component.css'],
	providers: [
		{
			provide: CalendarDateFormatter,
			useClass: CustomDateFormatter
		}
	]
})
export class PlanningComponent {

	constructor(private _srv: GestionAbsencesService, private _changeRef: ChangeDetectorRef) { }

	view: CalendarView = CalendarView.Month;
	viewDate = new Date();

	events: CalendarEvent[] = [];

	evenement: CalendarEvent = {
		start: startOfDay(new Date()),
		end: addDays(new Date(), 2),
		title: `Evenememnt bateau au cas où il y a zéro événèements :p`,
		color: colors.red,
		allDay: true,
	};

	locale = 'fr';
	weekStartsOn: number = DAYS_OF_WEEK.MONDAY;
	weekendDays: number[] = [DAYS_OF_WEEK.FRIDAY, DAYS_OF_WEEK.SATURDAY];
	CalendarView = CalendarView;

	// Création des tableaux de demande
	listeDemandes: DemandeAbsence[] = new Array();
	demandeTab: Observable<DemandeAbsence[]>;

	// String pour les messages d'erreur
	messageSucces: string;
	messageErreur: string;

	// A l'initialisation, on récupère la liste des absences depuis le back
	ngOnInit(): void {
		this.demandeTab = this._srv.getListeAbsences();
		this.demandeTab.subscribe(
			demTab => {
				demTab.map(demande => {
					this.evenement.start = demande.dateDebut;
					this.evenement.end = demande.dateFin;
					this.events.push(this.evenement);
				});
			},
			error => {
				if (error.message === 'Http failure response for http://localhost:8080/listeAbsences: 404 OK') {
					this.messageErreur = `Pas d'absences disponible`;
				} else {
					this.messageErreur = error.message;
				}
				this._changeRef.detectChanges();
				setTimeout(
					() => this.messageErreur = undefined,
					7000
				);
			}
		);
	}

	setView(view: CalendarView) {
		this.view = view;
	}

	anneeSuivante() {
		this.viewDate = addYears(this.viewDate, 1);
	}

	anneePrecedente() {
		this.viewDate = subYears(this.viewDate, 1);
	}



}
