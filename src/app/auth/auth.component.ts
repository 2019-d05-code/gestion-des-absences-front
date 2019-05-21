import { Component, OnInit } from '@angular/core';
import { Collegue } from "./auth.domains";
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";

/**
 * Formulaire d'authentification.
 */
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styles: ['./auth.component.css']
})
export class AuthComponent implements OnInit {


  collegue: Collegue = new Collegue({});
  err: boolean;

  constructor(private _authSrv: AuthService, private _router: Router) { }

  ngOnInit() {
  }

  connecter() {
    this._authSrv.connecter(this.collegue.email, this.collegue.motDePasse)
      .subscribe(
        // en cas de succès, redirection vers la page d'accueil
        // TODO
        col => this._router.navigate(['/tech']),

        // on utilise pas l'erreur (pour l'instant)
        () => this.err = true
      );
  }

  deconnecter() {
    this._authSrv.seDeconnecter()
      .subscribe(
        // en cas de succès, redirection vers la page d'accueil
        // TODO
        col => this._router.navigate(['/tech']),

		// on utilise pas l'erreur (pour l'instant)
        () => this.err = true
      );
  }

}
