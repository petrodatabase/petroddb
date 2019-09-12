import {
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit, Component, Input, OnInit, QueryList, ViewChild, ViewChildren,
  ViewEncapsulation
} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Sample} from "../../models/sample";
import {SampleService} from "../../services/database-services/sample.service";
import {MdSelectionList, MdListOption, MdDialog} from "@angular/material";
import {sample} from "rxjs/operator/sample";
import {NewSampleListComponent} from "./new-sample-list/new-sample-list.component";
import {Volcano} from "../../models/volcano";
import {Eruption} from "../../models/eruption";
import {Project} from "../../models/project";
import {ProjectService} from "../../services/database-services/project.service";
import {VolcanoService} from "../../services/database-services/volcano.service";
import {EruptionService} from "../../services/database-services/eruption.service";
import {BaseModel, ModelPermission} from "../../models/base-model";
import {User} from "../../models/user";
import {AuthService} from "../../auth/auth.service";
import {ConfirmService} from "../../components/confirm-dialog/confirm.service";
import {AlertService} from "../../components/alert-dialog/alert.service";
import {UserService} from "../../services/database-services/user.service";
import {SampleExcelReaderService} from "../../services/sample-excel-reader.service";
import {DateTimeFormatService} from "../../services/date-time-format.service";

@Component({
	selector: 'app-new-sample',
	templateUrl: './new-sample.component.html',
	styleUrls: ['./new-sample.component.css'],
	providers: [SampleExcelReaderService],
	encapsulation: ViewEncapsulation.None,
})
export class NewSampleComponent implements OnInit, AfterViewInit, AfterViewChecked, AfterContentInit {
	schema: any = Sample.schema;

	modeTabIndex: number = 0;

	singleForm: FormGroup;
	singleFormConfig: any;
	singleFormFilterList: string[];
	singleFormIncludeFields: any[];

	multipleForm: FormGroup;
	multipleFormConfig: any;
	multipleFormFilterList: string[];
	multipleFormIncludeFields: any[];
	multipleSamples: Sample[];
  multipleSamplesForDirect: any[];

	@ViewChild('single_sp_type')
	// single_sp_type_select: MdSelectionList;
	single_sp_type_select: any;

	@ViewChild('single_sp_rockcomp')
	single_sp_rockcomp_select: any;

	@ViewChild('single_sp_rocktype')
	single_sp_rocktype_select: any;

	@ViewChildren(MdListOption)
	mdSelectOptions: QueryList<MdListOption>;


	@ViewChild('multipleFile')
	multipleFileInput: any;

	volcanoList: Volcano[];
	eruptionList: Eruption[];
	projectList: Project[];

	userList: User[];
	userPIList: User[];

	newSampleUploading: boolean = false;

	@Input()
  targetTabIndex: number;

  _tabIndex: number;

  loading: boolean = false;

  /** FIXME: database is drawn everytime tab change, this will make sure each data is fresh but will increase data loading*/
  @Input()
  set tabIndex(index) {
    this._tabIndex = index;
    if (this._tabIndex == this.targetTabIndex) {
      this.retrievePrerequisites();
    }
  }

	constructor(
		private sampleService: SampleService,
		private projectService: ProjectService,
		private volcanoService: VolcanoService,
		private eruptionService: EruptionService,
		private userService: UserService,
		private authService: AuthService,
		private sampleExcelService: SampleExcelReaderService,

		private confirmService: ConfirmService,
		private alertService: AlertService,
		private datetimeService: DateTimeFormatService,
		public dialog: MdDialog,
	) {
		this.initFormConfig();
	}

	initFormConfig() {
		this.singleFormConfig = {};
		this.singleFormIncludeFields = [];
		this.singleFormFilterList = ['_id', '$key',
			'ed', 'vd', 'proj',
      'publications',
      'sp_type_other', 'sp_rocktype_other', 'sp_rockcomp_other',
			'workspaces', 'sp_uploader', 'sp_editor', 'sp_collector', 'sp_pi',
			'alys', 'img', 'sp_rocktype', 'sp_type', 'sp_rockcomp', 'subSp', 'linkf_list', 'charts', 'sp_autho',  'fireBaseKey'];
		Object.keys(Sample.schema)
			.filter(k => !this.singleFormFilterList.includes(k))
			.forEach(k => {
				let required = typeof(Sample.schema[k].required) !== 'undefined' && Sample.schema[k].required;
				this.singleFormIncludeFields.push(k);
				this.singleFormConfig[k] = new FormControl(null, required?Validators.required:null);
			});
		this.singleFormConfig.ed = new FormControl(null, (!!Sample.schema['ed']['required'] ? Validators.required : null));
		this.singleFormConfig.vd = new FormControl(null, (!!Sample.schema['vd']['required'] ? Validators.required : null));
		this.singleFormConfig.proj = new FormControl(null, (!!Sample.schema['proj']['required'] ? Validators.required : null));
		this.singleFormConfig.sp_editor = new FormControl(null, (!!Sample.schema['sp_editor']['required'] ? Validators.required : null));
		this.singleFormConfig.sp_pi = new FormControl(null, (!!Sample.schema['sp_pi']['required'] ? Validators.required : null));
		this.singleFormConfig.sp_collector = new FormControl(null, (!!Sample.schema['sp_collector']['required'] ? Validators.required : null));
		this.singleFormConfig.sp_type_other = new FormControl(null, (!!Sample.schema['sp_type_other']['required'] ? Validators.required : null));
		this.singleFormConfig.sp_rocktype_other = new FormControl(null, (!!Sample.schema['sp_rocktype_other']['required'] ? Validators.required : null));
		this.singleFormConfig.sp_rockcomp_other = new FormControl(null, (!!Sample.schema['sp_rockcomp_other']['required'] ? Validators.required : null));

		this.multipleFormConfig = {};
		this.multipleFormIncludeFields = [];
		this.multipleFormFilterList = ['_id', '$key', 'workspaces', 'alys', 'img', 'subSp', 'sp_coldate',
			'linkf_list', 'charts', 'sp_autho', 'proj', 'sp_uploader', 'sp_lat', 'sp_lon', 'sp_alt', 'sp_name',
			'sp_amount', 'sp_collector_other', 'sp_sloc_room', 'sp_sloc', 'sp_sdata', 'sp_remark', 'sp_obs', 'ref_frame',
			'sp_fsrc', 'datum', 'projection', 'sp_type', 'sp_type_other', 'sp_rocktype', 'sp_rocktype_other', 'sp_rockcomp', 'sp_rockcomp_other',
      'publications','ed', 'vd', 'proj', 'sp_pi', 'sp_uploader', 'sp_editor', 'sp_collector', 'fireBaseKey'
		];
		Object.keys(Sample.schema)
			.filter(k => !this.multipleFormFilterList.includes(k))
			.forEach(k => {
				let required = typeof(Sample.schema[k].required) !== 'undefined' && Sample.schema[k].required;
				this.multipleFormIncludeFields.push(k);
				this.multipleFormConfig[k] = new FormControl(null, required?Validators.required:null);
			});

		this.multipleFormConfig.vd_multiple = new FormControl(null, (!!Sample.schema['vd']['required'] ? Validators.required : null));
		this.multipleFormConfig.proj_multiple = new FormControl(null, (!!Sample.schema['proj']['required'] ? Validators.required : null));
		this.multipleFormConfig.ed_multiple = new FormControl(null, (!!Sample.schema['ed']['required'] ? Validators.required : null));
		this.multipleFormConfig.sp_pi_multiple = new FormControl(null, (!!Sample.schema['sp_pi']['required'] ? Validators.required : null));
	}

	ngOnInit() {
    this.singleForm = new FormGroup(this.singleFormConfig);
		this.multipleForm = new FormGroup(this.multipleFormConfig);
    this.clearSingleForm();
    this.clearMultipleForm();
	}

	ngAfterContentInit() {

  }
  ngAfterViewChecked() {
  }

	ngAfterViewInit() {
	}

	onSingleSubmit() {
		let newSample = new Sample(this.singleForm.value);
		Object.keys(Sample.schema).forEach(k => {
			if (newSample[k] == 'null') {
				newSample[k] = '';
			}
		});
		newSample.sp_type = this.single_sp_type_select.selectedOptions.selected.map(v => v._element.nativeElement.innerText.trim());
		newSample.sp_rocktype = this.single_sp_rocktype_select.selectedOptions.selected.map(v => v._element.nativeElement.innerText.trim());
		newSample.sp_rockcomp = this.single_sp_rockcomp_select.selectedOptions.selected.map(v => v._element.nativeElement.innerText.trim());
		newSample.sp_uploader = new User({
			$key: this.authService.currentUserId,
		});

		console.log(newSample);
		if (this.sampleService.validateInput(newSample)) {
			this.confirmService.openConfirm(`Sample ${newSample.sp_name} will be uploaded. Confirm?`, 'Upload Sample',
				() => {
					// yesy
					this.newSampleUploading = true;
					this.sampleService.createSampleMongo(newSample, (ref) => {
						console.log('from component finish creating!');
						console.log(ref);
						newSample.$key = ref.item._id || ref.item['_id'] ;
						// this.singleForm.reset();
						this.newSampleUploading = false;
						this.clearSingleForm();
						this.openNewSampleList([newSample]);
					});
				},
				() => {
					// no
				}
			);
		}
	}

	openNewSampleList(samples: Sample[]) {
		let config = {
			disableClose: true,
			panelClass: 'custom-overlay-pane-class',
			hasBackdrop: true,
			backdropClass: '',
			width: '',
			height: '',
			position: {
				top: '',
				bottom: '',
				left: '',
				right: ''
			},
			data: {
				samples: samples
			},
		};
		let dialogRef = this.dialog.open(NewSampleListComponent, config);
		dialogRef.afterClosed().subscribe(
			(result: any ) => {
				console.log(result);
				this.clearMultipleForm()
			}
		);
	}

	clearSingleForm() {
		this.singleForm.reset();
    if (!!this.mdSelectOptions) {
      this.mdSelectOptions.forEach((v: MdListOption) => {
        if (v.selected) {
          v.toggle();
        }
      });
    }
		this.singleForm.controls['sp_coldate'].setValue(BaseModel.currentDate());
	}

	clearMultipleForm() {
		this.multipleForm.reset();
		this.multipleFileInput.nativeElement.value = '';
		this.multipleSamples = [];
    if (!!this.mdSelectOptions) {
      this.mdSelectOptions.forEach((v: MdListOption) => {
        if (v.selected) {
          v.toggle();
        }
      });
    }

	}

	onMultipleFileChange($event) {
		// read excel files
		if ($event.target) {
			this.sampleExcelService.handleFile($event, (data: any) => {
				this.multipleSamples = data.rows;
				for (let i = 0; i < this.multipleSamples.length; i++) {
					this.multipleSamples[i].ed = new Eruption({$key: this.multipleForm.value['ed_multiple']});
					this.multipleSamples[i].vd = new Volcano({$key: this.multipleForm.value['vd_multiple']});
					this.multipleSamples[i].proj = new Project({$key: this.multipleForm.value['proj_multiple']});
					this.multipleSamples[i].sp_pi = new User({$key: this.multipleForm.value['sp_pi_multiple']});
					this.multipleSamples[i].sp_uploader = new User({$key: this.authService.currentUserId});
				}
				console.log(this.multipleSamples);
				// FIXME: dispatch the tables...
			})
		}
		else {
			console.log('cancel files!');
		}
		// create set of samples

		// display on table
	}

	onMultipleSubmit() {
		if (this.multipleSamples.length == 0) {
			this.alertService.openAlert('Nothing to upload',  'Upload Sample');
			return
		}

		// FIXME: delete this after developing delete samples function
    if (this.multipleSamples.length > 10) {
      this.alertService.openAlert('Cannot upload more than 10 samples per one. Please split it',  'Upload Sample');
      return
    }
		console.log(this.multipleSamples);
		this.confirmService.openConfirm(`Are you sure to upload all these ${this.multipleSamples.length} samples`, 'Upload Sample',
			() => {
				// yesy
				this.newSampleUploading = true;
				this.sampleService.createMultipleSampleMongo(this.multipleSamples, (ref) => {
					this.newSampleUploading = false;
					console.log(this.multipleSamples);
			// 		if(this.multipleSamples.length == ref.length) {
          //   // do something here
          // }
					this.openNewSampleList(this.multipleSamples);
				})
			},
			() => {
				// no
			}
		);

		// export
		this.multipleForm.reset();
	}

	// recurUploadMultipleSamples(sampleList: Sample[], endCallback: any = null) {
	// 	if (sampleList.length == 0) {
	// 		if (endCallback) {
	// 			endCallback();
	// 		}
	// 		return;
	// 	}
	// 	let sp = sampleList.splice(0, 1)[0];
	// 	this.sampleService.createSample(sp, (ref: firebase.database.Reference) => {
	// 		sp.$key = ref.key;
	// 		this.recurUploadMultipleSamples(sampleList, endCallback);
	// 	});
	// }

	// TEST eruption
	testEdList: any = {};
	prerequisiteLoaded: boolean = false;
	retrievePrerequisites() {
		if (this.prerequisiteLoaded) return;
		console.log('Load data for sample');
		this.volcanoService.getVolcanosListWithLocal()
			.subscribe(
				(vds: Volcano[]) => {
					this.volcanoList = vds.map(v => new Volcano(v));
          console.log(`Volcano list uploaded`);
				}
			);
		this.projectService.getProjectsListMongo()
			.subscribe(
				(projs: Project[]) => {
					this.projectList = projs.map(v => new Project(v))
						.filter(proj =>
							proj.authenticatePermission(this.authService.currentUserId) == ModelPermission.WRITE
						);
					// console.log(this.projectList);
				}
			);

		this.userService.getUsersList()
			.subscribe(
				(uss: User[]) => {
					this.userList = uss.map(v => new User(v));
					this.userPIList = this.userList.filter(v => v.us_is_pi || v.us_is_ad);
					// console.log(this.userPIList);
				}
			);

		this.prerequisiteLoaded = true;
	}

	onSelectVolcanoChange() {
		let vd_id = (this.modeTabIndex == 0) ? this.singleForm.value['vd']: this.multipleForm.value['vd_multiple'];
		if (vd_id != '') {
			// Set the location of sample to vilcano

			this.eruptionService.getEruptionsList(vd_id, {
				// orderByChild: 'vd_id',
				// equalTo: vd,
			}).subscribe(
				(eds: Eruption[]) => {
					// in reverse time order
					this.eruptionList = eds.map(v => new Eruption(v))
						// .sort((a: Eruption, b: Eruption) => {
						// 	return +b.ed_stime.split("-")[0] - +a.ed_stime.split("-")[0];
						// });
						.sort((a: Eruption, b: Eruption) => this.datetimeService.sortOnDateTime(a.ed_stime, b.ed_stime));
					// console.log(this.eruptionList);
				}
			);

			if (this.modeTabIndex == 0) {
				let volcano = this.volcanoList.find(v => v.$key == vd_id);
				if (!volcano) return;
				this.singleForm.controls['sp_lat'].setValue(volcano['vd_inf_slat'] || 0);
				this.singleForm.controls['sp_lon'].setValue(volcano['vd_inf_slon'] || 0);
			}

		}
	}

	onMultipleSelectVolcanoChange() {
		let vd = this.multipleForm.value['vd'];
		if (vd != '') {
			this.eruptionService.getEruptionsList(vd, {
				// orderByChild: 'vd_id',
				// equalTo: vd,
			}).subscribe(
				(eds: Eruption[]) => {
					this.eruptionList = eds.map(v => new Eruption(v));
					// console.log(this.eruptionList);
				}
			);
		}
	}

	testEruption() {
		console.log(this.testEdList);
	}
}
