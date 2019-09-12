import {Component, Input, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation} from '@angular/core';
import {Eruption} from "../../models/eruption";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Volcano} from "../../models/volcano";
import {MdListOption} from "@angular/material";
import {VolcanoService} from "../../services/database-services/volcano.service";
import {ConfirmService} from "../../components/confirm-dialog/confirm.service";
import {EruptionService} from "../../services/database-services/eruption.service";
import * as firebase from 'firebase';
import {DateTimeFormatService} from "../../services/date-time-format.service";
import {AlertService} from "../../components/alert-dialog/alert.service";
import {BaseModel} from "../../models/base-model";

@Component({
  selector: 'app-new-eruption',
  templateUrl: './new-eruption.component.html',
  styleUrls: ['./new-eruption.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class NewEruptionComponent implements OnInit {
  schema: any = Eruption.schema;
  form: FormGroup;
  formConfig: any;
  formFilterList: string[];
  formIncludeFields: any[];

  volcanoList: Volcano[];

  @Input()
  targetTabIndex: number;

  _tabIndex: number;

  loading: boolean = false;

  @Input()
  set tabIndex(index) {
    this._tabIndex = index;
    if (this._tabIndex == this.targetTabIndex) {
      this.retrievePrerequisites();
    }
  }

  constructor(private volcanoService: VolcanoService,
              private eruptionService: EruptionService,
              private datetimeService: DateTimeFormatService,
              private confirmService: ConfirmService,
              private alertService: AlertService,) {
    this.initFormConfig();
  }

  ngOnInit() {
    this.form = new FormGroup(this.formConfig);
    this.resetForm();
  }

  initFormConfig() {
    this.formConfig = {};
    this.formIncludeFields = [];
    this.formFilterList = ['_id', 'vd_id', '$key', 'cb_ids', 'cc_id', 'cc_id2', 'cc_id3', 'cc_id_load', 'ed_code', 'ed_num'];
    // let _this = this;
    Object.keys(Eruption.schema)
      .filter(k => !this.formFilterList.includes(k))
      .forEach(k => {
        let required = typeof(Eruption.schema[k].required) !== 'undefined' && Eruption.schema[k].required;
        this.formIncludeFields.push(k);
        this.formConfig[k] = new FormControl(null, required ? Validators.required : null);
      });
    this.formConfig.vd_id = new FormControl(null, Validators.required);
  }

  onSubmit() {
    // console.log('eruption submit');
    let ed = new Eruption(this.form.value);
    Object.keys(Eruption.schema).forEach(k => {
      if (ed[k] == 'null') {
        ed[k] = '';
      }
    });

    // FIXME: number and code is currently randomize, this should never be the thing
    ed.ed_num = `${Math.floor(Math.random() * 10000)}`;
    ed.ed_code = `${this.volcanoList.find(v => v.$key == ed.vd_id)['vd_num'] || 'none'}_${ed.ed_num}`;
    console.log(ed);

    if (this.eruptionService.validateInput(ed)) {
      this.confirmService.openConfirm('Are your sure to create this eruption?', 'Upload eruption',
        () => {
          // yesy
          this.eruptionService.createEruption(ed, (ref: firebase.database.Reference) => {
            console.log('here');
            console.log(ref);
            // TODO: put the link in the future
            this.alertService.openAlert(`Eruption created, please access it from volcano page.`, `Input completed`);
            this.resetForm();
          });
        },
        () => {
          // no
        }
      );
    }
  };


  retrievePrerequisites() {
    console.log('load for eruption');
    // this.volcanoService.getVolcanosList()
    this.loading = true;
    this.volcanoService.getVolcanosListWithLocal()
      .subscribe(
        (vds: Volcano[]) => {
          this.volcanoList = vds.map(v => new Volcano(v));
          this.loading = false;
          // console.log(this.volcanoList);
        }
      );


  }

  resetForm() {
    this.form.reset();
    this.form.controls['ed_loaddate'].setValue(BaseModel.currentDate());

  }
}
