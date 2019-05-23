import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Collegue } from '../auth/auth.domains';
import { MatMenuTrigger } from '@angular/material';

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html'
})
export class MenuComponent implements OnInit {

	collegueConnecte: Collegue;
	@Input() connecte: boolean;
	roleManager: string[];

	// Gestion du menu responsive
	@ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

	constructor(private _authSrv: AuthService) { }

	verifRoleManager(): boolean {

		if (this.connecte) {

			let granted = false;

			const roleManager = this.collegueConnecte.roles.filter(role => role === 'ROLE_MANAGER');

			if (roleManager.length > 0) {
				granted = true;
			}

			return granted;
		}

	}

	menu() {
		this.trigger.openMenu();
	}

	ngOnInit() {
		this._authSrv.collegueConnecteObs
			.subscribe(
				collegue => {
					this.collegueConnecte = collegue;
					if (this.collegueConnecte.estAnonyme()) {
						this.connecte = false;
					} else {
						this.connecte = true;
					}
				},
				() => this.connecte = false
			);

	}

}
