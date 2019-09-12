import {Injectable} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2/database";
import {AngularFireAuth} from "angularfire2/auth";
import {BaseService} from "../base.service";
import {Chart} from "../../models/chart";
import {Analysis} from "../../models/analysis";
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {filterObjectsMultipleQuery, normalizeGetObjectList} from '../../../utils/dataConvertHelper';
import {AuthService} from '../../auth/auth.service';

@Injectable()
export class ChartService extends BaseService {

	public basePath: string = '/charts';

	constructor(private afDB: AngularFireDatabase,
				      private afAuth: AngularFireAuth,
              private http: HttpClient,
              private authService: AuthService) {
		super();
		this.charts = this.afDB.list(this.basePath);
		this.chart = this.afDB.object(this.basePath);
	}

	charts: FirebaseListObservable<Chart[]> = null;
	chart: FirebaseObjectObservable<Chart> = null;


	getAllCharts(query: any = {}): FirebaseListObservable<Chart[]> {
    return this.afDB.list(`${this.basePath}`, {query: query});
  }

	getChartsList(parent_id: string, query: any = {}): FirebaseListObservable<Chart[]> {
		// this.charts = this.afDB.list(this.basePath, {
		// 	query: query
		// });
		// return this.charts;
		return this.afDB.list(`${this.basePath}/${parent_id}`, {query: query});
	}

	getChart(parent_id: string, key: string): FirebaseObjectObservable<Chart> {
		const itemPath = `${this.basePath}/${parent_id}/${key}`;
		this.chart = this.afDB.object(itemPath);
		return this.chart;
	}

	createChart(parent_id: string, chart: Chart, callback: any = null): firebase.Promise<any> {
		return this.afDB.database.ref(`${this.basePath}/${parent_id}`).push(chart.toFirebaseJsonObject(chart, Chart.schema))
			.then((ref) => {
				callback ? callback(ref) : null;
			})
			.catch(error => this.handleError(error));
	}

	updateChart(parent_id: string, key: string, value: any, callback: any = null): firebase.Promise<any> {
		return this.afDB.database.ref(`${this.basePath}/${parent_id}/${key}`).update(value)
			.then((ref) => {
				callback ? callback(ref) : null;
			})
			.catch(error => this.handleError(error));
	}


	deleteChart(parent_id: string, key: string): any {
		return this.afDB.database.ref(`${this.basePath}/${parent_id}/${key}`).remove()
			.catch(error => this.handleError(error));
	}

	deleteAll(parent_id :string): any {
		return this.afDB.database.ref(`${this.basePath}/${parent_id}`).remove()
				.catch(error => this.handleError(error));
	}

	getItemId(parent_id: string): string {
		return this.afDB.database.ref(`${this.basePath}/${parent_id}`).push().key;
	}


  // NOTE: This code below is for MONGO
  createChartMongo(img_id: string, chart: Chart, callback: any = null) {
      const uri = this.globals.serverHost + '/charts/add';
      let obj = chart.toFirebaseJsonObject(chart, Chart.schema);

      obj["img_id"] = img_id;
      this
        .http
        .post(uri, obj)
        .subscribe(res =>
          console.log(res));
      callback();
  }

  getChartsListMongo(query: any = {}){
    const uri = this.globals.serverHost +'/charts';
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

  deleteChartMongo(img_id: string, key: string): any {
    const uri = this.globals.serverHost +'/charts/delete/' + key;
    return this
      .http
      .get(uri)
      .subscribe(res => {
        return res;
      });
  }

  deleteAllChartsMongo(img_id: string) {

  }


}
