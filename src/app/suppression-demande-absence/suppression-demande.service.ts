import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { DemandeAbsence } from '../models/DemandeAbsence';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class SuppressionDemandeService {

	URL_BACKEND = `${environment.baseUrl}/gestion-absences`;

	constructor(private _http: HttpClient) { }

	supprimerDemandeAbsence(demande: DemandeAbsence): Observable<String> {

		return this._http.delete<string>(`${this.URL_BACKEND}/supprimer/${demande.id}`,
		{ withCredentials: true }
		);

	}
}
