import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Departement } from '../models/Departement';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class HistoManagerService {

	URL_BACKEND = `${environment.baseUrl}/manager`;

	constructor(private _http: HttpClient) { }

	public recupDepartements(): Observable<Departement[]> {
		return this._http.get<Departement[]>(`${this.URL_BACKEND}/departements`);
	}

}
