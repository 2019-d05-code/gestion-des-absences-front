import { Observable } from 'rxjs';
import { DemandeAbsence } from '../models/DemandeAbsence';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class PlanningService {

	constructor(private _http: HttpClient) {
	}

	getListeAbsences(): Observable<DemandeAbsence[]> {

		return this._http.get<DemandeAbsence[]>(`${environment.baseUrl}/${environment.apiListeAbsences}`);
	}
}
