import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Volcano} from "../../../models/volcano";
import {VolcanoTableDatabase} from "../../../elements/volcano-table-database";
import {VolcanoTableDatasource} from "../../../elements/volcano-table-datasource";
import {Observable} from "rxjs/Observable";
import {MdSort} from "@angular/material";
import {SampleService} from "../../../services/database-services/sample.service";
import {ProjectService} from "../../../services/database-services/project.service";
import {UserService} from "../../../services/database-services/user.service";
import {AuthService} from "../../../auth/auth.service";
import {AlertService} from "../../../components/alert-dialog/alert.service";
import {Project} from "../../../models/project";
import {Sample} from "../../../models/sample";
import {User} from "../../../models/user";
import {ModelPermission} from "../../../models/base-model";

@Component({
  selector: 'app-volcano-table',
  templateUrl: './volcano-table.component.html',
  styleUrls: ['./volcano-table.component.css']
})
export class VolcanoTableComponent implements OnInit {

  _vols: Volcano[];
  @ViewChild(MdSort) sort: MdSort;


  @Input()
  set vols(vols: Volcano[]) {
    // console.log(vols);
    this._vols = vols;
    this.database = new VolcanoTableDatabase(this._vols);
    this.dataSource = new VolcanoTableDatasource(this.database, this.sort);

    Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
  }

  _width: number = 300;
  _height: number = 500;

  @Input()
  set width(w: number) {
    this._width = w - 18;
  }

  @Input()
  set height(h: number) {
    this._height = h - 70;
  }

  selected: any;

  elementFilter: string = '';

  constructor(private sampleService: SampleService,
              private projectService: ProjectService,
              private userService: UserService,
              private authService: AuthService,
              private alertService: AlertService,) {
    this.selected = {};
  }

  displayedColumns = ['vd_name', 'projs', 'samples'];

  database: VolcanoTableDatabase;
  dataSource: VolcanoTableDatasource | null;

  @ViewChild('vol_filter') filter: ElementRef;


  /**
   * Set the sort after the view init since this component will
   * be able to query its view for the initialized sort.
   */

  // @ViewChild('eleFilter') eleFilter: ElementRef;

  ngOnInit() {

  }

  ngAfterViewInit() {
  }

  loadProjects(vd: Volcano): any {
    // this.projectService.getProjectsList({})
    // 	.subscribe(
    // 		(projects: Project[]) => {
    // 			// console.log(projects);
    // 			this.projectList = projects.map(v => new Project(v))
    // 				.filter(proj =>
    // 					proj.authenticatePermission(this.authService.currentUserId) != ModelPermission.INVISIBLE
    // 				);
    // 			this.projectLoading  = false;
    //
    // 		},
    // 		error => {
    // 			console.log(error);
    // 		}
    // 	);
  }

  loadSamples(vd: Volcano): any {
    console.log(vd);
    this.sampleService.getSamplesListMongo({
      // orderByChild: 'vd',
      // equalTo: vd.$key
      vd : [vd.$key]
    }).subscribe(
      (sps: Sample[]) => {
        console.log(sps);
        this.loadProjectsToVolcanoBySamples(vd, sps);
        vd.vd_samples = sps.map(v => new Sample(v));
      }
    );
  }

  // this return a list of project combined with samples
  // expecting sps to be raw samples as proj is key not object
  loadProjectsToVolcanoBySamples(vd: Volcano, sps: any[]): any {
    let proj_keys = sps.map(v => v.proj);
    proj_keys = Array.from(new Set(proj_keys));
    vd.vd_projs = [];
    proj_keys.forEach((k, i) => {
      this.projectService.getProjectMongo(k)
        .subscribe(
          (proj: Project) => {
            console.log(k,proj);
            proj = new Project(proj);
            proj.proj_sp_ids = sps.filter(v => ((v.proj == proj.$key) || (v.proj == proj.fireBaseKey))).map(v => new Sample(v));
            proj.proj_sp_ids.forEach(sp => {
              this.userService.getUser(sp.sp_uploader.$key)
                .subscribe(
                  (us: User) => {
                    sp.sp_uploader = new User(us);
                  }
                );
            });
            vd.vd_projs.push(proj);
            console.log(vd.vd_projs);
            if (vd.vd_projs.length >= proj_keys.length) {
              vd.vd_projs = vd.vd_projs.filter(proj =>
                proj.authenticatePermission(this.authService.currentUserId) != ModelPermission.INVISIBLE
              );
            }
          }
        );
    })
  }


  eleChange() {
    if (!this.dataSource) {
      return;
    }
    this.dataSource.filter = this.filter.nativeElement.value;
  }

}
