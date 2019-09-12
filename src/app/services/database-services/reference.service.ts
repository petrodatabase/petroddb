import {Injectable} from '@angular/core';
import {BaseService} from "../base.service";
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2/database";
import {AngularFireAuth} from "angularfire2/auth";
import {DateTimeFormatService} from "../date-time-format.service";
import {AlertService} from "../../components/alert-dialog/alert.service";
import {Publication} from "../../models/publication";

/** Control the reference pointer to publication keys to any sample, image, project */
@Injectable()
export class ReferenceService extends BaseService{

  public basePath: string = 'references';
  pubKeys: FirebaseListObservable<string[]> = null;
	pubKey: FirebaseObjectObservable<string> = null;
 
	constructor(private afDB: AngularFireDatabase,
				private afAuth: AngularFireAuth,
				private datetimeService: DateTimeFormatService,
				private alertService: AlertService,
	) {
		super();
		this.pubKeys = this.afDB.list(this.basePath);
		this.pubKey = this.afDB.object(this.basePath);
	}
	
	getPubKeysList(parent_id: string, query: any = {}): FirebaseListObservable<string[]> {
		this.pubKeys = this.afDB.list(`${this.basePath}/${parent_id}`, {
			query: query
		});
		// this.eruptions = this.afDB.database.ref(`${this.basePath}/${vd_id}`);

		return this.pubKeys;
	}
	
	createPubKey(parent_id: string, key: string, callback: any = null): firebase.database.ThenableReference {
		return this.afDB.database.ref(`${this.basePath}/${parent_id}`).push({key: key})
			.then(
				(ref: firebase.database.ThenableReference) => {
					// console.log(ref);
					if (callback) {
						callback(ref);
					}
				}
			)
			.catch(error => this.handleError(error));

		// this.afDB.database.ref().child('eruptions').child(ed.vd_id).push(ed.toFirebaseJsonObject(ed, Eruption.schema));
		// return null;
	}
	
	appendPubKeyList(parent_id: string, keys: string[], callback: any = null): firebase.database.ThenableReference {
		return this.afDB.database.ref(`${this.basePath}/${parent_id}`).push(keys)
			.then(
				(ref: firebase.database.ThenableReference) => {
					// console.log(ref);
					if (callback) {
						callback(ref);
					}
				}
			)
			.catch(error => this.handleError(error));
	}
	
	deletePubKey(parent_id: string, key: string): void {
		this.afDB.list(`${this.basePath}/${parent_id}`).remove(key)
			.catch(error => this.handleError(error));
	}
	

}
