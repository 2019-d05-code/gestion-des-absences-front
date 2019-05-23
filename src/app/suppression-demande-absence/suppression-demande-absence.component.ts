import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-suppression-demande-absence',
  templateUrl: `./suppression-demande-absence.component.html`,
  styles: []
})
export class SuppressionDemandeAbsenceComponent implements OnInit {


  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }

  quitterModifModal(){
	this.modalService.dismissAll(SuppressionDemandeAbsenceComponent);
  }

  submit(){

  }
}
