import {
	AfterViewInit, Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren,
	ViewEncapsulation
} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {LoadingService} from "../../services/loading.service";
import {Volcano} from "../../models/volcano";
import {Eruption} from "../../models/eruption";
import {Sample} from "../../models/sample";
import {VolcanoService} from "../../services/database-services/volcano.service";
import {SampleService} from "../../services/database-services/sample.service";
import {AlertService} from "../../components/alert-dialog/alert.service";
import {ConfirmService} from "../../components/confirm-dialog/confirm.service";
import {EruptionService} from "../../services/database-services/eruption.service";
import {MdListOption} from "@angular/material";
import {DateTimeFormatService} from "../../services/date-time-format.service";
import {ModelPermission} from "../../models/base-model";
import {AuthService} from "../../auth/auth.service";
import {Project} from "../../models/project";
import {ProjectService} from "../../services/database-services/project.service";
import {Title} from "@angular/platform-browser";

// var $: any;
// var google: any;

@Component({
	selector: 'app-volcano',
	templateUrl: './volcano.component.html',
	styleUrls: ['./volcano.component.css'],
	encapsulation: ViewEncapsulation.None,

})
export class VolcanoComponent implements OnInit, OnDestroy, AfterViewInit {

	subscriber: any;
	id: string;
	volcano: Volcano;

	bindedSamples: Sample[];

	map: any;

	schema: any = Volcano.schema;
	// form: FormGroup;
	formConfig: any;
	formFilterList: string[];
	formIncludeFields: any[];

	edSchema: any = Eruption.schema;
	// form: FormGroup;
	edFormConfig: any;
	edFormFilterList: string[];
	edFormIncludeFields: any[];

	isEditting: boolean = false;
	isInfoEditting: boolean = false;
	isEdEditting: boolean = false;

	selectedEruption: string;
	targetedEruption: Eruption; // is the eruption that chosen must be change for the future, now is so inefficient

	eruptionList: Eruption[];
	sampleList: any = {};
	listedSamples: Sample[];
	allSamples: Sample[];
	projectList: Project[];

	testData: string;


	@ViewChild('vd_inf_status_select')
	vd_inf_status_checkboxes: any;

	@ViewChild('vd_inf_type_select')
	vd_inf_type_checkboxes: any;

	@ViewChild('vd_inf_rtype_select')
	vd_inf_rtype_checkboxes: any;

	@ViewChildren(MdListOption)
	mdSelectOptions: QueryList<MdListOption>;

	constructor(
		private activatedRoute: ActivatedRoute,
		private loadingService: LoadingService,
		private volcanoService: VolcanoService,
		private sampleService: SampleService,
		private projectService: ProjectService,
		private eruptionService: EruptionService,
		private authService: AuthService,
		private alertService: AlertService,
		private confirmService: ConfirmService,
		private datetimeService: DateTimeFormatService,
		private titleService: Title,
		// eruption service
	) {
		this.loadingService.handleLoading(true);
		this.selectedEruption = '';
		this.eruptionList = [];
		// this.sampleList = [];
		this.allSamples = [];
		this.listedSamples = [];
		this.targetedEruption = null;
		this.initParamForm();
	}

	tellTestData() {
		console.log(this.testData);
	}

	ngAfterViewInit() {
		// this.onVolcanoRetrieved();

	}

	ngOnInit() {

		this.subscriber = this.activatedRoute.params.subscribe(params => {
			// this.id = +params['id']; // (+) converts string 'id' to a number
			this.id = params['id']; // (+) converts string 'id' to a number\
			this.retrieveData();


			// In a real app: dispatch action to load the details here.
		});
	}

  public setTitle( newTitle: string) {
    this.titleService.setTitle( newTitle );
  }

	retrieveData() {
		this.volcanoService.getVolcano(this.id)
			.subscribe(
				(vd: Volcano) => {
					this.volcano = new Volcano(vd);
					this.setTitle(this.volcano.vd_name);
					setTimeout(() => {

						this.onVolcanoRetrieved();
					}, 50);
					// TODO: getall sample list


					this.sampleService.getSamplesListMongo({
						// orderByChild: 'vd',
						// equalTo: this.id
            vd : [this.id]
					}).subscribe(
						(samples: Sample[]) => {
							this.allSamples = samples.map(v => new Sample(v))
								.filter(sp =>
									sp.authenticatePermission(this.authService.currentUserId) != ModelPermission.INVISIBLE
								);
							console.log(this.allSamples);

							this.sampleList['all'] = this.allSamples;
							this.listedSamples = this.sampleList['all'];

							// TODO: get all eruption
							this.eruptionService.getEruptionsList(this.id, {}).subscribe(
								(eds: Eruption[]) => {
									// FIXME: sort the eruption
									this.eruptionList = eds.map(v => new Eruption(v)).sort((a, b) => this.datetimeService.sortOnDateTime(a.ed_stime, b.ed_stime));
									this.eruptionList.forEach((v: Eruption, i: number) => {
										this.sampleList[v.$key] = this.sampleList['all'].filter(s => s.ed.$key == v.$key);
									});

									this.loadingService.handleLoading(false);
									console.log(this.sampleList);
								}
							);

							this.retrieveProjects(this.allSamples);

						}
					);
				},
				error => {
					console.log(error);
				}
			)
	}

	retrieveProjects(sps: Sample[]) {
	  let proj_keys = sps.map(v => v.proj.$key);
	  proj_keys = Array.from(new Set(proj_keys));
	  // vd.vd_projs = [];
    let projs = [];
	  // this.projectList = [];
    proj_keys.forEach((k, i) => {
	    this.projectService.getProjectMongo(k)
        .subscribe(
          (proj: Project) => {
            proj = new Project(proj);
            proj.proj_sp_ids = sps.filter(v => v.proj.$key == proj.$key).map(v => new Sample(v));
            // proj.proj_sp_ids.forEach(sp => {
            //   this.userService.getUser(sp.sp_uploader.$key)
            //     .subscribe(
            //       (us: User) => {
            //         sp.sp_uploader = new User(us);
            //       }
            //     );
            // });

            projs.push(proj);
            if (projs.length >= proj_keys.length) {
              this.projectList = projs.filter(p =>
                p.authenticatePermission(this.authService.currentUserId) != ModelPermission.INVISIBLE
              );
            }
          }
        );
    })
  }

	onVolcanoRetrieved() {
		this.volcano.vd_inf_status.forEach(v => {
			// this.vd_inf_status_checkboxes.
			this.mdSelectOptions.forEach((option: any) => {
				// console.log(option);
				if (!option.selected && option._element.nativeElement.outerText == v) {
					option.toggle();
				}
			})
		});
		this.volcano.vd_inf_type.forEach(v => {
			// this.vd_inf_status_checkboxes.
			this.mdSelectOptions.forEach((option: any) => {
				// console.log(option);
				if (!option.selected && option._element.nativeElement.outerText == v) {
					option.toggle();
				}
			})
		});
		this.volcano.vd_inf_rtype.forEach(v => {
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
		this.formFilterList = ['_id', '$key', 'cc_id', 'cc_id_load', 'vd_inf_desc', 'vd_cavw',
      'vd_inf_status', 'vd_inf_type', 'vd_inf_rtype', 'vd_has_sps',
      'vd_inf_status_other', 'vd_inf_type_other', 'vd_inf_rtype_other', 'vd_inf_stime', 'vd_inf_stime_unc', 'vd_inf_etime',
      'vd_inf_etime_unc',
    ];
		// let _this = this;
		Object.keys(Volcano.schema)
			.filter(k => !this.formFilterList.includes(k))
			.forEach(k => {
				let required = typeof(Volcano.schema[k].required) !== 'undefined' && Volcano.schema[k].required;
				this.formIncludeFields.push(k);
				// this.formConfig[k] = new FormControl(null, required?Validators.required:null);
			});


		this.edFormConfig = {};
		this.edFormIncludeFields = [];
		this.edFormFilterList = ['_id', 'cc_id', 'cc_id_load', 'vd_inf_desc', 'vd_id', '$key',
			'cc_id2', 'cc_id3', 'cc_ids', 'ed_stime_unc', 'ed_etime_unc', 'ed_climax_unc', 'ed_com_2'];
		// let _this = this;
		Object.keys(Eruption.schema)
			.filter(k => !this.edFormFilterList.includes(k))
			.forEach(k => {
				let required = typeof(Eruption.schema[k].required) !== 'undefined' && Eruption.schema[k].required;
				this.edFormIncludeFields.push(k);
				// this.formConfig[k] = new FormControl(null, required?Validators.required:null);
			});

		// for eruption
	}

	onSelectEruption() {
		console.log('select eruption');
		console.log(this.selectedEruption);
		this.listedSamples = this.sampleList[this.selectedEruption];
		if (this.selectedEruption != 'all') {
			this.targetedEruption = this.eruptionList.find(v => v.$key == this.selectedEruption);
		}
	}

	onEruptionSave(eruption: Eruption) {
		console.log(eruption);
		this.loadingService.handleLoading(true);
		// this.volcano.vd_inf_status = this.vd_inf_status_checkboxes.selectedOptions.selected.map(v => v._element.nativeElement.innerText.trim());
		// this.volcano.vd_inf_type = this.vd_inf_type_checkboxes.selectedOptions.selected.map(v => v._element.nativeElement.innerText.trim());
		// this.volcano.vd_inf_rtype = this.vd_inf_rtype_checkboxes.selectedOptions.selected.map(v => v._element.nativeElement.innerText.trim());

		if (this.eruptionService.validateInput(eruption)) {
			this.eruptionService.updateEruption(this.id, eruption.$key, eruption.toFirebaseJsonObject())
				.then(() => {
					//
					this.loadingService.handleLoading(false);
					this.isEdEditting = false;
				});
		}
	}

	onVolcanoSave() {
		this.loadingService.handleLoading(true);
		this.volcano.vd_inf_status = this.vd_inf_status_checkboxes.selectedOptions.selected.map(v => v._element.nativeElement.innerText.trim());
		this.volcano.vd_inf_type = this.vd_inf_type_checkboxes.selectedOptions.selected.map(v => v._element.nativeElement.innerText.trim());
		this.volcano.vd_inf_rtype = this.vd_inf_rtype_checkboxes.selectedOptions.selected.map(v => v._element.nativeElement.innerText.trim());

		if (this.volcanoService.validateInput(this.volcano)) {
			this.volcanoService.updateVolcano(this.id, this.volcano.toFirebaseJsonObject())
				.then(() => {
					//
					this.loadingService.handleLoading(false);
					this.isEditting = false;
					this.isInfoEditting = false;
				});
		}
	}


	ngOnDestroy() {
		this.subscriber.unsubscribe();
		this.setTitle("Volcano Petrology");
	}

	volcanoInfoChange() {

	}

	volcanoDescChange() {

	}

}
