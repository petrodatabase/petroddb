import {Injectable} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2/database";
import {AngularFireAuth} from "angularfire2/auth";
import {BaseService} from "../base.service";
import {Workspace} from "../../models/workspace";
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Globals} from '../../globals';
import {filterObjectsMultipleQuery, normalizeGetObjectList} from '../../../utils/dataConvertHelper';
import {AuthService} from '../../auth/auth.service';

@Injectable()
export class WorkspaceService extends BaseService {
  globals: Globals;

	public basePath: string = '/workspaces';

	constructor(
		private afDB: AngularFireDatabase,
		private afAuth: AngularFireAuth,
    private http: HttpClient,
    private authService: AuthService
	) {
		super();
		this.workspaces = this.afDB.list(this.basePath);
		this.workspace = this.afDB.object(this.basePath);
    this.globals = new Globals();
	}

	workspaces: FirebaseListObservable<Workspace[]> = null;
	workspace: FirebaseObjectObservable<Workspace> = null;

	getWorkspacesList(sp_id: string, query: any = {}): FirebaseListObservable<Workspace[]> {
		this.workspaces = this.afDB.list(`${this.basePath}/${sp_id}`, {
			query: query
		});
		return this.workspaces;
	}

	getNewId(sp_id: string): string {
		return this.afDB.database.ref(`${this.basePath}/sp_id`).push().key;
	}

	getWorkspace(sp_id: string, key: string): FirebaseObjectObservable<Workspace> {
		const itemPath  = `${this.basePath}/${sp_id}/${key}`;
		this.workspace = this.afDB.object(itemPath);
		return this.workspace;
	}

	createWorkspace(ws: Workspace): firebase.Promise<any> {
		// return this.workspaces.push(ws.toFirebaseJsonObject(ws, Workspace.schema))
		let updates = {};
		updates[ws.$key] = ws.toFirebaseJsonObject(ws, Workspace.schema);
		console.log('THe update');
		console.log(updates);
		return this.afDB.database.ref(`${this.basePath}/${ws.sp_id}`).update(updates)
			.catch(error => this.handleError(error));
	}

	updateWorkspace(sp_id: string, key: string, value: any): firebase.Promise<any> {
		return this.afDB.list(`${this.basePath}/${sp_id}`).update(key, value)
			.catch(error => this.handleError(error));
	}


	deleteWorkspace(sp_id: string, key: string): firebase.Promise<any> {
		return this.afDB.list(`${this.basePath}/${sp_id}`).remove(key)
			.catch(error => this.handleError(error));
	}

	deleteAll(): void {
		this.workspaces.remove()
			.catch(error => this.handleError(error));
	}


  // NOTE: This code below is for MONGO
  createWorkspaceMongo(workspace: Workspace) {
    let uri = this.globals.serverHost +'/workspaces/add';
    let obj = workspace.toFirebaseJsonObject(workspace, Workspace.schema);
    this
      .http
      .post(uri, obj)
      .subscribe(res =>
        console.log(res));
  }

  updateWorkspaceMongo(workspace: Workspace) {

    let obj = workspace.toFirebaseJsonObject(workspace, Workspace.schema);
    let uri = this.globals.serverHost +'/workspaces/update/' + workspace.$key;
    this
      .http
      .put(uri, obj)
      .subscribe(res =>
        console.log(res));
  }


  getWorkspacesListMongo(query: any = {}){
    const uri = this.globals.serverHost +'/workspaces';
    let token = this.authService.IDToken;

    const requestOptions = {
      headers: new HttpHeaders({token: token}),
    };
    return this
      .http
      .get(uri, requestOptions)
      .map(res => {
        return normalizeGetObjectList(filterObjectsMultipleQuery(res,query));
      });
  }

  deleteWorkspaceMongo(id) {
    const uri = this.globals.serverHost +'/workspaces/delete/' + id;
    return this
      .http
      .get(uri)
      .subscribe(res => {
        return res;
      });
  }
}
