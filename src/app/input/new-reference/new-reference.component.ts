import {Component, Input, OnInit} from '@angular/core';
import {Publication} from "../../models/publication";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Eruption} from "../../models/eruption";
import {UserService} from "../../services/database-services/user.service";
import {AuthService} from "../../auth/auth.service";
import {ConfirmService} from "../../components/confirm-dialog/confirm.service";
import {AlertService} from "../../components/alert-dialog/alert.service";
import {DateTimeFormatService} from "../../services/date-time-format.service";
import {MdDialog} from "@angular/material";
import {PublicationService} from "../../services/database-services/publication.service";
import {Http} from "@angular/http";

import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {BaseModel} from "../../models/base-model";

@Component({
  selector: 'app-new-reference',
  templateUrl: './new-reference.component.html',
  styleUrls: ['./new-reference.component.css']
})
export class NewReferenceComponent implements OnInit {
  schema: any = Publication.schema;
  form: FormGroup;
  formConfig: any;
  formFilterList: string[];
  formIncludeFields: any[];

  pubList: Publication[];

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

  constructor(private userService: UserService,
              private authService: AuthService,
              private publicationService: PublicationService,
              private confirmService: ConfirmService,
              private alertService: AlertService,
              private datetimeService: DateTimeFormatService,
              private dialog: MdDialog,
              private http: Http,) {
    this.initFormConfig();
  }

  ngOnInit() {
    this.form = new FormGroup(this.formConfig);
    // this.retrievePrerequisites();
    this.formClear();
  }

  initFormConfig() {
    this.formConfig = {};
    this.formIncludeFields = [];
    // this.formFilterList = ['_id', 'vd_id', 'cb_ids'];
    this.formFilterList = ['$key', 'ref_id',
      "cb_auth",
      "cb_title",
      'cb_journ',
      'cb_pub',
      'cb_isbn'];
    // let _this = this;
    Object.keys(Publication.schema)
      .filter(k => !this.formFilterList.includes(k))
      .forEach(k => {
        let required = typeof(Publication.schema[k].required) !== 'undefined' && Publication.schema[k].required;
        this.formIncludeFields.push(k);
        this.formConfig[k] = new FormControl(null, required ? Validators.required : null);
      });
    this.formConfig.cb_auth = new FormControl(null, Publication.schema.cb_auth['required'] ? Validators.required : null);
    this.formConfig.cb_title = new FormControl(null, Publication.schema.cb_title['required'] ? Validators.required : null);
    this.formConfig.cb_journ = new FormControl(null, Publication.schema.cb_journ['required'] ? Validators.required : null);
    this.formConfig.cb_pub = new FormControl(null, Publication.schema.cb_pub['required'] ? Validators.required : null);
    this.formConfig.cb_isbn = new FormControl(null, Publication.schema.cb_isbn['required'] ? Validators.required : null);

  }

  formClear() {
    this.form.reset();
    this.form.controls['cb_loaddate'].setValue(BaseModel.currentDate());
  }

  onSubmit() {
    let pub = new Publication(this.form.value);
    Object.keys(Publication.schema).forEach(k => {
      if (pub[k] == 'null') {
        pub[k] = '';
      }
    });

    console.log(pub);

    if (this.publicationService.validateInput(pub)) {
      this.confirmService.openConfirm('are you sure you would like to create this publication?', 'Uploading publication',
        () => {
          // yes
          this.publicationService.createPublication(pub, (ref: firebase.database.ThenableReference) => {
            // do some thing, show popup
            pub.$key = ref.key;
            this.onPublicationsUploaded([pub]);
          });
          this.formClear();
        },
        () => {
          // no
        },
      );
    }
  }

  onPublicationsUploaded([pub]) {
    this.alertService.openAlert(`Publication Uploaded success`, `Uploading success`);
  }

  // for publications transfer only
  // oldCbs: any;
  // newCbs: Publication[];
  // transferPubs() {
  // 	console.log('start transfer data');
  // 	this.http.get('/assets/json/cb.json')
  // 		.map((res) => res.text())
  // 		// .catch((error: any) => console.log(error))
  // 		.subscribe(
  // 			data => {
  // 				this.oldCbs = JSON.parse(data);
  // 				console.log(this.oldCbs);
  // 				// console.log(JSON.parse(data));
  // 				// let nochristina = this.oldCbs.filter(v => v.cc_id_load != '199');
  // 				// console.log(nochristina);
  // 				this.newCbs = this.oldCbs.map(v => {
  // 					let pub = new Publication(v);
  // 					return pub;
  // 				});
  //
  // 				console.log(this.newCbs);
  // 				this.publicationService.createWholePubs(this.newCbs)
  // 					.then(() => {
  // 						console.log('done');
  // 					})
  // 			},
  // 			error => {
  // 				console.log(error);
  // 			}
  // 		);
  // }

  retrievePrerequisites() {
    console.log('load for reference');
    this.publicationService.getPublicationsList()
      .subscribe(
        (pubs: Publication[]) => {
          this.pubList = pubs.map(v => new Publication(v));
          this.setAutoComplete(this.pubList);
        }
      )
  }

  autoCompleteKeys: string[] = [];
  autoCompleteData: any = {
    cb_auth: [],
    cb_title: [],
    cb_journ: [],
    cb_pub: [],
    cb_isbn: [],
  };
  autoCompleteFilterData: any = {
    cb_auth: [],
    cb_title: [],
    cb_journ: [],
    cb_pub: [],
    cb_isbn: [],
  };

  setAutoComplete(pubs: Publication[]) {
    this.autoCompleteKeys = Object.keys(this.autoCompleteData);
    pubs.forEach(p => {
      this.autoCompleteKeys.forEach(k => {
        if (p[k] != null && p[k] != '' && p[k] != 'null') {
          this.autoCompleteData[k].push(p[k]);
          this.autoCompleteFilterData[k].push(p[k]);
        }
      });
    });
  }

  inputChange(k) {
    // console.log(this.form.value);
    // let val = this.form.value[k];
    this.autoCompleteFilterData[k] = this.autoCompleteData[k].filter(v => v.toLowerCase().indexOf(this.form.value[k].toLowerCase()) === 0);
    // console.log(this.autoCompleteFilterData[k]);
  }

  /*
	 this.filteredStates = this.stateCtrl.valueChanges
	 .startWith(null)
	 .map(state => state ? this.filterStates(state) : this.states.slice());
	 }

	 filterStates(name: string) {
	 return this.states.filter(state =>
	 state.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
	 }
	 */

}
