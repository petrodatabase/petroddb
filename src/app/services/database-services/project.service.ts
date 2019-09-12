import {Injectable} from '@angular/core';
import {BaseService} from "../base.service";
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2/database";
import {AngularFireAuth} from "angularfire2/auth";
import {Project} from "../../models/project";
import {AlertService} from "../../components/alert-dialog/alert.service";
import {DateTimeFormatService} from "../date-time-format.service";
import {EmptyObservable} from 'rxjs/observable/EmptyObservable';
import {Observable} from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {normalizeGetObjectList, normalizeGetObject, filterObjects, isFirebase} from '../../../utils/dataConvertHelper';
import 'rxjs/add/observable/from';
import {AuthService} from '../../auth/auth.service';

@Injectable()
export class ProjectService extends BaseService {
	public basePath: string = '/projects';
	constructor(
		private afDB: AngularFireDatabase,
		private afAuth: AngularFireAuth,
		private datetimeService: DateTimeFormatService,
		private alertService: AlertService,
    private http: HttpClient,
    private authService: AuthService,
	) {
		super();
		this.projects = this.afDB.list(this.basePath);
		this.project = this.afDB.object(this.basePath);

	}

	projects: FirebaseListObservable<Project[]> = null;
	project: FirebaseObjectObservable<Project> = null;

  // NOTE: This code below is for Firebase Version
	getProjectsListFirebase(query: any = {}): Observable<Project[]> {
		this.projects = this.afDB.list(this.basePath, {
			query: query
		});
		return this.projects;
	}

	getProjectFirebase(key: string): FirebaseObjectObservable<Project> {
		const itemPath  = `${this.basePath}/${key}`;
		this.project = this.afDB.object(itemPath);
		return this.project;
	}

	createProjectFirebase(proj: Project, callback: any = null): firebase.database.ThenableReference {
		return this.projects.push(proj.toFirebaseJsonObject(proj, Project.schema))
			.then((ref: firebase.database.ThenableReference) => {
				if (callback) {
					callback(ref);
				}
			})
			.catch(error => this.handleError(error));
	}

	updateProjectFirebase(key: string, proj: Project): firebase.Promise<any> {
		return this.projects.update(key, proj.toFirebaseJsonObject())
			.catch(error => this.handleError(error));
	}


	deleteProjectFirebase(key: string): void {
		this.projects.remove(key)
			.catch(error => this.handleError(error));
	}

	deleteAllFirebase(): void {
		this.projects.remove()
			.catch(error => this.handleError(error));
	}

	// NOTE: THIS CODE BELOW IS FOR MONGODB VERSION

  getProjectsListMongo(singleQuery: any = {}){
    // const uri = 'http://localhost:4000/projects';
    const uri = this.globals.serverHost + '/projects';
    // get auth token
    let token = this.authService.IDToken;
    const requestOptions = {
      headers: new HttpHeaders({user_id: this.authService.currentUserId, token: token}),
    };
    // retrieve
    return this
      .http
      .get(uri, requestOptions)
      .map(res => {
        return normalizeGetObjectList(filterObjects(res,singleQuery));
      });
  }

   getProjectMongo(id: string) {
	  // NOTE: If this is a FirebaseProject, get project detail using Firebase function
    let mongoKey = id;
    if (isFirebase(id)){
      return this.getProjectsListMongo({fireBaseKey:id});
    }

    // const uri = 'http://localhost:4000/projects/edit/' + mongoKey;
     const uri = this.globals.serverHost+ '/projects/edit/' + mongoKey;
    return this
      .http
      .get(uri)
      .map(res => {
        return normalizeGetObject(res);
      });
  }

  updateProjectMongo(id: string, proj: Project) {
    return new Promise((resolve, reject) => {
      const raw = proj.toFirebaseJsonObject(proj, Project.schema);
      // const uri = 'http://localhost:4000/projects/update/' + id;
      const uri = this.globals.serverHost+ '/projects/update/' + id;

      this
        .http
        .put(uri, raw).subscribe(res => {
          if (res['status'] === 200) {
            resolve("SUCCESS")
          } else {
            reject("FAILURE")
          }
        });
    });
  }

  createProjectMongo(proj: Project, callback: any = null) {
    // const uri = 'http://localhost:4000/projects/add';
    const uri = this.globals.serverHost+ '/projects/add';

    const obj = proj.toFirebaseJsonObject(proj, Project.schema);
    this
      .http
      .post(uri, obj)
      .subscribe(res =>
        console.log(res));
    callback();
  }

  // TODO: IMPLEMENT DELETE

  validateInput(proj: Project) {
		if (proj.proj_date != '' && !this.datetimeService.validate(proj.proj_date)) {
			this.alertService.openAlert(`Date time format must be DD/MM/YYYY`, `Invalid Input`);
			return false;
		}
		if (proj.proj_name == '' || !proj.proj_name || proj.proj_name == 'null') {
			this.alertService.openAlert(`Project name must not be empty`, `Invalid Input`);
			return false;
		}

		else return true;
	}

}
