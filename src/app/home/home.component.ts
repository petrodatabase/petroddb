import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Sample} from "../models/sample";
import {ImageModel} from "../models/image-model";
import {Project} from "../models/project";
import {User} from "../models/user";
import {LoadingService} from "../services/loading.service";
import {ImageModelService} from "../services/database-services/image-model.service";
import {DateTimeFormatService} from "../services/date-time-format.service";
import {AnalysisService} from "../services/database-services/analysis.service";
import {ChartService} from "../services/database-services/chart.service";

// declare var Swiper: any;

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

	constructor(
		private loadingService: LoadingService,
		private imageModelService: ImageModelService,
		private dateTimeFormatService: DateTimeFormatService,
    private analysisService: AnalysisService,
		private chartService: ChartService,
	) {
		// this.makeTest();
	}

	ngOnInit() {

		this.loadingService.handleLoading(false);
		// this.testDate();


	}

	ngAfterViewInit() {
	}

}
