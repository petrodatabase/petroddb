import {Injectable} from '@angular/core';
import {BaseService} from "../base.service";
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2/database";
import {AngularFireAuth} from "angularfire2/auth";
import {DateTimeFormatService} from "../date-time-format.service";
import {AlertService} from "../../components/alert-dialog/alert.service";
import {Report} from "../../models/report";
import {Observable} from "rxjs/Observable";

@Injectable()
export class ReportService extends BaseService {

	private basePath: string = '/reports';

	reports: FirebaseListObservable<Report[]> = null;
	report: FirebaseObjectObservable<Report> = null;

	constructor(
		private afDB: AngularFireDatabase,
		private afAuth: AngularFireAuth,
		private alertService: AlertService,
	) {
		super();
		this.reports = this.afDB.list(this.basePath);
		this.report = this.afDB.object(this.basePath);

	}

	getReportsList(query: any = {}): Observable<Report[]> {
		this.reports = this.afDB.list(this.basePath, {
			query: query
		});
		return this.reports;
	}

	getReport(key: string): FirebaseObjectObservable<Report> {
		const itemPath  = `${this.basePath}/${key}`;
		this.report = this.afDB.object(itemPath);
		return this.report;
	}

	createReport(report: Report, callback: any = null): firebase.database.ThenableReference {
		return this.reports.push(report.toFirebaseJsonObject(report, Report.schema))
			.then((ref: firebase.database.ThenableReference) => {
				if (callback) {
					callback(ref);
				}
			})
			.catch(error => this.handleError(error));
	}

	updateReport(key: string, value: any): firebase.Promise<any> {
		return this.reports.update(key, value)
			.catch(error => this.handleError(error));
	}

	deleteReport(key: string): void {
		this.reports.remove(key)
			.then(_ => {
			})
			.catch(error => this.handleError(error));
	}

	deleteAll(): void {
		this.reports.remove()
			.then(_ => {
			})
			.catch(error => this.handleError(error));
	}

}
