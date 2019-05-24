import { Routes } from '@angular/router';
import { StatutConnecteService } from './auth/statut-connecte.service';
import { AuthComponent } from './auth/auth.component';
import { AccueilComponent } from './accueil/accueil.component';
import { ValidationDemandesComponent } from './validation-demandes/validation-demandes.component';
import { JourFerieVisuComponent } from './jour-ferie-visu/jour-ferie-visu.component';
import { ManagerVueSynthetiqueComponent } from './manager-vue-synthetique/manager-vue-synthetique.component';
import { PlanningComponent } from './planning/planning.component';
import { GestionAbsencesComponent } from './gestion-absences/gestion-absences.component';
import { CreerDemandeAbsenceComponent } from './creer-demande-absence/creer-demande-absence.component';
import { VisuDemandeAbsenceComponent } from './visu-demande-absence/visu-demande-absence.component';
import { ModifDemandeAbsenceComponent } from './modif-demande-absence/modif-demande-absence.component';
import { SuppressionDemandeAbsenceComponent } from './suppression-demande-absence/suppression-demande-absence.component';



export const routes: Routes = [
	{ path:'accueil', component: AccueilComponent, canActivate:[StatutConnecteService] },
	{ path:'gestion-absences', component: GestionAbsencesComponent, canActivate:[StatutConnecteService]},
	{ path:'planning-absences', component: PlanningComponent, canActivate:[StatutConnecteService]},
	{ path:'validation-demandes', component: ValidationDemandesComponent, canActivate:[StatutConnecteService]},
	{ path:'vues-synthetiques', component: ManagerVueSynthetiqueComponent, canActivate:[StatutConnecteService]},
	{ path:'jour-feries', component: JourFerieVisuComponent, canActivate:[StatutConnecteService]},
	{ path:'demande-absence', component: CreerDemandeAbsenceComponent, canActivate:[StatutConnecteService]},
	{ path:'visu-absence', component: VisuDemandeAbsenceComponent, canActivate:[StatutConnecteService]},
	{ path:'modif-absence/', component: ModifDemandeAbsenceComponent, canActivate:[StatutConnecteService]},
	{ path:'suppression-absence', component: SuppressionDemandeAbsenceComponent, canActivate:[StatutConnecteService]},


	{ path:'connexion', component: AuthComponent},


	{ path: '', redirectTo: '/accueil', pathMatch: 'full'}
  ];


