import { Absences } from './Absences';

export class Rapport {

	constructor(
		public joursWeekEnd: number[],
		public listeAbsences: Absences[]
		) { }

}
