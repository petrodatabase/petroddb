import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "../base/base.component";
import {LoadingService} from "../../services/loading.service";


// TODO: This responsible for loading the the component, activate loading status....
@Component({
	selector: 'app-load',
	templateUrl: './load.component.html',
	styleUrls: ['./load.component.css']
})
export class LoadComponent extends BaseComponent implements OnInit {

	public isLoading: boolean;
	constructor(
		private service: LoadingService
	) {
		super();
		this.isLoading = true;
	}

	ngOnInit() {
		this.service.isLoading.subscribe(
			isLoading => {
				this.isLoading = isLoading;
			}
		)
	}


}
