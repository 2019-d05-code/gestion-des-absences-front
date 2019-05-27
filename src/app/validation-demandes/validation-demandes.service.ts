import { Injectable } from '@angular/core';
import { Collegue } from '../auth/auth.domains';
import { Subject, Observable } from 'rxjs';
import { DemandeAbsence } from '../models/DemandeAbsence';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { map } from 'rxjs/operators';
import { DemandeAbsenceValidation } from '../models/DemandeAbsenceValidation';

@Injectable({
	providedIn: 'root'
})
export class ValidationDemandeService {
	messageSucces: string;
	messageErreur: string;
	collegueConnecte: Collegue;
	subject = new Subject<DemandeAbsence>();

	URL_BACKEND = `${environment.baseUrl}/manager`;

	constructor(private _http: HttpClient, private _serviceAuthService: AuthService) { }

	// récupérer liste demandes en attente validation pour tout les collègues
	getListeAbsencesAttenteValidation(email: string): Observable<DemandeAbsence[]> {
		let url: string = `${environment.baseUrl}/manager/${environment.apiListeAbsencesValidation}${this.collegueConnecte.email}`;
		console.log(url);
		return this._http.get<any[]>(url).pipe(
			map(listDemandesServ => {
				return listDemandesServ.map(
					uneDemande => {
						const uneDemandeCoteClient = new DemandeAbsenceValidation(
							uneDemande.prenom,
							uneDemande.nom,
							new Date(uneDemande.dateDebut),
							new Date(uneDemande.dateFin),
							uneDemande.type,
							uneDemande.status,
							uneDemande.motif,
							uneDemande.id
						);
						console.log(uneDemande);
						return uneDemandeCoteClient;
					}
				);
			})
		);
	}

	envoieValiderDemande(demande: DemandeAbsenceValidation): Observable<String> {

		return this._http.patch<string>(`${this.URL_BACKEND}${demande.id}`, {}, { withCredentials: true });

	}

	envoieInvaliderDemande(demande: DemandeAbsenceValidation): Observable<String> {

		return this._http.patch<string>(`${this.URL_BACKEND}${demande.id}`, {}, { withCredentials: true });

	}

	// récupérer le collegue connecté à l'initialisation
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
