import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ProjectTableDatabase} from "../../elements/project-table-database";
import {ProjectTableDatasource} from "../../elements/project-table-datasource";
import {Observable} from "rxjs/Observable";
import {Project} from "../../models/project";
import {AuthService} from "../../auth/auth.service";
import {ConfirmService} from "../confirm-dialog/confirm.service";
import {AlertService} from "../alert-dialog/alert.service";
import {SampleService} from "../../services/database-services/sample.service";
import {Sample} from "../../models/sample";
import {ModelPermission} from "../../models/base-model";
import {MdSort} from "@angular/material";
import {User} from "../../models/user";
import {UserService} from "../../services/database-services/user.service";

@Component({
	selector: 'app-project-table',
	templateUrl: './project-table.component.html',
	styleUrls: ['./project-table.component.css']
})
export class ProjectTableComponent implements OnInit {

	_projs: Project[];
	@ViewChild(MdSort) sort: MdSort;
	@Input() set projs(vols: Project[]) {
		// console.log(vols);
		this._projs = vols;
		this.database = new ProjectTableDatabase(this._projs);
		this.dataSource = new ProjectTableDatasource(this.database, this.sort);

		Observable.fromEvent(this.filter.nativeElement, 'keyup')
			.debounceTime(150)
			.distinctUntilChanged()
			.subscribe(() => {
				if (!this.dataSource) { return; }
				this.dataSource.filter = this.filter.nativeElement.value;
			});
	}

	@Input()
	allowLoadSample: boolean = false;

	_width: number = 300;
	_height: number = 500;
	@Input() set width(w:  number) {
		this._width = w - 18;
	}

	@Input() set height(h: number) {
		this._height = h - 70;
	}

	selected: any;

	elementFilter: string = '';


	// displayedColumns = ['select', 'ref_id', 'ref_name', 'color', 'type', 'instrument', 'pos_x', 'pos_y', 'elementFilter'];
	// displayedColumns = ['ref_id', 'color', 'type', 'instrument', 'pos_x', 'pos_y', 'elementFilter'];
	displayedColumns: string[];
	database: ProjectTableDatabase;
	dataSource: ProjectTableDatasource | null;

	@ViewChild('proj_filter') filter: ElementRef;

	// @ViewChild('eleFilter') eleFilter: ElementRef;

  constructor(private authService: AuthService,
              private confirmService: ConfirmService,
              private sampleService: SampleService,
              private alertService: AlertService,
              private userService: UserService
  ) {
		this.selected = {};
		this.displayedColumns = ['proj_name', 'proj_date', 'proj_des','proj_creator','proj_pi'];


	}

	ngOnInit() {
    // if (this.allowLoadSample && !this.displayedColumns.includes('sp_list')) {
    //   this.displayedColumns.push('sp_list');
    // }


    this.RetrieveUserDetailFromProjectKey(this._projs)

    // console.log(this._projs)
	}

	ngAfterViewInit() {
    // this.dataSource.sort = this.sort;
	}

	eleChange() {
		if (!this.dataSource) { return; }
		this.dataSource.filter = this.filter.nativeElement.value;
	}

	loadSamples(proj: Project) {
    if (!!proj.proj_sp_ids && proj.proj_sp_ids.length != 0) {
      console.log(proj.proj_sp_ids);
      return;
    }
    console.log(`Load sample`);
    this.sampleService.getSamplesListMongo({
      // orderByChild: 'proj',
      // equalTo: proj.$key
      proj : [proj.$key,proj.fireBaseKey]
    })
			.subscribe(
				(samples: Sample[]) => {
					let sampleList = samples.map(v => new Sample(v))
						.filter(sp =>
							sp.authenticatePermission(this.authService.currentUserId) != ModelPermission.INVISIBLE
						);
					proj.proj_sp_ids = sampleList;
					// this.sampleList.forEach((sp: Sample) => {
					// 	let vd = this.volcanoList.find(v => v.$key == sp.vd.$key);
					// 	let proj = this.projectList.find(v => v.$key == sp.proj.$key);
					//
					// 	if (!!vd) sp.vd = vd;
					// 	if (!!proj) sp.proj = proj;
					// });
					// // console.log(this.sampleList);
					// this.sampleLoading  = false;
				},
				error => {
					console.log(error);
				}
			)
  }

  RetrieveUserDetailFromProjectKey(projs: Project[]){
    for (let i = 0; i < projs.length; i++) {
      this.userService.getUser(projs[i].proj_creator.$key)
        .subscribe(
          (us: User) => {
            projs[i].proj_creator.us_first = us.us_first;
            projs[i].proj_creator.us_family = us.us_family;
            projs[i].proj_creator.displayName = us.displayName;
          }
        )
      this.userService.getUser(projs[i].proj_pi.$key)
        .subscribe(
          (us: User) => {
            projs[i].proj_pi.us_first = us.us_first;
            projs[i].proj_pi.us_family = us.us_family;
            projs[i].proj_pi.displayName = us.displayName;
          }
        )
    }
  }




}
