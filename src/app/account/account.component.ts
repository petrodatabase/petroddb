import {Component, OnInit, OnDestroy} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {UserService} from "../services/database-services/user.service";
import {LoadingService} from "../services/loading.service";
import {AlertService} from "../components/alert-dialog/alert.service";
import {ConfirmService} from "../components/confirm-dialog/confirm.service";
import {User} from "../models/user";
import {Project} from "../models/project";
import {ProjectService} from "../services/database-services/project.service";
import {ModelPermission} from "../models/base-model";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit,OnDestroy {

  user: User;
  isEditting: boolean;

  projectList: Project[];
	projectLoading: boolean = true;

  constructor(private authService: AuthService,
              private userService: UserService,
              private loadingService: LoadingService,
              private projectService: ProjectService,
              private alertService: AlertService,
              private confirmService: ConfirmService,
              private titleService: Title) {
    this.user = null;
    this.isEditting = false;
    this.projectList = null;
  }

  ngOnInit() {
    this.userService.getCurrentUser()
      .subscribe(
        (us: User) => {
          this.user = new User(us);
          this.loadingService.handleLoading(false);
        },
        (error) => {
          console.log(error);
          this.alertService.openAlert(`User Error, please contact system admin`, `Error User`);
        }
      );

    this.setTitle("My Account");
  }

  ngOnDestroy(){
    this.setTitle("Volcano Petrology");
  }

  public setTitle( newTitle: string) {
    this.titleService.setTitle( newTitle );
  }


  toggleEditting() {
    this.isEditting = !this.isEditting;
  }

  validateChange(): boolean | string {
    if (this.user.us_family == '') return 'Family name must not be empty';
    if (this.user.us_first == '') return 'First name must not be empty';
    if (this.user.email == '') return 'Email must not be empty';
    else return true;
  }

  updateChange() {
    let validateChanges = this.validateChange();
    if (typeof validateChanges == "string") {
      this.alertService.openAlert(`Invalid input: ${validateChanges}`, `Invalid Input`);
      return;
    }
    this.confirmService.openConfirm(`Are you sure you would like to update these changes?`, `Update Change`,
      () => {
        // yesy
        this.loadingService.handleLoading(true);
        this.userService.updateUser(this.user.$key, this.user)
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

  getProjectList() {

		this.projectService.getProjectsListMongo()
			.subscribe(
				(projects: Project[]) => {
					// console.log(projects);
					this.projectList = projects.map(v => new Project(v))
						.filter(proj =>
							proj.authenticatePermission(this.authService.currentUserId) == ModelPermission.WRITE
						);
          // console.log(this.projectList);

          this.projectLoading  = false;

				},
				error => {
					console.log(error);
				}
			);
	}

}
