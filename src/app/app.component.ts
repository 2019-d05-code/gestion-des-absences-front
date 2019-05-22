import { Component, OnInit } from '@angular/core';
import { AuthService } from "./auth/auth.service";
import { Collegue } from "./auth/auth.domains";
import { Router } from '@angular/router';

/**
 * Composant principal de l'application.
 */
@Component({
	selector: 'app-root',
	templateUrl: `./app.component.html`
})
export class AppComponent implements OnInit {

	user: Collegue;
	messageErreur: string;

	constructor(private _serviceAuth: AuthService, private router: Router) {

	}

	deconnexion(): void {
		this._serviceAuth.seDeconnecter().subscribe(
			() => {
				this.user = null;
			},
			error => {
				this.messageErreur = error.error;
				setTimeout(
					() => this.messageErreur = undefined,
					7000
				);
			}
		);
		this.router.navigate(['/connexion']);
	}

	ngOnInit(): void {
		this._serviceAuth.collegueConnecteObs.subscribe(
			collegue => this.user = collegue,
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
