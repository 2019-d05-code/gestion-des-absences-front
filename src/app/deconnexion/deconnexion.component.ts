import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Collegue } from '../auth/auth.domains';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-deconnexion',
	template: `
    <p>
      deconnexion works!
    </p>
  `,
	styles: []
})
export class DeconnexionComponent implements OnInit {
	collegueConnecte: Observable<Collegue>;

	constructor(private _authSrv: AuthService, private _router: Router) {

	}

	//Action déconnecter collègue.
	deconnecter() {
		this._authSrv.seDeconnecter().subscribe(
			value => this._router.navigate(['/auth'])
		);
	}

	/**
	 * A l'initialisation, le composant s'abonne au flux du collègue courant connecté.
	 *
	 * Celui lui permet de rester à jour en fonction des connexions et déconnexions.
	 */
	ngOnInit(): void {

		this.collegueConnecte = this._authSrv.collegueConnecteObs;
	}
}
