import { Component, OnInit } from '@angular/core';
import {Collegue} from "./auth.domains";
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";

/**
 * Formulaire d'authentification.
 */
@Component({
  selector: 'app-auth',
  template: `

    <mdb-card class="animated zoomIn">
      <mdb-card-header class="primary-color white-text">
        <h4 class="text-center">Authentification</h4>
      </mdb-card-header>
      <mdb-card-body>
        <mdb-card>
          <mdb-card-body>
            <mdb-card-title>
              <h4>Utilisateurs</h4>
            </mdb-card-title>
            <mdb-card-text>
              Deux utilisateurs sont créés par défaut :
              <ul>
                <li>admin@dev.fr / superpass / ROLE_ADMINISTRATEUR, ROLE_UTILISATEUR</li>
                <li>user@dev.fr / superpass / ROLE_UTILISATEUR</li>
              </ul>
              
            </mdb-card-text>
            
          </mdb-card-body>
        </mdb-card>
        <form>
          <div class="md-form">
            <i class="fa fa-envelope prefix grey-text"></i>
            <input type="text" [validateSuccess]="false" data-error="Une adresse email est requise" id="defaultForm-email" class="form-control" name="email" mdbInputDirective [(ngModel)]="collegue.email" required>
            <label for="defaultForm-email">Email</label>
          </div>

          <div class="md-form">
            <i class="fa fa-lock prefix grey-text"></i>
            <input type="password" id="defaultForm-pass" [validateSuccess]="false"  data-error="Un mot de passe est requis" name="motDePasse" class="form-control" mdbInputDirective [(ngModel)]="collegue.motDePasse" required>
            <label for="defaultForm-pass">Mot de passe</label>
          </div>

          <div class="text-center">
            <input type="submit" mdbBtn color="primary" sclass="waves-light" mdbWavesEffect value="Se connecter" (click)="connecter()">
          </div>
          <div *ngIf="err" class="text-danger">
            Oops, les informations saisies ne permettent pas de vous authentifier.
          </div>
        </form>
      </mdb-card-body>
    </mdb-card>
    
  `,
  styles: []
})
export class AuthComponent implements OnInit {


  collegue:Collegue = new Collegue({});
  err:boolean;

  constructor(private _authSrv:AuthService, private _router:Router) { }

  ngOnInit() {
  }

  connecter() {
    this._authSrv.connecter(this.collegue.email, this.collegue.motDePasse)
      .subscribe(
        // en cas de succès, redirection vers la page /tech
        col => this._router.navigate(['/tech']),

        // en cas d'erreur, affichage d'un message d'erreur
        err =>this.err = true
      );
  }

}
