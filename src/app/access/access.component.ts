import {Component, OnInit} from '@angular/core';
import {LoadComponent} from "../components/load/load.component";
import {LoadingService} from "../services/loading.service";

@Component({
	selector: 'app-access',
	templateUrl: './access.component.html',
	styleUrls: ['./access.component.css']
})
export class AccessComponent implements OnInit {


	constructor(
		private loadingService: LoadingService,
	) {
	}

	ngOnInit() {
		setTimeout(() =>  {
			this.loadingService.handleLoading(false);
		}, 2000)
	}

}
