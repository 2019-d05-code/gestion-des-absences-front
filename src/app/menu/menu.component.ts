import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';
import { Collegue } from '../auth/auth.domains';
import { Router } from '@angular/router';

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styles: []
})
export class MenuComponent implements OnInit {

	collegueConnecte: Observable<Collegue>;
	constructor(private _authSrv: AuthService, private _router: Router) {

	}

	ngOnInit() {
		this.collegueConnecte = this._authSrv.collegueConnecteObs;

	}

}
