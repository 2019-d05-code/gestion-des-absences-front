import { Routes } from '@angular/router';
import { StatutConnecteService } from './auth/statut-connecte.service';
import { AuthComponent } from './auth/auth.component';
import { AccueilComponent } from './accueil/accueil.component';


export const routes: Routes = [
	{ path:'accueil', component: AccueilComponent, canActivate:[StatutConnecteService] },
	{ path:'auth', component: AuthComponent},
	{ path: '', redirectTo: '/accueil', pathMatch: 'full'}
  ];


