import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModifDemandeAbsenceComponent } from '../modif-demande-absence/modif-demande-absence.component';
import { SuppressionDemandeAbsenceComponent } from '../suppression-demande-absence/suppression-demande-absence.component';

@Component({
  selector: 'app-gestion-absences',
  templateUrl: './gestion-absences.component.html',
  styles: []
})
export class GestionAbsencesComponent implements OnInit {

  constructor(private modal: NgbModal) { }

  ngOnInit() {
  }

  chargerModifModal(){
	this.modal.open(ModifDemandeAbsenceComponent);
  }

  chargerSuppresionModal(){
	this.modal.open(SuppressionDemandeAbsenceComponent);
  }
}
