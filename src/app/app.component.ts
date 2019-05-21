import { Component, OnInit } from '@angular/core';
import { AuthService } from "./auth/auth.service";
import { Router } from "@angular/router";
import { Observable } from "rxjs/internal/Observable";
import { Collegue } from "./auth/auth.domains";

/**
 * Composant principal de l'application.
 */
@Component({
	selector: 'app-root',
	templateUrl: `./app.component.html`,
	styles: []
})
export class AppComponent implements OnInit {

	constructor() {

	}

	ngOnInit(): void {

	}

}
