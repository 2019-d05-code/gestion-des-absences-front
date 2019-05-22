import {
	Component,
	ChangeDetectionStrategy,
	OnInit,
} from '@angular/core';
import {
	CalendarDateFormatter,
	CalendarEvent,
	CalendarView,
	DAYS_OF_WEEK
} from 'angular-calendar';
import { CustomDateFormatter } from './custom-date-formatter.provider';
import { addYears, subYears, startOfDay, addDays } from 'date-fns';
import { PlanningService } from './planning.service';
import { DemandeAbsence } from '../models/DemandeAbsence';
import { Observable } from 'rxjs';

// couleurs du calendrier
const colors: any = {
	red: {
		primary: '#ad2121',
		secondary: '#FAE3E3'
	}
}

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

	constructor(private _srv: PlanningService) { }

	view: CalendarView = CalendarView.Month;
	viewDate = new Date();

	events: CalendarEvent[] = [
		{
			start: startOfDay(new Date()),
			end: addDays(new Date(), 2),
			title: `Evenememnt de 3 jours qui commence aujourd'hui`,
			color: colors.red,
			allDay: true,
		},
	];

	locale = 'fr';
	weekStartsOn: number = DAYS_OF_WEEK.MONDAY;
	weekendDays: number[] = [DAYS_OF_WEEK.FRIDAY, DAYS_OF_WEEK.SATURDAY];
	CalendarView = CalendarView;

	//Création des tableaux de demande
	listeDemandes: DemandeAbsence[] = new Array();
	demandeTab: Observable<DemandeAbsence[]>;

	// A l'initialisation, on récupère la liste des absences depuis le back
	ngOnInit(): void {
		this.demandeTab = this._srv.getListeAbsences()
		this.demandeTab.subscribe(demandeTab => this.listeDemandes = demandeTab);
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
