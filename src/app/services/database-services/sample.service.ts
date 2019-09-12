import {Injectable} from '@angular/core';
import {FirebaseListObservable, FirebaseObjectObservable, AngularFireDatabase} from "angularfire2/database";
import {Sample} from "../../models/sample";
import {AngularFireAuth} from "angularfire2/auth";
import {BaseService} from "../base.service";
import {DateTimeFormatService} from "../date-time-format.service";
import {AlertService} from "../../components/alert-dialog/alert.service";
import {filterObjects, isFirebase, normalizeGetObject, normalizeGetObjectList, filterObjectsMultipleQuery} from '../../../utils/dataConvertHelper';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from '../../auth/auth.service';

@Injectable()
export class SampleService extends BaseService {
	private basePath: string = '/samples';

	samples: FirebaseListObservable<Sample[]> = null;
	sample: FirebaseObjectObservable<Sample> = null;

	constructor(
		private afDB: AngularFireDatabase,
		private afAuth: AngularFireAuth,
		private datetimeService: DateTimeFormatService,
		private alertService: AlertService,
    private http: HttpClient,
    private authService: AuthService
	) {
		super();
		this.samples = this.afDB.list(this.basePath);
		this.sample = this.afDB.object(this.basePath);
	}
// NOTE: This code below is for Firebase Version
	getSamplesList(query: any = {}): FirebaseListObservable<Sample[]> {
    this.samples = this.afDB.list(this.basePath, {
      query: query
    });
    return this.samples;
  }

	getSample(key: string): FirebaseObjectObservable<Sample> {
		const itemPath  = `${this.basePath}/${key}`;
		this.sample = this.afDB.object(itemPath);
		return this.sample;
	}

  getSampleFirebase(key: string): FirebaseObjectObservable<Sample> {
    const itemPath  = `${this.basePath}/${key}`;
    this.sample = this.afDB.object(itemPath);
    return this.sample;
  }

	createSample(sp: Sample, callback: any = null): firebase.database.ThenableReference {
		// test
		// let l = [sp, sp];
		return this.samples.push(sp.toFirebaseJsonObject())
		// return this.samples.push(l.map(s => s.toFirebaseJsonObject()))
			.then((newSampleRef: firebase.database.ThenableReference) => {
				console.log(newSampleRef);
				// sp.$key = newSampleRef.key;
				// let jsonSp = (new Sample(sp)).toFirebaseJsonObject();
				// console.log(sp);
				// console.log(jsonSp);
				// this.updateSample(newSampleRef.key, jsonSp);
				if (callback) {
					callback(newSampleRef);
				}
			})
			.catch(error => this.handleError(error));
	}

  createMultipleSample(sps: Sample[], callback: any = null): firebase.Promise<any> {
		let ref = this.afDB.database.ref(`${this.basePath}/`);
		// sps = sps.map(v => v.toFirebaseJsonObject();
		let updates = {};
		sps.forEach(v => {
			v.$key = ref.push().key;
			updates[v.$key] = v.toFirebaseJsonObject();
		});

		return ref.update(updates)
		// return this.samples.push(l.map(s => s.toFirebaseJsonObject()))
			.then((newSampleRef: firebase.Promise<any>) => {
				console.log(newSampleRef);
				// sp.$key = newSampleRef.key;
				// let jsonSp = (new Sample(sp)).toFirebaseJsonObject();
				// console.log(sp);
				// console.log(jsonSp);
				// this.updateSample(newSampleRef.key, jsonSp);

				if (callback) {
					callback(newSampleRef);
				}
			})
			.catch(error => this.handleError(error));
	}


	updateSampleFirebase(key: string, value: any): firebase.Promise<any> {
		// return this.afDB.object(`${this.basePath}/${key}`).update(value)
		return this.samples.update(key, value)
			.then((data) => {
				console.log(data);
			})
			.catch(error => {
				console.log('Error update sample');
				this.handleError(error);
			});
	}

	// update sample with the entire sample
	// updateSample(sp: Sample): void {
	//
	// }

	deleteSampleFirebase(key: string): firebase.Promise<void> {

		return this.samples.remove(key)
			.catch(error => this.handleError(error));
	}

	deleteAll(): firebase.Promise<void> {
		return this.samples.remove()
			.catch(error => this.handleError(error));
	}

  // NOTE: THIS CODE BELOW IS FOR MONGODB VERSION
  getSamplesListMongo(Query: any ={}){
    const uri = this.globals.serverHost +'/samples';
    let token = this.authService.IDToken;

    const requestOptions = {
      headers: new HttpHeaders({token: token}),
    };

    return this
      .http
      .get(uri, requestOptions)
      .map(res => {
        console.log(res);
        return normalizeGetObjectList(filterObjectsMultipleQuery(res,Query));
      });
  }

  getSampleMongo(id: string) {
    // NOTE: If this is a Firebase Sample, get sample detail using Firebase function
    if (isFirebase(id)){
      return this.getSamplesListMongo({fireBaseKey:id});
    }
    const uri = this.globals.serverHost +'/samples/edit/' + id;
    return this
      .http
      .get(uri)
      .map(res => {
        return normalizeGetObject(res);
      });
  }

  updateSampleMongo(id: string, sps: Sample) {
    return new Promise((resolve, reject) => {
      const raw = sps.toFirebaseJsonObject();
      const uri = this.globals.serverHost +'/samples/update/' + id;
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

  createSampleMongo(sps: Sample, callback: any = null) {
    const uri = this.globals.serverHost +'/samples/add';
    const obj = sps.toFirebaseJsonObject();
    this
      .http
      .post(uri, obj)
      .subscribe(res =>
      {
        if(callback) {
          callback(res);
        }
        console.log(res);
      });


  }

  createMultipleSampleMongo(sps: Sample[], callback: any = null) {
	  sps.forEach(sample=>{
	    this.createSampleMongo(sample);
    });

    if(callback) {
      callback();
    }
  }
  // TODO: IMPLEMENT DELETE

	validateInput(sp: Sample): boolean {
		if (sp.sp_coldate != '' && !this.datetimeService.validate(sp.sp_coldate)) {
			this.alertService.openAlert(`Date time format must be DD/MM/YYYY`, `Invalid Input`);
			return false;
		}
		if (sp.sp_name == '' || !sp.sp_name || sp.sp_name == 'null') {
			this.alertService.openAlert(`Sample name must not be empty`, `Invalid Input`);
			return false;
		}
		else return true;
	}
}
