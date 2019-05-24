import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { DemandeAbsence } from '../models/DemandeAbsence';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Collegue } from '../auth/auth.domains';
import { map } from 'rxjs/operators';
import { TypeDemande } from '../models/TypeDemande';

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

	// Service pour récupérer la liste de toutes les absences confondues
	getListeAbsences(email: string): Observable<DemandeAbsence[]> {
		let url: string = `${environment.baseUrl}/gestion-absences/${environment.apiListeAbsences}${email}`;
		console.log(url);
		return this._http.get<any[]>(url).pipe(
			map(listDemandesServ => {
				return listDemandesServ.map(
					uneDemande => {
						const uneDemandeCoteClient = new DemandeAbsence(
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

	// Service pour récupérer la liste de toutes les absences validées
	getListeAbsencesValidees(email: string): Observable<DemandeAbsence[]> {
		let url: string = `${environment.baseUrl}/gestion-absences/${environment.apiListeAbsencesValidees}${email}`;
		console.log(url);
		return this._http.get<any[]>(url).pipe(
			map(listDemandesServ => {
				return listDemandesServ.map(
					uneDemande => {
						const uneDemandeCoteClient = new DemandeAbsence(
							new Date(uneDemande.dateDebut),
							new Date(uneDemande.dateFin),
							uneDemande.type,
							uneDemande.status,
							uneDemande.motif

						);

						return uneDemandeCoteClient;
					}
				)
			})
		);
	}

	ngOnInit() {
		console.log(this.collegueConnecte);
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

		console.log(this.collegueConnecte);
	}

}
