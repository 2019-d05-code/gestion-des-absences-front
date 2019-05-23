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
import { addYears, subYears, startOfDay, addDays, endOfDay } from 'date-fns';
import { DemandeAbsence } from '../models/DemandeAbsence';
import { Observable, of } from 'rxjs';
import { GestionAbsencesService } from '../gestion-absences/gestion-absences.service';
import { AuthService } from '../auth/auth.service';
import { Collegue } from '../auth/auth.domains';
import { map, catchError } from 'rxjs/operators';
import { TypeDemande } from '../models/TypeDemande';


// couleurs du calendrier
const colors: any = {
	red: {
		primary: '#ad2121',
		secondary: '#FAE3E3'
	},
	blue: {
		primary: '#1e90ff',
		secondary: '#D1E8FF'
	},
	yellow: {
		primary: '#e3bc08',
		secondary: '#FDF1BA'
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

	constructor(private _authSrv: AuthService, private _srv: GestionAbsencesService, private _changeRef: ChangeDetectorRef) {
		this._authSrv.collegueConnecteObs
			.subscribe(
				collegue => {
					this.collegue = collegue;
				}
			);
		console.log(this.collegue.email);
	}

	view: CalendarView = CalendarView.Month;
	viewDate = new Date();

	evenement: CalendarEvent = {
		start: startOfDay(new Date()),
		end: addDays(new Date(), 5),
		title: `Evenememnt bateau au cas où il y a zéro évènements :p`,
	};

	events: Observable<CalendarEvent[]>;
	collegue: Collegue = new Collegue({});



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

		this.events = this._srv.getListeAbsencesValidees(this.collegue.email)
			.pipe(
				map(
					demTab => demTab.map(demande => {
						//on implémente les oculeurs en fonction du type d'absence
						let couleur = colors.yellow;
						if (demande.type.toString() === 'RTT') {
							couleur = colors.red;
						} else if (demande.type.toString() === 'CONGES_PAYES') {
							couleur = colors.blue;
						}

						return <CalendarEvent>{
							start: startOfDay(demande.dateDebut),
							end: endOfDay(demande.dateFin),
							title: `${demande.type} - motif : ${demande.motif}`,
							color: couleur,
						};

					})
				),
				catchError(error => {
					console.log(error.error);
					if (error.message === 'Http failure response for http://localhost:8080/listeAbsences: 404 OK') {
						this.messageErreur = `Pas d'absences disponible`;
					} else {
						this.messageErreur = error.message;
					}
					setTimeout(
						() => this.messageErreur = undefined,
						7000
					);
					return of([]);
				})
			)
		/*
				this._srv.getListeAbsences(this.collegue.email).subscribe(
					demTab => {


						demTab.forEach(demande => {
							let evenement2 = {
								start: startOfDay(demande.dateDebut),
								end: addDays(demande.dateDebut, 2),
								title: `evenement indépendant`
							};
							this.events.push(evenement2);
							console.log(this.events);


						});

						//this._changeRef.detectChanges();

					},
					error => {
						console.log(error.error);
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
		*/
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
