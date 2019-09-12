import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Sample} from "../../models/sample";
import {SampleService} from "../../services/database-services/sample.service";
import {VolcanoService} from "../../services/database-services/volcano.service";
import {Volcano} from "../../models/volcano";
import {ProjectService} from "../../services/database-services/project.service";
import {Project} from "../../models/project";
import {NavigationEnd, Router} from "@angular/router";
import {Subscription} from "rxjs/Subscription";
import {EruptionService} from "../../services/database-services/eruption.service";
import {ConfirmService} from "../../components/confirm-dialog/confirm.service";
import {AlertService} from "../../components/alert-dialog/alert.service";
import {Eruption} from "../../models/eruption";
import {DateTimeFormatService} from "../../services/date-time-format.service";
import {UserService} from "../../services/database-services/user.service";
import {AuthService} from "../../auth/auth.service";
import {ModelPermission} from "../../models/base-model";
import {Title} from "@angular/platform-browser";
import {User} from '../../models/user';

@Component({
	selector: 'app-display',
	templateUrl: './display.component.html',
	styleUrls: ['./display.component.css']
})
export class DisplayComponent implements OnInit, OnDestroy, AfterViewInit {
  projects: any;
	sampleList: Sample[];
	sampleLoading: boolean = true;

	volcanoList: Volcano[];
	volcanoLoading: boolean  = true;
	mappedVolcanoList: Volcano[];
	mapShowNoSamples: boolean = true;

	projectList: Project[];
	// projectList: any;
	projectLoading: boolean = true;

	@ViewChild('cardContainer')
	cardContainer: any;

	constructor(
		private sampleService: SampleService,
		private volcanoService: VolcanoService,
		private projectService: ProjectService,
		private eruptionService: EruptionService,
		private userService: UserService,
		private authService: AuthService,

		private dateTimeService: DateTimeFormatService,
		private confirmService: ConfirmService,
		private alertService: AlertService,
    private titleService : Title,
	) {
	}

	ngAfterViewInit() {
	}

	ngOnInit() {
    this.setTitle("Access Database");
		this.getCompositeData();
	}

  ngOnDestroy(){
    this.setTitle("Volcano Petrology");
  }

  public setTitle( newTitle: string) {
    this.titleService.setTitle( newTitle );
  }

	getSamplesList() {
		this.sampleService.getSamplesListMongo()
			.subscribe(
				(samples: any[]) => {
					this.sampleList = samples.map(v => new Sample(v))
						.filter(sp =>
							sp.authenticatePermission(this.authService.currentUserId) != ModelPermission.INVISIBLE
						);

					this.sampleList.forEach((sp: Sample) => {
						let vd = this.volcanoList.find(v => v.$key == sp.vd.$key);
						let proj = this.projectList.find(v => v.$key == sp.proj.$key);

						if (!!vd) sp.vd = vd;
						if (!!proj) sp.proj = proj;
					});
					this.sampleLoading  = false;
				},
				error => {
					console.log(error);
				}
			)
	}

	getVolcanoList() {
		this.volcanoService.getVolcanosListWithLocal()
			.subscribe(
				(volcanos: Volcano[]) => {
					// console.log(volcanos);
					this.volcanoList = volcanos.map(v => new Volcano(v));
					this.volcanoLoading  = false;
				},
				error => {
					console.log(error);
				}
			)
	}

	getProjectList() {
		this.projectService.getProjectsListMongo()
			.subscribe(
				(projects: Project[]) => {
					console.log(projects);
					this.projectList = projects.map(v => {
					  return new Project(v);
					})
						.filter(proj =>
							proj.authenticatePermission(this.authService.currentUserId) != ModelPermission.INVISIBLE
						)
          ;
					console.log(this.projectList);
					this.projectLoading  = false;
				},
				error => {
					console.log(error);
				}
			);
	}

	/** Retrieve sample binded with volcano, project */
	getCompositeData() {
		/** Volcanoes */
		this.volcanoService.getVolcanosListWithLocal()
			.subscribe(
				(volcanos: Volcano[]) => {
          volcanos.sort((a, b) => {
            if (a.vd_name.toLowerCase() > b.vd_name.toLowerCase()) return 1;
            if (a.vd_name.toLowerCase() < b.vd_name.toLowerCase()) return -1;
            else return 0;
          });
					this.volcanoList = volcanos.map(v => new Volcano(v));
					this.volcanoLoading  = false;
					this.mapOnShowNoSpChange();
				},
				error => {
					console.log(error);
				}
			)
	}

	mapOnShowNoSpChange() {
	  if (!this.volcanoList) {
	    this.mappedVolcanoList = [];
	    return;
    }
    if (this.mapShowNoSamples) {
	    this.mappedVolcanoList = this.volcanoList;
    }
    else {
	    this.mappedVolcanoList = this.volcanoList.filter(v => v.vd_has_sps);
    }
  }
}
