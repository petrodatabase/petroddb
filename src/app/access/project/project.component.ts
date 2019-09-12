import {Component, OnDestroy, OnInit, ViewChildren, ViewEncapsulation, QueryList, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {BaseComponent} from "../../components/base/base.component";
import {LoadComponent} from "../../components/load/load.component";
import {LoadingService} from "../../services/loading.service";
import {Project} from "../../models/project";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ProjectService} from "../../services/database-services/project.service";
import {ConfirmService} from "../../components/confirm-dialog/confirm.service";
import {AlertService} from "../../components/alert-dialog/alert.service";
import {Sample} from "../../models/sample";
import {UserService} from "../../services/database-services/user.service";
import {SampleService} from "../../services/database-services/sample.service";
import {User} from "../../models/user";
import {AuthService} from "../../auth/auth.service";
import {ModelPermission} from "../../models/base-model";
import {MdListOption} from "@angular/material";
import {Reference} from "../../models/reference";
import {Title} from "@angular/platform-browser";
import set = Reflect.set;

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ProjectComponent implements OnInit, OnDestroy {

  subscriber: any;
  id: string;

  permission: ModelPermission;
  modelPermission = ModelPermission;

  proj: Project;
  isPrivate: boolean = false;
  isReadonlyAccess: boolean = false;
  isPublicAccess: boolean = false;
  isCustomized: boolean = false;

  accessType : string;

  schema: any = Project.schema;
  reference : any = Reference.schema;
  sampleList: Sample[];
  userList: User[];
  piList: User[];

  userlisttoString: string[];
  authorFull: any = [];
  authorRead: any = [];

  // @ViewChildren(MdListOption)
  // mdSelectOptions: QueryList<MdListOption>;

  @ViewChildren('proj_autho_set_options')
  proj_autho_set_options: QueryList<MdListOption>;

  @ViewChildren('proj_autho_read_only_set_options')
  proj_autho_read_only_set_options: QueryList<MdListOption>;

  @ViewChild('proj_autho_set')
  proj_autho_set: any;

  @ViewChild('proj_autho_read_only_set')
  proj_autho_read_only_set: any;

  isEditting: boolean = false;
  // isPI_Creator_Contact: boolean = false;
  constructor(private activatedRoute: ActivatedRoute,
              private authService: AuthService,
              private loadingService: LoadingService,
              private confirmService: ConfirmService,
              private alertService: AlertService,
              private router: Router,
              private projectService: ProjectService,
              private userService: UserService,
              private sampleService: SampleService,
              private titleService: Title ,) {
    this.loadingService.handleLoading(true);
  }

  ngOnInit() {
    this.subscriber = this.activatedRoute.params.subscribe(params => {
      // this.id = +params['id']; // (+) converts string 'id' to a number
      this.id = params['id']; // (+) converts string 'id' to a number
      this.retrieveAllUser();
      this.retrieveProject(this.id);

    });
  }

  get editable(): boolean {
    if (!this.proj) return false;
    if (!this.authService.authenticated) return false;
    else {
      // if (this.authService.currentUserId == this.proj.proj_creator.$key) return true;
      // if (this.authService.currentUserId == this.proj.proj_pi.$key) return true;
      // if (this.authService.currentUserId == this.proj.proj_contact.$key) return true;
      // if (this.proj.proj_autho.map(v => v.$key).includes(this.authService.currentUserId)) return true;
      if (this.permission == ModelPermission.WRITE) return true;
      else return false;
    }
  }

  // get edit():boolean{
  //   return !!this.permission && this.permission == ModelPermission.WRITE;
  // }

  get isPI_Creator_Contact(): boolean{
    if (!this.proj) return false;
    if (!this.authService.authenticated) return false;
    else {
      if (this.authService.currentUserId == this.proj.proj_creator.$key) return true;
      if (this.authService.currentUserId == this.proj.proj_pi.$key) return true;
      if (this.authService.currentUserId == this.proj.proj_contact.$key) return true;
      else return false;
    }
  }

  updateAccess(selected){
    this.isPrivate = false;
    this.isReadonlyAccess = false;
    this.isPublicAccess = false;
    this.isCustomized = false;
    selected = true;
    this.emptyAuthor();
  }

  public setTitle( newTitle: string) {
    this.titleService.setTitle( newTitle );
  }

  retrieveProject(id: string): any {

    this.projectService.getProjectMongo(id)
      .subscribe(
        (proj: any) => {
          if ("$value" in proj && proj['$value'] == null) {
            // not found!
            this.alertService.openAlert(`404 Data not found`, `Retrieval Error`,
              () => {
                // return to access
                this.router.navigate(['/access']);
              }
            );
            return;
          }
          this.proj = new Project(proj);
          this.setTitle(this.proj.proj_name);

          // retrieve access type
          // new version : use accessType

          switch(this.proj.accessType){
            case 'isPrivate':
              this.isPrivate =true;
              break;
            case 'isReadonlyAccess':
              this.isReadonlyAccess = true ;
              break;
            case 'isPublicAccess':
              this.isPublicAccess = true ;
              break;
            case 'isCustomized':
              this.isCustomized = true ;
              break;

            //old version , no have access type -> change to private/customized
            default:
              console.log('default');
              if (this.proj.proj_autho.length>0){
                this.isCustomized=true;
              }
              else{
              this.isPrivate = true;
              }
              break;
          }

          this.permission = this.proj.authenticatePermission(this.authService.currentUserId);
          if (this.permission == ModelPermission.INVISIBLE) {
            this.alertService.openAlert(`User Unauthorized!`, 'Permission Denied', () => {
              // return to home
              this.router.navigate(['/']);
            })
          }

          // retrieve pi
          if (proj.proj_pi && proj.proj_pi != '' && proj.proj_pi != null) {
            this.userService.getUser(proj.proj_pi)
              .subscribe(
                us => this.proj.proj_pi = new User(us)
              )
          }

          // retrieve creator
          if (proj.proj_creator && proj.proj_creator != '' && proj.proj_creator != null) {
            this.userService.getUser(proj.proj_creator)
              .subscribe(
                us => this.proj.proj_creator = new User(us)
              )

          }

          // retrieve contact
          // if (proj.proj_contact && proj.proj_contact != '' && proj.proj_contact != null) {
          //   this.userService.getUser(proj.proj_contact)
          //     .subscribe(
          //       us => this.proj.proj_contact = new User(us)
          //     )
          // }

          // retrieve autho list
          if (this.proj.proj_autho.length > 0) {

            for (let i = 0; i < this.proj.proj_autho.length; i++) {
              this.userService.getUser(this.proj.proj_autho[i].$key)
                .subscribe(
                  (us: User) => {this.proj.proj_autho[i] = new User(us);
                  this.authorFull= [...this.authorFull,this.proj.proj_autho[i].displayName];
                  }
                )
            }
          }


          // retrieve autho_readonly list
          if (this.proj.proj_autho_read_only.length > 0) {

            for (let i = 0; i < this.proj.proj_autho_read_only.length; i++) {
              this.userService.getUser(this.proj.proj_autho_read_only[i].$key)
                .subscribe(
                  (us: User) => {this.proj.proj_autho_read_only[i] = new User(us);
                    this.authorRead= [...this.authorRead,this.proj.proj_autho_read_only[i].displayName];
                  }
                )
            }

          }

          this.retrieveSamples(this.proj);

          // do whatever next

        },
        error => {
          console.log(error);
          this.alertService.openAlert(`Error When retrieving project data`, `Retrieval Error`);
        }
      );

  }

  // retrieveSamples(proj: Project): any {
  //   this.sampleService.getSamplesList({
  //     orderByChild: 'proj',
  //     equalTo: proj.fireBaseKey,
  //   }).subscribe(
  //     (sps: Sample[]) => {
  //       this.sampleList = sps.map(v => new Sample(v));
  //     }
  //   );
  // }

  retrieveSamples(proj: Project): any {
    this.sampleService.getSamplesListMongo(
      {
              proj: [proj.$key,proj.fireBaseKey]
            }
    ).subscribe(
      (sps: Sample[]) => {
        this.sampleList = sps.map(v => new Sample(v));
      }
    );
  }

  retrieveAllUser(): any {
    this.userService.getUsersList()
      .subscribe(
        (uss: User[]) => {
          this.userList = uss.map(u => new User(u));
          this.userlisttoString = uss.map(v => v.displayName);
          this.piList = this.userList.filter(v => v.us_is_pi);
        }
      )
  }

  ngOnDestroy() {
    this.subscriber.unsubscribe();
    this.setTitle("Volcano Petrology");
  }


  toggleEditting() {
    this.isEditting = !this.isEditting;
  }

  validateChange() {
    if (this.proj.proj_name == '') return false;
    if (this.proj.proj_date == '') return false;
    else return true;
  }

  updateChange() {
    if (!this.validateChange()) {
      this.alertService.openAlert(`Invalid input, please change`, `Invalid Input`);
      return;
    }
    if (this.projectService.validateInput(this.proj)) {
      this.confirmService.openConfirm(`Are you sure to update theses changes`, `Update Change`,
        () => {
          // yesy

          switch(true){
            case this.isPrivate:
              this.proj.accessType="isPrivate";
              this.emptyAuthor();
              console.log(this.proj_autho_set.selectedOptions.selected);
              console.log(this.proj_autho_read_only_set.selectedOptions.selected);
              break;
            case this.isReadonlyAccess:
              this.proj.accessType="isReadonlyAccess";
              this.emptyAuthor();
              break;
            case this.isPublicAccess:
              this.proj.accessType="isPublicAccess";
              this.emptyAuthor();
              break;
            case this.isCustomized:
              this.proj.accessType="isCustomized";
              let proj_autho_read_only = this.authorRead.map(v => this.userList.find(us => us.displayName == v));
              this.proj.proj_autho_read_only = proj_autho_read_only;

              let proj_autho = this.authorFull.map(v => this.userList.find(us => us.displayName == v));
              this.proj.proj_autho = proj_autho;
              break;
          }

          this.loadingService.handleLoading(true);
          this.projectService.updateProjectMongo(this.proj.$key, this.proj)
            .then(() => {
              this.loadingService.handleLoading(false);
              this.toggleEditting();
            })
        },
        () => {
          // no
        }
      );
    }
  }

  emptyAuthor(){
    this.authorFull =[];
    this.authorRead = [];
    this.proj.proj_autho.length = 0;
    this.proj.proj_autho_read_only.length =0;
  }

  // FIXME: cannot get img, wks, linkf, pub list
  notNullSample(sp: Sample):boolean{
    if(sp.img.length>0 || sp.workspaces.length>0 || sp.linkf_list.length>0 || sp.publications.length >0 ){

      return true;
    }
    else{
      return false;
    }
  }

  // FIXME: TEMPORARY DELETE
  deleteNullSamples(sps: Sample[]){
    this.confirmService.openConfirm(`Are you sure to delete all null samples`, 'Delete Files',
      () => {
      for(var i =0; i < sps.length; i++){
        if(!this.notNullSample(sps[i])){
              let sample_key = sps[i].$key;
              this.sampleService.deleteSampleFirebase(sample_key);
        }
      }
    });
  }
}
