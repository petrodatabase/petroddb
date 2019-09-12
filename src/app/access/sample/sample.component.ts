import {
	AfterViewChecked,
	AfterViewInit, Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren,
	ViewEncapsulation
} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {LoadingService} from "../../services/loading.service";
import {Sample} from "../../models/sample";
import {User} from "../../models/user";
import {Eruption} from "../../models/eruption";
import {Workspace} from "../../models/workspace";
import {ImgRel} from "../../models/img-rel";
import {ImageModel} from "../../models/image-model";
import {CanvasModel} from "../fabric-classes/canvas-model";
import {MakeLinkCanvas} from "../fabric-classes/make-link-canvas";
import {SampleService} from "../../services/database-services/sample.service";
import {ProjectService} from "../../services/database-services/project.service";
import {VolcanoService} from "../../services/database-services/volcano.service";
import {Volcano} from "../../models/volcano";
import {Project} from "../../models/project";
import {LinkFile} from "../../models/link-file";
import {LinkFileService} from "../../services/database-services/link-file.service";
import {BaseModel, ModelPermission} from "../../models/base-model";
import {MdListOption} from "@angular/material";
import {ConfirmService} from "../../components/confirm-dialog/confirm.service";
import {AlertService} from "../../components/alert-dialog/alert.service";
import {ImageModelService} from "../../services/database-services/image-model.service";
import {WorkspaceService} from "../../services/database-services/workspace.service";
import {EruptionService} from "../../services/database-services/eruption.service";
import {UserService} from "../../services/database-services/user.service";
import {AuthService} from "../../auth/auth.service";
import {DateTimeFormatService} from "../../services/date-time-format.service";
import {Title} from "@angular/platform-browser";

declare var fabric: any;
declare var idCross :string;
@Component({
	selector: 'app-sample',
	templateUrl: './sample.component.html',
	styleUrls: ['./sample.component.css'],
	encapsulation: ViewEncapsulation.None,
})
export class SampleComponent implements OnInit, OnDestroy, AfterViewInit {

	subscriber: any;
	id: string;
	sample: Sample;

	permission: ModelPermission;
	modelPermission = ModelPermission;

	eruptionList: Eruption[];
	userList: User[];

	schema: any = Sample.schema;
	// form: FormGroup;
	formConfig: any;
	formFilterList: string[];
	formIncludeFields: any[];
	isEditting: boolean = false;
	// infoEditting: boolean = false;


	@ViewChild('single_sp_type')
	single_sp_type_select: any;

	@ViewChild('single_sp_rockcomp')
	single_sp_rockcomp_select: any;

	@ViewChild('single_sp_rocktype')
	single_sp_rocktype_select: any;

	@ViewChildren(MdListOption)
	mdSelectOptions: QueryList<MdListOption>;


	constructor(private activatedRoute: ActivatedRoute,
				private sampleService: SampleService,
				private projectService: ProjectService,
				private volcanoService: VolcanoService,
				private userService: UserService,
				private eruptionService: EruptionService,
				private linkFileService: LinkFileService,
				private imageModelService: ImageModelService,
				private workspaceService: WorkspaceService,

				private loadingService: LoadingService,
				private confirmService: ConfirmService,
				private alertService: AlertService,
				private datetimeService: DateTimeFormatService,
				private authService: AuthService,
        private titleService: Title,
				private router: Router,
	) {
		this.loadingService.handleLoading(true);
		this.sample = new Sample({});
		this.initParamForm();
	}

	ngOnDestroy() {
		this.subscriber.unsubscribe();
    this.setTitle("Volcano Petrology");
	}

	ngAfterViewInit() {
		// this.testCanvas();
	}

	get authenticatedSample() {
		// return this.authService.authenticatedWithSample(this.sample);
    return this.permission == 3;

	}

	ngOnInit() {
		this.subscriber = this.activatedRoute.params.subscribe(params => {
			// this.id = +params['id']; // (+) converts string 'id' to a number
			this.id = params['id']; // (+) converts string 'id' to a number
      // idCross =this.id;
      console.log(this.id);
			this.retrieveFullSample();

		});

	}

  public setTitle( newTitle: string) {
    this.titleService.setTitle( newTitle );
  }

	retrieveFullSample() {
	  console.log(this.id);
		this.sampleService.getSampleMongo(this.id)
			.subscribe(
				(sp: Sample) => {
				  console.log(sp);
					if ("$value" in sp && sp['$value'] == null) {
						// not found!
						this.alertService.openAlert(`404 Data not found`, `Retrieval Error`,
							() => {
								// return to access
								this.router.navigate(['/access']);
							}
						);
						return;
					}

					this.sample = new Sample(sp);
					this.setTitle(this.sample.sp_name);
					let vd_id = this.sample.vd.$key;

          // NOTE: NEW AUTHENTICATION OF SAMPLE . USE PROJECT
          this.projectService.getProjectMongo(this.sample.proj.$key)
            .subscribe(
              (proj: Project) => {
                this.sample.proj = new Project(proj);
                this.permission = this.sample.proj.authenticatePermission(this.authService.currentUserId);

              }
            );

					// TODO: authenticate sample
					// this.permission = this.sample.authenticatePermission(this.authService.currentUserId);
					if (this.permission == ModelPermission.INVISIBLE) {
						this.alertService.openAlert(`User Unauthorized!`, 'Permission Denied', () => {
							// return to home
							this.router.navigate(['/']);
						})
					}

					setTimeout(() => {
						this.onSampleRetrieved();
					}, 100);
					console.log(this.sample);

					// other request to get things....
					this.volcanoService.getVolcano(this.sample.vd.$key)
						.subscribe(
							(vd: Volcano) => {
								this.sample.vd = new Volcano(vd);
								console.log(vd);
								console.log(this.sample);
							}
						);
					// this.projectService.getProjectMongo(this.sample.proj.$key)
					// 	.subscribe(
					// 		(proj: Project) => {
					// 			this.sample.proj = new Project(proj);
					// 			console.log(proj);
					// 			console.log(this.sample);
					// 		}
					// 	);

					this.eruptionService.getEruptionsList(vd_id)
						.subscribe(
							(eds: Eruption[]) => {
								this.eruptionList = eds.map(v => new Eruption(v));
							}
						);

					// SET OF USER RETRIEVAL
					this.userService.getUser(this.sample.sp_pi.$key)
						.subscribe((us: User) => this.sample.sp_pi = new User(us));
					this.userService.getUser(this.sample.sp_editor.$key)
						.subscribe((us: User) => this.sample.sp_editor = new User(us));
					this.userService.getUser(this.sample.sp_uploader.$key)
						.subscribe((us: User) => this.sample.sp_uploader = new User(us));
					this.userService.getUser(this.sample.sp_collector.$key)
						.subscribe((us: User) => this.sample.sp_collector = new User(us));
					this.sample.sp_autho.forEach((us: User, index) => {
						this.userService.getUser(us.$key).subscribe((newUs: User) => this.sample.sp_autho[index] = new User(newUs));
					});



					// this.linkFileService.getLinkFilesList({
					// 		orderByChild: 'linkItem_id',
					// 		equalTo: this.sample.$key,
					// 	}).subscribe(
					// 		(linkf_files: LinkFile[]) => {
					// 			this.sample.linkf_list = linkf_files.map(v => BaseModel.toObject(v, LinkFile) );
					// 		}
					// 	);

					this.linkFileService.getLinkFilesListMongo({
            sp_id: [this.sample.$key]
          }).subscribe(
            (linkf_files: LinkFile[]) => {
              this.sample.linkf_list = linkf_files.map(v => BaseModel.toObject(v, LinkFile) );
            }
          );
					this.imageModelService.getImagesListMongo({
							// orderByChild: 'sp_id',
							// equalTo: this.sample.$key,
            sp_id:[this.sample.$key]
						}).subscribe(
							(imgs: ImageModel[]) => {
								this.sample.img = imgs.map(v => new ImageModel(v));
							}
						);
					this.workspaceService.getWorkspacesListMongo({
            sp_id : [this.sample.$key]
          })
						.subscribe(
							(wss: Workspace[]) => {
								console.log(wss);
								this.sample.workspaces = wss.map((v, i) => {
									// v.$key = i;
									return new Workspace(v)
								});
							}
						);

					this.loadingService.handleLoading(false);
				},
				error => {
					console.log(error);
				}
			);

	}

	onSampleRetrieved() {
		this.sample.sp_type.forEach(v => {
			// this.vd_inf_status_checkboxes.
			this.mdSelectOptions.forEach((option: any) => {
				// console.log(option);
				if (!option.selected && option._element.nativeElement.outerText == v) {
					option.toggle();
				}
			})
		});
		this.sample.sp_rocktype.forEach(v => {
			// this.vd_inf_status_checkboxes.
			this.mdSelectOptions.forEach((option: any) => {
				// console.log(option);
				if (!option.selected && option._element.nativeElement.outerText == v) {
					option.toggle();
				}
			})
		});
		this.sample.sp_rockcomp.forEach(v => {
			// this.vd_inf_status_checkboxes.
			this.mdSelectOptions.forEach((option: any) => {
				// console.log(option);
				if (!option.selected && option._element.nativeElement.outerText == v) {
					option.toggle();
				}
			})
		});
	}


	initParamForm() {
		this.formConfig = {};
		this.formIncludeFields = [];
		this.formFilterList = ['_id', '$key', 'workspaces', 'alys', 'sp_type', 'sp_rocktype', 'sp_rockcomp',
			'proj', 'ed', 'vd', 'sp_uploader', 'sp_pi', 'sp_editor', 'sp_collector',
      'sp_type_other', 'sp_rocktype_other', 'sp_rockcomp_other', 'publications',
			'img', 'subSp', 'linkf_list', 'charts', 'sp_autho', 'proj'];
		// let _this = this;
		Object.keys(Sample.schema)
			.filter(k => !this.formFilterList.includes(k))
			.forEach(k => {
				let required = typeof(Sample.schema[k].required) !== 'undefined' && Sample.schema[k].required;
				this.formIncludeFields.push(k);
				// this.formConfig[k] = new FormControl(null, required?Validators.required:null);
			});

	}

	infoSave() {
		if (this.sampleService.validateInput(this.sample)) {
			this.confirmService.openConfirm(`Are you sure to save new information?`, 'Update Sample',
				() => {
					// yesy
					// this.sample._setData(this.sample, Sample.schema);
					console.log(this.sample);
					this.sample.sp_type = this.single_sp_type_select.selectedOptions.selected.map(v => v._element.nativeElement.innerText.trim());
					this.sample.sp_rocktype = this.single_sp_rocktype_select.selectedOptions.selected.map(v => v._element.nativeElement.innerText.trim());
					this.sample.sp_rockcomp = this.single_sp_rockcomp_select.selectedOptions.selected.map(v => v._element.nativeElement.innerText.trim());

					// this.sampleService.updateSample(this.id, this.sample.toFirebaseJsonObject())
          this.sampleService.updateSampleMongo(this.id, this.sample)
            .then(() => {
							this.isEditting = false;
						})
				},
				() => {
					// no
				}
			);
		}
	}



	stringParseFloat(str: string) {
		return parseFloat(str);
	}
  get notNullSample():boolean{
	  if(this.sample.img.length>0 || this.sample.workspaces.length>0 || this.sample.linkf_list.length>0 || this.sample.publications.length >0 ){

	    return true;
    }
    else{
    return false;
	  }
  }


  deleteSample(sample: Sample){
    this.confirmService.openConfirm(`Are you sure to delete this sample!`, 'Delete File',
      () => {
        let sample_key = this.sample.$key;
        let project_key = this.sample.proj.$key;

        this.sampleService.deleteSampleFirebase(sample_key);
        // FIXME: Need to navigate after delete


      });
  }

}


// export const idCrossFile= idCross ;

