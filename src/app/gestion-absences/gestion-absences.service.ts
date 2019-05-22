import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { DemandeAbsence } from '../models/DemandeAbsence';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class GestionAbsencesService {

	URL_BACKEND = `${environment.baseUrl}/gestion-absences`;

	constructor(private _http: HttpClient) { }

	ajouterDemandeAbsence(demande: DemandeAbsence): Observable<String> {

		return this._http.post<string>(this.URL_BACKEND, demande, {withCredentials: true});

	}

}
