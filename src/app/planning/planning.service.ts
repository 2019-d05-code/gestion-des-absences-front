import { Observable } from 'rxjs';
import { DemandeAbsence } from '../models/DemandeAbsence';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

export class PlanningService {

	constructor(private _http: HttpClient) {
	}

	getListeAbsences(): Observable<DemandeAbsence[]> {

		return this._http.get<DemandeAbsence[]>(`${environment.baseUrl}/${environment.apiListeAbsences}`);
	}
}
