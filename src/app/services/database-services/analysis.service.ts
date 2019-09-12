import {Injectable} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2/database";
import {AngularFireAuth} from "angularfire2/auth";
import {BaseService} from "../base.service";
import {Analysis} from "../../models/analysis";
import * as firebase from 'firebase';
import {ImageModel} from "../../models/image-model";
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {filterObjects, filterObjectsMultipleQuery, normalizeGetObjectList} from '../../../utils/dataConvertHelper';
import {AuthService} from '../../auth/auth.service';

/**
 * Analysis parent key may be image or sample
 */
@Injectable()
export class AnalysisService extends BaseService {
  public basePath: string = '/analyses';

  constructor(private afDB: AngularFireDatabase,
              private afAuth: AngularFireAuth,
              private http: HttpClient,
              private authService: AuthService) {
    super();
    this.analyses = this.afDB.list(this.basePath);
    this.analysis = this.afDB.object(this.basePath);
  }

  analyses: FirebaseListObservable<Analysis[]> = null;
  analysis: FirebaseObjectObservable<Analysis> = null;


  getAllAnalysis(query: any = {}): FirebaseListObservable<Analysis[]> {
    return this.afDB.list(`${this.basePath}`, {query: query});
  }
  getAnalysesList(parent_id: string, query: any = {}): FirebaseListObservable<Analysis[]> {
    // this.analyses = this.afDB.list(this.basePath, {
    // 	query: query
    // });
    return this.afDB.list(`${this.basePath}/${parent_id}`, {query: query});
    // .catch(error => {
    // 	this.handleError(error);
    // })
  }

  getAnalysis(parent_id: string, key: string): FirebaseObjectObservable<Analysis> {
    const itemPath = `${this.basePath}/${parent_id}/${key}`;
    this.analysis = this.afDB.object(itemPath);
    return this.analysis;
  }

  createAnalysis(parent_id: string, aly: Analysis, callback: any = null): firebase.database.ThenableReference {
    return this.afDB.database.ref(`${this.basePath}/${parent_id}`).push(aly.toFirebaseJsonObject(aly, Analysis.schema))
      .then((ref) => {
        if (callback) {
          callback(ref);
        }
      })
      .catch(error => this.handleError(error));
  }

  createAnalysisList(parent_id: string, alys: Analysis[], callback: any = null): firebase.Promise<any> {
    let updates = {};
    let id = '';
    alys.forEach(aly => {
      id = this.afDB.database.ref(`${this.basePath}/${parent_id}`).push().key;
      updates[id] = aly.toFirebaseJsonObject(aly, Analysis.schema);
      aly.$key = id;
    });
    console.log(updates);
    return this.afDB.database.ref(`${this.basePath}/${parent_id}`).update(updates)
      .then((ref) => {
        if (callback) {
          callback(ref);
        }
      })
      .catch(error => this.handleError(error));
  }

  updateAnalysis(parent_id: string, key: string, value: any): firebase.Promise<any> {
    return this.afDB.database.ref(`${this.basePath}/${parent_id}/${key}`).update(value)
      .catch(error => this.handleError(error));
  }

  updateAnalysisList(parent_id: string, alys: Analysis[], callback: any = null): firebase.Promise<any> {
    let updates = {}
    alys.forEach(aly => {
      updates[aly.$key] = aly.toFirebaseJsonObject();
    });

    return this.afDB.database.ref(`${this.basePath}/${parent_id}`).update(updates)
      .then((ref) => {
        if (callback) {
          callback(ref);
        }
      })
      .catch(error => this.handleError(error));
  }


  deleteAnalysis(parent_id: string, key: string): void {
    this.afDB.database.ref(`${this.basePath}/${parent_id}/${key}`).remove()
      .catch(error => this.handleError(error));
  }

  deleteAnalysisList(parent_id: string, keys: string[], callback: any = null): any {
    let ref;
    keys.forEach((k, i) => {
      ref = this.afDB.database.ref(`${this.basePath}/${parent_id}/${k}`).remove();
      if (i == keys.length - 1) {
        ref.then((ref) => {
          if (callback) {
            callback(ref);
          }
        })
      }
    });

  }

  deleteAll(parent_id: string): void {
    this.afDB.database.ref(`${this.basePath}/${parent_id}`).remove()
      .catch(error => this.handleError(error));
  }

  // NOTE: This code below is for MONGO

  createAnalysesMongo(sp_id: string, img_id: string, alys: Analysis[], name: string, callback: any = null){
    return new Promise((resolve, reject) => {
      const uri = this.globals.serverHost+ '/analyses/add';
      let obj = {};
      obj["sp_id"] = sp_id;
      obj["img_id"] = img_id;
      obj["store_file_name"] = name;
      obj["points"] = alys;
      // k is each point , f is every element of that point
      obj["points"].forEach(k=>{
        if(Object.keys(k.data).length>0){
          // remove null data ( -999 )
          let temp_data = {};
          Object.keys(k.data).forEach(f=>{
            if(k.data[f]["ele_val"] != -999){
              temp_data[f] = k.data[f];
            }
          });
          k.data = temp_data;
        }
      });
      this
        .http
        .post(uri, obj)
        .subscribe(res =>
        {
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

  updateAnalysesListMongo(id: string, alys: any,callback: any = null){
      const uri = this.globals.serverHost +'/analyses/update/' + id ;
      let obj = {};
      obj["points"] =[];
      alys.forEach(aly => {
        obj["points"].push(aly.toFirebaseJsonObject());
      });
      // obj["points"] = alys;

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
  getAnalysesListMongo(query: any = {}){
    const uri = this.globals.serverHost+ '/analyses';
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
}
