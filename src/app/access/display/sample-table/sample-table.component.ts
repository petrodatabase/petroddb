import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Sample} from "../../../models/sample";
import {SampleTableDatabase} from "../../../elements/sample-table-database";
import {SampleTableDatasource} from "../../../elements/sample-table-datasource";
import {Observable} from "rxjs/Observable";
import {Volcano} from "../../../models/volcano";
import {Project} from "../../../models/project";
import {SampleService} from "../../../services/database-services/sample.service";
import {VolcanoService} from "../../../services/database-services/volcano.service";
import {ProjectService} from "../../../services/database-services/project.service";
import {UserService} from "../../../services/database-services/user.service";
import {ImageModelService} from "../../../services/database-services/image-model.service";
import {Workspace} from "../../../models/workspace";
import {WorkspaceService} from "../../../services/database-services/workspace.service";
import {AnalysisService} from "../../../services/database-services/analysis.service";
import {LinkFileService} from "../../../services/database-services/link-file.service";
import {ChartService} from "../../../services/database-services/chart.service";
import {AlertService} from "../../../components/alert-dialog/alert.service";
import {ImageModel} from "../../../models/image-model";
import {LinkFile} from "../../../models/link-file";
import {MdSort} from "@angular/material";
import {User} from "../../../models/user";

@Component({
	selector: 'app-sample-table',
	templateUrl: './sample-table.component.html',
	styleUrls: ['./sample-table.component.css']
})
export class SampleTableComponent implements OnInit {

	_samples: Sample[];

	_volcanoList: Volcano[] = null;
	_projectList: Project[] = null;
	schema: any = Sample.schema;
	searchFields: any = {};
	hiddenSearchFields: string[] = ['$key',
		'ed',
		// 'vd',
		// 'proj',
		// 'sp_uploader',
    'sp_pi', 'sp_editor', 'sp_collector',
		// 'workspaces',
		'alys',
    'publications',
		// 'img',
		'subSp',
		// 'linkf_list',
		'charts',
		'sp_autho'
	];

  @ViewChild(MdSort) sort: MdSort;


	@Input() set samples(sps: Sample[]) {
		// console.log(vols);
		this._samples = sps;
		this.database = new SampleTableDatabase(this._samples);
		this.dataSource = new SampleTableDatasource(this.database, this.sort);

		/** This event handler is deprecated, search event move to search button */
		// Observable.fromEvent(this.filter.nativeElement, 'keyup')
		// 	.debounceTime(150)
		// 	.distinctUntilChanged()
		// 	.subscribe(() => {
		// 		if (!this.dataSource) { return; }
		// 		this.dataSource.filter = this.filter.nativeElement.value;
		// 	});
	}

	_width: number = 300;
	_height: number = 500;
	@Input() set width(w:  number) {
		this._width = w - 18;
	}

	@Input() set height(h: number) {
		this._height = h - 70;
	}

	@Input() set volcanoList(vds: Volcano[]) {
		this._volcanoList = vds;
		if (!!this._volcanoList) {
			this.hiddenSearchFields = this.hiddenSearchFields.filter(k => k != 'vd');
		}
		else {
			this.hiddenSearchFields.push("vd");
		}
		this.initSearchFields();
	}

	@Input() set projectList(projs: Project[]) {
		this._projectList = projs;
		if (!!this._projectList) {
			this.hiddenSearchFields = this.hiddenSearchFields.filter(k => k != 'proj');
		}
		else {
			this.hiddenSearchFields.push("proj");
		}
		this.initSearchFields();
	}

	selected: any;
	otherField: string = "";

	elementFilter: string = '';
	constructor(
		private sampleService: SampleService,
		private volcanoService: VolcanoService,
		private projectService: ProjectService,

		private userService: UserService,
		private imageService: ImageModelService,
		private workspaceService: WorkspaceService,
		private alyService: AnalysisService,
		private linkfService: LinkFileService,
		private chartService: ChartService,

		private alertService: AlertService,
	) {
		this.selected = {};
		this.initSearchFields();
	}

	initSearchFields() {
		this.searchFields = {};
		Object.keys(Sample.schema).filter(v => !this.hiddenSearchFields.includes(v)).forEach(k => {
			this.searchFields[k] = false;
		});
	}

	displayedColumns = ['sp_name', 'sp_amount', 'sp_coldate', 'sp_type', 'sp_rocktype', 'other'];
	database: SampleTableDatabase;
	dataSource: SampleTableDatasource | null;

	workspaceLoaded: boolean = false;
	imageLoaded: boolean = false;
	analysisLoaded: boolean = false;
	linkfLoaded: boolean = false;
	chartLoaded: boolean = false;
  spUploaderLoaded: boolean = false;
	dataLoading: boolean = false;

	@ViewChild('sp_filter') filter: ElementRef;

	// @ViewChild('eleFilter') eleFilter: ElementRef;

	ngOnInit() {

	}

	get searchKeys() {
    // console.log(this.searchFields)
		return Object.keys(this.searchFields);
	}

	search() {
		if (!this.dataSource) { return; }
		// if (!!this._volcanoList) {this.dataSource.volcanoList = this._volcanoList;}
		// if (!!this._projectList) {this.dataSource.projectList = this._projectList;}
		this.dataSource.searchFields = Object.keys(this.searchFields).filter(k => this.searchFields[k]);

		this.dataSource.filter = this.filter.nativeElement.value;
	}

	externalFields: string[] = ['workspaces', 'alys', 'img', 'charts', 'linkf_list', 'subSp', 'sp_autho','sp_uploader'];
	otherFieldChange() {
		console.log(this.otherField);

		if (this.externalFields.includes(this.otherField)) {
			this.retrieveExternalField(this.otherField);
		}
	}

	onFieldSelectChange(k: string) {
		/** check for loaded workspaces... before filter */
		if (!this.searchFields[k]) return;
		else {
			this.retrieveExternalField(k);
		}
	}

	retrieveExternalField(k: string) {
		switch (k) {
			case 'workspaces':
				if (!this.workspaceLoaded) {
					this.dataLoading = true;
					this._samples.forEach((sp: Sample, index: number) => {
						this.workspaceService.getWorkspacesList(sp.$key)
							.subscribe(
								(wss: Workspace[]) => {
									console.log(wss);
									sp.workspaces = wss.map(w => new Workspace(w));
									if (index >= this._samples.length - 1) {
										this.dataLoading = false;
										this.workspaceLoaded = true;
									}
								}
							);
					});
				}
				break;
			case 'alys':
				break;
			case 'img':
				if (!this.imageLoaded) {
					this.dataLoading = true;
					this._samples.forEach((sp: Sample, index: number) => {
						this.imageService.getImagesList({orderByChild: 'sp_id', equalTo: sp.$key})
							.subscribe(
								(imgs: ImageModel[]) => {
									sp.img = imgs.map(w => new ImageModel(w));
									if (index >= this._samples.length - 1) {
										this.dataLoading = false;
										this.imageLoaded = true;
									}
								}
							);
					});
				}
				break;
			case 'subSp':
				break;
			case 'linkf_list':
				if (!this.linkfLoaded) {
					this.dataLoading = true;
					this._samples.forEach((sp: Sample, index: number) => {
						this.linkfService.getLinkFilesList({orderByChild: 'linkItem_id', equalTo: sp.$key})
							.subscribe(
								(linkfs: LinkFile[]) => {
									sp.linkf_list = linkfs.map(f => new LinkFile(f));
									if (index >= this._samples.length - 1) {
										this.dataLoading = false;
										this.linkfLoaded = true;
									}
								}
							);
					});
				}
				break;
			case 'charts':
				break;
			case 'sp_autho':
				break;
      case 'sp_uploader':{
        if (!this.spUploaderLoaded) {
          this.dataLoading = true;
          this._samples.forEach((sp: Sample, index: number) => {
            this.userService.getUser(sp.sp_uploader.$key)
              .subscribe(
                (us: User) => {
                  sp.sp_uploader.us_first = us.us_first;
                  sp.sp_uploader.us_family = us.us_family;
                  sp.sp_uploader.displayName = us.displayName;

                  if (index >= this._samples.length - 1) {
                    this.dataLoading = false;
                    this.spUploaderLoaded = true;
                  }
                }
              );
          });
        }
      break;
      }
			default:
				break;
		}
	}

	renderField(field: string, val: any) {
		switch (field) {
			// FIXME: not
			case "workspaces":
			case 'img':
			case 'linkf_list':
				if (!!val && val.constructor === Array) {
					return `${val.length} items`;
				}
				else return "";
			case "vd":
				if (this._volcanoList && this._volcanoList.length > 0) {
					let vd = this._volcanoList.find(v => v.$key == val.$key);
					if (vd) return vd.vd_name;
					else return "";
				}
				else return "";
			case 'proj':
				if (this._projectList && this._projectList.length > 0) {
					let project = this._projectList.find(v => v.$key == val.$key);
					if (project) return project.proj_name;
					else return "";
				}
				else return "";

      case 'sp_uploader':{
        return (val.us_first&&val.us_family)?(val.us_first+" " + val.us_family):(val.displayName);
      }

			default:
				if (!!val && val.constructor === Array) {
					return val.join(",");
				}
				else return val;
		}
	}

	eleChange() {
		if (!this.dataSource) { return; }
		this.dataSource.filter = this.filter.nativeElement.value;
	}

}
