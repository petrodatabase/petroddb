import {Component, OnInit,OnDestroy} from '@angular/core';
import {LoadingService} from "../services/loading.service";
import {Title} from "@angular/platform-browser";

@Component({
	selector: 'app-input',
	templateUrl: './input.component.html',
	styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit, OnDestroy {

  tabIndex: number;
	constructor(
		private loadingService: LoadingService,
    private titleService: Title,
	) {
	  this.tabIndex = 0;
	}

	ngOnInit() {
	  this.setTitle("Input");
		setTimeout(() =>  {
			this.loadingService.handleLoading(false);
		}, 2000)
	}

	ngOnDestroy(){
    this.setTitle("Volcano Petrology");
  }

  public setTitle( newTitle: string) {
    this.titleService.setTitle( newTitle );
  }

}
