import { Component, OnInit, Input } from '@angular/core';
import { Collegue } from '../auth/auth.domains';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-manager-vue-histogramme',
  templateUrl: './manager-vue-histogramme.component.html',
  styles: []
})
export class ManagerVueHistogrammeComponent implements OnInit {
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

public chartType: string = 'bar';

public chartDatasets: Array<any> = [
  { data: [65, 59, -157, 81, 56, 55, 40], label: 'My First dataset' },
  { data: [11, 12, -157, 13, 14, 15, 16], label: 'My Second dataset' }, // Récupérer collègues ici comme dataset
];

public chartLabels: Array<any> = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'];  // à mettre les jours du mois ici - voir pour récupérer venant de la bdd

  public chartColors: Array<any> = [
    {
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 2,
    },
    {
      backgroundColor: [
        'rgba(255, 125, 158, 0.2)',
        'rgba(3, 111, 184, 0.2)',
        'rgba(255, 255, 137, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(126, 243, 243, 0.2)',
        'rgba(255, 210, 115, 0.2)'
      ],
      borderColor: [
        'rgba(255, 125, 158, 1)',
        'rgba(3, 111, 184, 1)',
        'rgba(255, 255, 137, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(126, 243, 243, 1)',
        'rgba(255, 210, 115, 1)'
      ],
      borderWidth: 2,
    },
    ];

    public chartOptions: any = {
      responsive: true,
        scales: {
          xAxes: [{
            stacked: true
            }],
          yAxes: [
          {
            stacked: true
          }
        ]
      }
    };
    public chartClicked(e: any): void { }
    public chartHovered(e: any): void { }

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
