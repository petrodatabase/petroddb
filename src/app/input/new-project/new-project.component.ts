import {Component, Input, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {Project} from "../../models/project";
import {Reference} from "../../models/reference";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../services/database-services/user.service";
import {User} from "../../models/user";
import {MdDialog, MdListOption} from "@angular/material";
import {ConfirmService} from "../../components/confirm-dialog/confirm.service";
import {ProjectService} from "../../services/database-services/project.service";

import * as firebase from 'firebase';
import {NewProjectListComponent} from "./new-project-list/new-project-list.component";
import {AlertService} from "../../components/alert-dialog/alert.service";
import {DateTimeFormatService} from "../../services/date-time-format.service";
import {BaseModel, ModelPermission} from "../../models/base-model";
import {AuthService} from "../../auth/auth.service";

import {INgxSelectOption} from 'ngx-select-ex';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.css']
})
export class NewProjectComponent implements OnInit {
  schema: any = Project.schema;
  reference : any = Reference.schema;
  form: FormGroup;
  formConfig: any;
  formFilterList: string[];
  formIncludeFields: any[];

  piList: User[];
  userList: User[];
  projectList: Project[];

  userlisttoString: string[];

  isPrivate: boolean = false;
  isReadonlyAccess: boolean = true;
  isPublicAccess: boolean = false;
  isCustomized: boolean = false;
  accessType : string;

  authorFull: any = [];
  authorRead: any =[];
  ngxDisabled = false;

  @ViewChild('proj_autho_set')
  proj_autho_set: any;

  @ViewChild('proj_autho_read_only_set')
  proj_autho_read_only_set: any;

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
      this.retrievePrerequisites();
    }
  }


  constructor(
    private userService: UserService,
    private authService: AuthService,
    private projectService: ProjectService,
    private confirmService: ConfirmService,
    private alertService: AlertService,
    private datetimeService: DateTimeFormatService,
    private dialog: MdDialog,
  ) {
    this.initFormConfig();
  }

  ngOnInit() {
    this.form = new FormGroup(this.formConfig);
    this.formClear();

  }

  updateAccess(selected){
    this.isPrivate = false;
    this.isReadonlyAccess = false;
    this.isPublicAccess = false;
    this.isCustomized = false;
    selected = true;
    // clear customized
    this.authorFull =[];
    this.authorRead = [];

  }

  onSubmit() {
    if (this.projectList.map(v => v.proj_name).includes(this.form.value['proj_name'])) {
      this.alertService.openAlert('Project name already exits!',  'ERROR: upload project');
      return;
    }
    let proj = new Project(this.form.value);
    Object.keys(Project.schema).forEach(k => {
      if (proj[k] == 'null') {
        proj[k] = '';
      }
    });

    // FIXME: workaround to find the $key based on displayedName, find way to attach selectedOptions to user.$key
    // FIXME: this workaround is very inefficient (n^2) when user list is large
    // FIXME: also displayed name can also be duplicated, this give a leak for security

    switch(true){
      case this.isPrivate:
        proj.accessType="isPrivate";
        this.emptyAuthor(proj);
        break;
      case this.isReadonlyAccess:
        proj.accessType="isReadonlyAccess";
        this.emptyAuthor(proj);
        break;
      case this.isPublicAccess:
        proj.accessType="isPublicAccess";
        this.emptyAuthor(proj);
        break;
      case this.isCustomized:
        proj.accessType="isCustomized";
        let proj_autho_read_only = this.authorRead.map(v => this.userList.find(us => us.displayName == v));
        proj.proj_autho_read_only = proj_autho_read_only;

        let proj_autho = this.authorFull.map(v => this.userList.find(us => us.displayName == v));
        proj.proj_autho = proj_autho;
        break;
    }

    console.log(proj);
    // NOTE: FIREBASE
	//
    // if (this.projectService.validateInput(proj)) {
    //   this.confirmService.openConfirm('are you sure you would like to create this project?', 'Uploading project',
    //     () => {
    //       // yes
    //       this.projectService.createProject(proj, (ref: firebase.database.ThenableReference) => {
    //         // do some thing, show popup
    //         proj.$key = ref.key;
    //         this.openNewProjectList([proj]);
    //       });
    //       this.formClear();
	//
    //     },
    //     () => {
    //       // no
    //     },
    //   );
    // }

    if (this.projectService.validateInput(proj)) {
      this.confirmService.openConfirm('are you sure you would like to create this project?', 'Uploading project',
        () => {
          // yes
          this.projectService.createProjectMongo(proj, () => {
            this.openNewProjectList([proj]);
          });
          this.formClear();
        },
        () => {
          // no
        },
      );
    }
  }

  openNewProjectList(projects: Project[]) {
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
        projects: projects
      },
    };
    let dialogRef = this.dialog.open(NewProjectListComponent, config);
    dialogRef.afterClosed().subscribe(
      (result: any ) => {
        console.log(result);
      }
    );
  }

  formClear() {
    this.form.reset();
    if (!!this.mdSelectOptions) {
      this.mdSelectOptions.forEach((v: MdListOption) => {
        if (v.selected) {
          v.toggle();
        }
      });
    }
    this.form.controls['proj_date'].setValue(BaseModel.currentDate());
  }

  retrievePrerequisites() {
    console.log('Load data for project');
    this.userService.getUsersList({})
      .subscribe(
        (uss: User[]) => {
          this.userList = uss.map(v => new User(v));
          this.userlisttoString = uss.map(v => v.displayName);
          this.piList = this.userList.filter(v => v.us_is_pi);
        }
      );

    this.projectService.getProjectsListMongo({})
      .subscribe(
        (projs: Project[]) => {
          this.projectList = projs.map(v => new Project(v))
            .filter(proj =>
              proj.authenticatePermission(this.authService.currentUserId) != ModelPermission.INVISIBLE
            );
        }
      )
  }


  initFormConfig() {
    this.formConfig = {};
    this.formIncludeFields = [];
    this.formFilterList = ['_id', '$key', 'fireBaseKey', 'proj_sp_ids', 'proj_data', 'proj_contact',
      'img', 'linkf_list', 'cb_list', 'proj_data', 'proj_pi', 'proj_autho', 'proj_contact', 'proj_creator','proj_autho_read_only','accessType'];
    Object.keys(Project.schema)
      .filter(k => !this.formFilterList.includes(k))
      .forEach(k => {
        let required = typeof(Project.schema[k].required) !== 'undefined' && Project.schema[k].required;
        this.formIncludeFields.push(k);
        this.formConfig[k] = new FormControl(null, required?Validators.required:null);
      });

    this.formConfig.proj_pi = new FormControl(null, Validators.required);
    // this.formConfig.proj_contact = new FormControl(null);
    this.formConfig.proj_creator = new FormControl(null);
  }

  emptyAuthor(proj){
    this.proj_autho_set.selectedOptions.selected.length =0;
    this.proj_autho_read_only_set.selectedOptions.selected.length =0;
    proj.proj_autho.length =0 ;
    proj.proj_autho_read_only.length = 0;
  }
}
