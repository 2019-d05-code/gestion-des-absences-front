import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { JourFerie } from '../models/JourFerie';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class JourFerieService {

	URL_BACKEND = `${environment.baseUrl}/gestion-absences/absence-collective`;

	constructor(private _http: HttpClient) { }

	recupListeAbsenceCollectives(annee: number): Observable<JourFerie[]> {
		return this._http.get<JourFerie[]>(`${this.URL_BACKEND}?annee=${annee}`, { withCredentials: true });
	}

	ajoutAbsenceCollective(absence: JourFerie): Observable<string> {
		return this._http.post<string>(`${this.URL_BACKEND}`, {
			date: absence.date,
			commentaire: absence.commentaire,
			type: absence.type
		}, { withCredentials: true });
	}

	modifierAbsenceCollective(absence: JourFerie): Observable<string> {
		return this._http.patch<string>(`${this.URL_BACKEND}/${absence.id}`, {
			id: absence.id,
			date: absence.date,
			commentaire: absence.commentaire,
			type: absence.type
		}, { withCredentials: true });
	}

	supprimerAbsenceCollective(id: number): Observable<string> {
		return this._http.patch<string>(`${this.URL_BACKEND}/${id}`, { withCredentials: true });
	}

}
