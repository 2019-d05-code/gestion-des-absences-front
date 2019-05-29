import { Component, OnInit, Input } from '@angular/core';
import { Collegue } from '../auth/auth.domains';
import { AuthService } from '../auth/auth.service';

@Component({
selector: 'app-manager-vue-synthetique',
templateUrl: './manager-vue-synthetique.component.html',
})
export class ManagerVueSynthetiqueComponent implements OnInit {
	collegueConnecte: Collegue;
	@Input() connecte: boolean;
	roleManager: string[];


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
