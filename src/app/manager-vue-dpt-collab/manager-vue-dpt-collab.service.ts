import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Rapport } from '../models/Rapport';
import { map } from 'rxjs/operators';
import { SelectionManager } from '../models/SelectionManager';

@Injectable({
	providedIn: 'root'
})
export class ManagerVueDptCollabService {

	URL_BACKEND = `${environment.baseUrl}/manager`;

	constructor(private _http: HttpClient) { }

	// Service pour récupérer la liste de toutes les absences confondues
	postRapport(selection: SelectionManager): Observable<Rapport> {
		const url = `${this.URL_BACKEND}/absencesMoisDpt`;
		console.log(url);
		return this._http.post<Rapport>(url, selection, { withCredentials: true });
	}

}
