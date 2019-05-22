import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { TechComponent } from './tech/tech.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { AuthComponent } from './auth/auth.component';
import { FormsModule } from "@angular/forms";
import { AuthInterceptorService } from "./auth/auth-interceptor.service";
import { ModifDemandeAbsenceComponent } from './modif-demande-absence/modif-demande-absence.component';
import { AccueilComponent } from './accueil/accueil.component';
import { CreerDemandeAbsenceComponent } from './creer-demande-absence/creer-demande-absence.component';
import { JourFerieCreationComponent } from './jour-ferie-creation/jour-ferie-creation.component';
import { JourFerieModifComponent } from './jour-ferie-modif/jour-ferie-modif.component';
import { JourFerieVisuComponent } from './jour-ferie-visu/jour-ferie-visu.component';
import { ManagerVueDptCollabComponent } from './manager-vue-dpt-collab/manager-vue-dpt-collab.component';
import { ManagerVueHistogrammeComponent } from './manager-vue-histogramme/manager-vue-histogramme.component';
import { ManagerVueSynthetiqueComponent } from './manager-vue-synthetique/manager-vue-synthetique.component';
import { MenuComponent } from './menu/menu.component';
import { PlanningComponent } from './planning/planning.component';
import { ValidationDemandesComponent } from './validation-demandes/validation-demandes.component';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { DeconnexionComponent } from './deconnexion/deconnexion.component';
import { GestionAbsencesComponent } from './gestion-absences/gestion-absences.component';

/** imports pour le calendrier */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import {MatMenuModule, MatMenuTrigger} from '@angular/material';

@NgModule({
	declarations: [
		AppComponent,
		TechComponent,
		AuthComponent,
		AccueilComponent,
		CreerDemandeAbsenceComponent,
		JourFerieCreationComponent,
		JourFerieModifComponent,
		JourFerieVisuComponent,
		ManagerVueDptCollabComponent,
		ManagerVueSynthetiqueComponent,
		ManagerVueHistogrammeComponent,
		MenuComponent,
		PlanningComponent,
		ValidationDemandesComponent,
		ModifDemandeAbsenceComponent,
		DeconnexionComponent,
		GestionAbsencesComponent,
	],
	imports: [
		BrowserModule,
		RouterModule.forRoot(routes),
		HttpClientModule,
		MDBBootstrapModule.forRoot(),
		FormsModule,
		BrowserAnimationsModule,
		CalendarModule.forRoot({
			provide: DateAdapter,
			useFactory: adapterFactory
		}),
		MatMenuModule
	],
	providers: [{
		provide: HTTP_INTERCEPTORS,
		useClass: AuthInterceptorService,
		multi: true
	}],
	bootstrap: [AppComponent]

})
export class AppModule { }
