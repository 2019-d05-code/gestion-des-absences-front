import {Component, OnInit} from '@angular/core';
import {AuthService} from "./auth/auth.service";
import {Router} from "@angular/router";
import {Observable} from "rxjs/internal/Observable";
import {Collegue} from "./auth/auth.domains";

/**
 * Composant principal de l'application.
 */
@Component({
  selector: 'app-root',
  templateUrl: `./app.component.html`,
  styles: []
})
export class AppComponent implements OnInit {

  collegueConnecte:Observable<Collegue>;

  constructor(private _authSrv:AuthService, private _router:Router) {

  }

  /**
   * Action déconnecter collègue.
   */
  seDeconnecter() {
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
