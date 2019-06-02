export class Absences {

	constructor(
		public nomCollegue: string,
		public prenomCollegue: string,

		public joursRTT?: number[],
		public joursCP?: number[],
		public joursCSS?: number[],
		public joursMISSIONS?: number[]
	) { }


}
