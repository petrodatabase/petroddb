import {Injectable} from '@angular/core';
import {BaseService} from "../base.service";
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2/database";
import {AngularFireAuth} from "angularfire2/auth";
import {Eruption} from "../../models/eruption";
import {DateTimeFormatService} from "../date-time-format.service";
import {AlertService} from "../../components/alert-dialog/alert.service";

@Injectable()
export class EruptionService extends BaseService {

	public basePath: string = 'eruptions';

	constructor(private afDB: AngularFireDatabase,
				private afAuth: AngularFireAuth,
				private datetimeService: DateTimeFormatService,
				private alertService: AlertService,
	) {
		super();
		this.eruptions = this.afDB.list(this.basePath);
		this.eruption = this.afDB.object(this.basePath);
	}

	eruptions: FirebaseListObservable<Eruption[]> = null;
	eruption: FirebaseObjectObservable<Eruption> = null;

	getEruptionsList(vd_id: string, query: any = {}): FirebaseListObservable<Eruption[]> {
		this.eruptions = this.afDB.list(`${this.basePath}/${vd_id}`, {
			query: query
		});
		// this.eruptions = this.afDB.database.ref(`${this.basePath}/${vd_id}`);

		return this.eruptions;
	}

	getEruption(vd_id: string, $key: string): FirebaseObjectObservable<Eruption> {
		const itemPath = `${this.basePath}/${vd_id}/${$key}`;
		this.eruption = this.afDB.object(itemPath);
		return this.eruption;
	}

	// createEruption(ed: Eruption, callback: any = null): firebase.database.ThenableReference {
	// createEruption(ed: Eruption, callback: any = null): firebase.Promise<any> {
	createEruption(ed: Eruption, callback: any = null): firebase.database.ThenableReference {
		return this.afDB.database.ref(`${this.basePath}/${ed.vd_id}`).push(ed.toFirebaseJsonObject(ed, Eruption.schema))
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

	updateEruption(vd_id: string, $key: string, value: any): firebase.Promise<any> {
		return this.afDB.list(`${this.basePath}/${vd_id}`).update($key, value)
			.catch(error => this.handleError(error));
	}

	updateWholeEruption(vd_id: string, eds: Eruption[]): firebase.Promise<any> {
		let updates = {};
		eds.forEach(ed => {
			updates[ed.$key] = ed.toFirebaseJsonObject();
		});
		return this.afDB.database.ref(`${this.basePath}/${vd_id}`).set(updates)
			.catch(error => this.handleError(error));
	}

	deleteEruption(vd_id: string, key: string): void {
		this.afDB.list(`${this.basePath}/${vd_id}`).remove(key)
			.catch(error => this.handleError(error));
	}

	deleteAll(vd_id: string): void {
		this.afDB.list(`${this.basePath}/${vd_id}`).remove()
			.catch(error => this.handleError(error));
	}

	deleteAllEverything(): void {
		this.afDB.list(`${this.basePath}`).remove()
			.catch(error => this.handleError(error));
	}

	validateInput(ed: Eruption): boolean {
		// if (ed.ed_stime != '' && !this.datetimeService.validate(ed.ed_stime)) {
		// 	this.alertService.openAlert(this.datetimeService.ad_bc_date_alert, `Invalid Input`);
		// 	return false;
		// }
		// if (ed.ed_etime != '' && !this.datetimeService.validate(ed.ed_etime)) {
		// 	this.alertService.openAlert(this.datetimeService.ad_bc_date_alert, `Invalid Input`);
		// 	return false;
		// }
		// if (ed.ed_climax != '' && !this.datetimeService.validate(ed.ed_climax)) {
		// 	this.alertService.openAlert(this.datetimeService.ad_bc_date_alert, `Invalid Input`);
		// 	return false;
		// }
		// if (ed.ed_loaddate != '' && !this.datetimeService.validate(ed.ed_loaddate)) {
		// 	this.alertService.openAlert(this.datetimeService.ad_bc_date_alert, `Invalid Input`);
		// 	return false;
		// }
		// if (ed.ed_pubdate != '' && !this.datetimeService.validate(ed.ed_pubdate)) {
		// 	this.alertService.openAlert(this.datetimeService.ad_bc_date_alert, `Invalid Input`);
		// 	return false;
		// }
		if (!this.validateDateTime(ed, 'ed_stime')) return false;
		if (!this.validateDateTime(ed, 'ed_etime')) return false;
		if (!this.validateDateTime(ed, 'ed_climax')) return false;
		if (!this.validateDateTime(ed, 'ed_loaddate')) return false;
		if (!this.validateDateTime(ed, 'ed_pubdate')) return false;

		// if (ed.proj_name == '' || !proj.proj_name || proj.proj_name == 'null') {
		// 	this.alertService.openAlert(`Project name must not be empty`, `Invalid Input`);
		// 	return false;
		// }

		else return true;
	}

	validateDateTime(ed: Eruption, key: string): boolean {
    if (ed[key] != '' && !this.datetimeService.validate(ed[key])) {
      try {
        ed[key] = this.datetimeService.convertDate(ed[key]);
      }
      catch (e) {
        this.alertService.openAlert(`Date time format of ${Eruption.schema[key]['placeholder']} must be DD/MM/YYYY or a negative integer for BC year`, `Invalid Input`);
        return false;
      }

    }
    return true;
  }

}
