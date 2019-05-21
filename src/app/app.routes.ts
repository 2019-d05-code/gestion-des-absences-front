import { Routes } from '@angular/router';
import { StatutConnecteService } from './auth/statut-connecte.service';
import { AuthComponent } from './auth/auth.component';
import { AccueilComponent } from './accueil/accueil.component';
import { ValidationDemandesComponent } from './validation-demandes/validation-demandes.component';
import { ManagerVueDptCollabComponent } from './manager-vue-dpt-collab/manager-vue-dpt-collab.component';
import { JourFerieVisuComponent } from './jour-ferie-visu/jour-ferie-visu.component';



export const routes: Routes = [
	{ path:'accueil', component: AccueilComponent, canActivate:[StatutConnecteService] },
	{ path:'gestion-absences', component: ValidationDemandesComponent},
	{ path:'planning-absences', component: ManagerVueDptCollabComponent},
	{ path:'jour-feries', component: JourFerieVisuComponent},
	{ path:'auth', component: AuthComponent},


	{ path: '', redirectTo: '/accueil', pathMatch: 'full'}
  ];


