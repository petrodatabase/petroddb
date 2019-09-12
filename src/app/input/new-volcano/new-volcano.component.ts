import {Component, Input, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Volcano} from "../../models/volcano";
import {MdDialog, MdListOption} from "@angular/material";
import {VolcanoService} from "../../services/database-services/volcano.service";
import {NewVolcanoListComponent} from "./new-volcano-list/new-volcano-list.component";
import {ConfirmService} from "../../components/confirm-dialog/confirm.service";
import {AlertService} from "../../components/alert-dialog/alert.service";
import {DateTimeFormatService} from "../../services/date-time-format.service";
import {BaseModel} from "../../models/base-model";

@Component({
	selector: 'app-new-volcano',
	templateUrl: './new-volcano.component.html',
	styleUrls: ['./new-volcano.component.css']
})
export class NewVolcanoComponent implements OnInit {

	schema: any = Volcano.schema;
	form: FormGroup;
	formConfig: any;
	formFilterList: string[];
	formIncludeFields: any[];


	@ViewChild('vd_inf_status_select')
	vd_inf_status_checkboxes: any;

	@ViewChild('vd_inf_type_select')
	vd_inf_type_checkboxes: any;

	@ViewChild('vd_inf_rtype_select')
	vd_inf_rtype_checkboxes: any;

	@ViewChildren(MdListOption)
	mdSelectOptions: QueryList<MdListOption>;


	@Input()
  targetTabIndex: number;

  _tabIndex: number;

  loading: boolean = false;

  /** FIXME: database is drawn everytime tab change, this will make sure each data is fresh but will increase data loading*/
  @Input()
  set tabIndex(index) {
    this._tabIndex = index;
    if (this._tabIndex == this.targetTabIndex) {
      // this.retrievePrerequisites();
    }
  }


	constructor(
		private volcanoService: VolcanoService,
		private confirmService: ConfirmService,
		private alertService: AlertService,
		private datetimeService: DateTimeFormatService,
		private dialog: MdDialog,
	) {
		this.initFormConfig();
	}

	ngOnInit() {
		this.form = new FormGroup(this.formConfig);
		this.resetForm();

	}

	initFormConfig() {
		this.formConfig = {};
		this.formIncludeFields = [];
		this.formFilterList = ['_id', '$key', 'cc_id', 'cc_id_load', 'vd_cavw',
      'vd_inf_status', 'vd_inf_type', 'vd_inf_rtype',
      'vd_inf_status_other', 'vd_inf_type_other', 'vd_inf_rtype_other', 'vd_has_sps', 'vd_inf_stime', 'vd_inf_stime_unc', 'vd_inf_etime',
      'vd_inf_etime_unc', 'vd_tzone','vd_inf_ycald_lat','vd_inf_ycald_lon',
    ];
		// let _this = this;
		Object.keys(Volcano.schema)
			.filter(k => !this.formFilterList.includes(k))
			.forEach(k => {
				let required = typeof(Volcano.schema[k].required) !== 'undefined' && Volcano.schema[k].required;
				this.formIncludeFields.push(k);
				this.formConfig[k] = new FormControl(null, required?Validators.required:null);
			});
		this.formConfig.vd_inf_status_other = new FormControl(null);
		this.formConfig.vd_inf_type_other = new FormControl(null);
		this.formConfig.vd_inf_rtype_other = new FormControl(null);
	}

	onSubmit() {
		let volcano = new Volcano(this.form.value);
		Object.keys(Volcano.schema).forEach(k => {
			if (volcano[k] == 'null') {
				volcano[k] = '';
			}
		});
		volcano.vd_inf_status = this.vd_inf_status_checkboxes.selectedOptions.selected.map(v => v._element.nativeElement.innerText.trim());
		volcano.vd_inf_type = this.vd_inf_type_checkboxes.selectedOptions.selected.map(v => v._element.nativeElement.innerText.trim());
		volcano.vd_inf_rtype = this.vd_inf_rtype_checkboxes.selectedOptions.selected.map(v => v._element.nativeElement.innerText.trim());
		console.log(volcano);


		if (this.volcanoService.validateInput(volcano)) {
			this.confirmService.openConfirm('Are you sure to upload this volcano?', 'Upload volcano',
				() => {
					this.volcanoService.createVolcano(volcano, (ref: firebase.database.Reference) => {
						volcano.$key = ref.key;
						this.openNewVolcanoList([volcano]);
						this.resetForm();
					});
				},
				() => {
					//no
				}
			);
		}
	}



	openNewVolcanoList(vols: Volcano[]) {
		let config = {
			disableClose: true,
			panelClass: 'custom-overlay-pane-class',
			// panelClass: 'my-full-screen-dialog',
			hasBackdrop: true,
			backdropClass: '',
			width: '',
			// width: '850px',
			height: '',
			// height: '500px',
			position: {
				top: '',
				bottom: '',
				left: '',
				right: ''
			},
			data: {
				volcanos: vols
			},
		};
		let dialogRef = this.dialog.open(NewVolcanoListComponent, config);
		dialogRef.afterClosed().subscribe(
			(result: any ) => {
				console.log(result);
			}
		);
	}

	resetForm() {
		this.form.reset();
		if (!!this.mdSelectOptions) {
      this.mdSelectOptions.forEach((v: MdListOption) => {
        if (v.selected) {
          v.toggle();
        }
      });
    }
		this.form.controls['vd_loaddate'].setValue(BaseModel.currentDate());
	}

}
