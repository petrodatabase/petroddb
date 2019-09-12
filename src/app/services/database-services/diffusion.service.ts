import {Injectable} from '@angular/core';
import {BaseService} from "../base.service";
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2/database";
import {AngularFireAuth} from "angularfire2/auth";
import {Diffusion} from "../../models/diffusion";
import {Analysis} from '../../models/analysis';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {filterObjectsMultipleQuery, normalizeGetObjectList} from '../../../utils/dataConvertHelper';
import {AuthService} from '../../auth/auth.service';

@Injectable()
export class DiffusionService extends BaseService {
	public basePath: string = '/diffusions';

	constructor(private afDB: AngularFireDatabase,
				private afAuth: AngularFireAuth,
              private http: HttpClient,
              private authService: AuthService) {
		super();
		this.diffusions = this.afDB.list(this.basePath);
		this.diffusion = this.afDB.object(this.basePath);
	}

	diffusions: FirebaseListObservable<Diffusion[]> = null;
	diffusion: FirebaseObjectObservable<Diffusion> = null;

	getDiffusionsList(parent_id: string, query: any = {}): FirebaseListObservable<Diffusion[]> {
		// this.diffusions = this.afDB.list(this.basePath, {
		// 	query: query
		// });
		// return this.diffusions;
		return this.afDB.list(`${this.basePath}/${parent_id}`, {query: query});
	}

	getDiffusion(parent_id: string, key: string): FirebaseObjectObservable<Diffusion> {
		const itemPath = `${this.basePath}/${parent_id}/${key}`;
		this.diffusion = this.afDB.object(itemPath);
		return this.diffusion;
	}

	createDiffusion(parent_id: string, dif: Diffusion, callback: any = null): firebase.database.ThenableReference {
		return this.afDB.database.ref(`${this.basePath}/${parent_id}`).push(dif.toFirebaseJsonObject(dif, Diffusion.schema))
			.then((ref) => {
				if (callback) {
					callback(ref);
				}
			})
			.catch(error => this.handleError(error));
	}

	updateDiffusion(parent_id: string, key: string, value: any, callback: any = null): firebase.Promise<any> {
		return this.afDB.database.ref(`${this.basePath}/${parent_id}/${key}`).update(value)
			.then((ref) => {
				if (callback) {
					callback(ref);
				}
			})
			.catch(error => this.handleError(error));
	}

	/** Update info take off the data_list to reduce traffic */
	updateInfoDiffusionList(parent_id: string, difs: Diffusion[]): any {
		difs.forEach((dif: Diffusion) => {
			let raw = (new Diffusion(dif)).toFirebaseJsonObject();
			delete raw['data_list'];
			this.afDB.database.ref(`${this.basePath}/${parent_id}/${dif.$key}`).update(raw)
				.catch(error => this.handleError(error));
		});
	}


	deleteDiffusion(parent_id: string, key: string): any {
		return this.afDB.database.ref(`${this.basePath}/${parent_id}/${key}`).remove()
			.catch(error => this.handleError(error));
	}

	deleteDiffusionList(parent_id: string, keys: string[], callback: any = null): any {
		keys.forEach(k => {
			this.afDB.database.ref(`${this.basePath}/${parent_id}/${k}`).remove();
		});
	}

	deleteAll(parent_id: string): any {
		return this.afDB.database.ref(`${this.basePath}/${parent_id}`).remove()
			.catch(error => this.handleError(error));
	}

  // NOTE: This code below is for MONGO
  createDiffusionMongo(sp_id: string, img_id: string, difs: any, name: string, callback: any = null) {
    return new Promise((resolve, reject) => {
      const uri = this.globals.serverHost + '/diffusion/add';
      let obj = {};
      obj["sp_id"] = sp_id;
      obj["img_id"] = img_id;
      obj["store_file_name"] = name;
      obj["data_list"] = difs.data_list;
      obj["imgA_ratio_h"] = difs.imgA_ratio_h;
      obj["imgA_ratio_w"] = difs.imgA_ratio_w;
      obj["imgB_ratio_h"] = difs.imgB_ratio_h;
      obj["imgB_ratio_w"] = difs.imgB_ratio_w;
      this
        .http
        .post(uri, obj)
        .subscribe(res => {
          if (res["item"]["_id"] !== null) {
            console.log("good");
            resolve("SUCCESS");
          } else {
            console.log("fail");
            reject("FAILURE");
          }
        });
    });
  }

  updateDiffusionListMongo(id: string, dif_position: any,callback: any = null){
    const uri = this.globals.serverHost + '/diffusion/update/' + id ;
    let obj = {};
    obj["imgA_ratio_h"] = dif_position.imgA_ratio_h;
    obj["imgA_ratio_w"] = dif_position.imgA_ratio_w;
    obj["imgB_ratio_h"] = dif_position.imgB_ratio_h;
    obj["imgB_ratio_w"] = dif_position.imgB_ratio_w;

    this
      .http
      .put(uri, obj)
      .subscribe(res =>
      {
        console.log(res);
      });

    if (callback) {
      callback();
    }
  }

  updateDiffusionListDetail(id: string, changes: any,callback: any = null){
    const uri = this.globals.serverHost + '/diffusion/update/' + id ;
    let obj = changes;

    this
      .http
      .put(uri, obj)
      .subscribe(res =>
      {
        console.log(res);
      });

    if (callback) {
      callback();
    }
  }

  getDiffusionListMongo(query: any = {}){
    const uri = this.globals.serverHost + '/diffusion';
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

  deleteDiffusionListMongo(key: string): any {
    const uri = this.globals.serverHost + '/diffusion/delete/' + key;
    return this
      .http
      .get(uri,{ responseType: 'text' })
      .subscribe(res => {
        return res;
      });
  }

}
