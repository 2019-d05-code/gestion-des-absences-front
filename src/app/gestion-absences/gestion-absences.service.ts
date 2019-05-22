import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { DemandeAbsence } from '../models/DemandeAbsence';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Collegue } from '../auth/auth.domains';

@Injectable({
	providedIn: 'root'
})
export class GestionAbsencesService {
	messageSucces: string;
	messageErreur: string;
	collegueConnecte: Collegue;

	URL_BACKEND = `${environment.baseUrl}/gestion-absences`;

	constructor(private _http: HttpClient, private _serviceAuthService: AuthService) { }

	ajouterDemandeAbsence(demande: DemandeAbsence): Observable<String> {

		return this._http.post<string>(this.URL_BACKEND, demande, { withCredentials: true });

	}

	getListeAbsences(): Observable<DemandeAbsence[]> {
		return this._http.get<DemandeAbsence[]>(`${environment.baseUrl}/${environment.apiListeAbsences}${this.collegueConnecte.email}`);
	}

	ngOnInit() {
		this._serviceAuthService.collegueConnecteObs.subscribe(
			collegue => this.collegueConnecte = collegue,
			error => {
				this.messageErreur = error.error;
				setTimeout(
					() => this.messageErreur = undefined,
					7000
				);
			}
		);
	}

}
