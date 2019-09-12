import {Component, OnInit} from '@angular/core';
import {ObservatoryService} from "../../services/database-services/observatory.service";
import {environment} from "../../../environments/environment";
import {AngularFireDatabase} from "angularfire2/database";
import {BaseModel} from "../../models/base-model";
import {Observatory} from "../../models/observatory";
import {Volcano} from "../../models/volcano";
import {Http} from "@angular/http";
import {Eruption} from "../../models/eruption";
import {EruptionService} from "../../services/database-services/eruption.service";
import {VolcanoService} from "../../services/database-services/volcano.service";
import {Observable} from "rxjs/Observable";

@Component({
	selector: 'app-new-observatory',
	templateUrl: './new-observatory.component.html',
	styleUrls: ['./new-observatory.component.css']
})
export class NewObservatoryComponent implements OnInit {

	constructor(
		private observatoryService: ObservatoryService,
		private afDB: AngularFireDatabase,
		private http:Http,
		private eruptionService: EruptionService,
		private volcanoService: VolcanoService,
	) {
	}

	ngOnInit() {
	}

	deleteAll() {
		this.volcanoService.deleteAll();
		this.eruptionService.deleteAllEverything();
		this.observatoryService.deleteAll();
	}

	loadAll() {
		// let cc = JSON.parse(environment.cc_db);
		// let vd = JSON.parse(environment.vd_db);
		// let vd_inf = JSON.parse(environment.vd_inf_db);
		// let ed = JSON.parse(environment.ed_db);
		let cc, vd, vd_inf, ed;
		this.http.get('assets/cc.json')
			.subscribe(res => {
				cc = res.json();
				// console.log(cc);
				this.http.get('assets/vd.json')
					.subscribe(resVd => {
						// vd = resVd..replace('\'', "\\'") .json();
						vd = resVd.json();
						// console.log(vd);
						this.http.get('assets/vd_inf.json')
							.subscribe(resInf => {
								vd_inf = resInf.json();

								this.http.get('assets/ed.json')
									.subscribe(resEd => {
										ed = resEd.json();

										// console.log(vd_inf);
										// cc first
										let cc_updates = {};
										cc.forEach(c => {
											Object.keys(c).forEach(k => {
												if (!c[k] || c[k] == 'NULL' || c[k] == 'null') {
													delete c[k];
												}
											});
											c.$key = this.afDB.database.ref('observatories').push().key;
											cc_updates[c.$key] = BaseModel.toObject(c, Observatory).toFirebaseJsonObject();
										});

										// let found = cc.find(c => "204" == c.cc_id);
										// if (!!found) {
										// 	console.log('found');
										// 	console.log(cc);
										// }

										// vd
										let vd_updates = {};
										vd.forEach(v => {
											Object.keys(v).forEach(k => {
												if (!v[k] || v[k] == 'NULL' || v[k] == 'null') {
													delete v[k];
												}
											});

											let ccs = [];
											v.$key = this.afDB.database.ref('volcanos').push().key;
											let v_inf = vd_inf.find(inf => inf.vd_id == v.vd_id);
											Object.keys(v_inf).forEach(k => {
												if (!!v_inf[k] && v_inf[k] != 'null' && v_inf[k] != 'NULL') {
													v[k] = v_inf[k];
												}
											});

											let cccc;
											if (!!v.cc_id && v.cc_id != null && v.cc_id != 'null' && v.cc_id != 'NULL') {
												cccc = cc.find(c => v.cc_id == c.cc_id);
												if (!!cccc) {
													ccs.push(cccc['$key']);
												}
											}
											if (!!v.cc_id2 && v.cc_id2 != null && v.cc_id2 != 'null' && v.cc_id2 != 'NULL') {
												cccc = cc.find(c => v.cc_id2 == c.cc_id);
												if (!!cccc) {
													ccs.push(cccc['$key']);
												}									}
											if (!!v.cc_id3 && v.cc_id3 != null && v.cc_id3 != 'null' && v.cc_id3 != 'NULL') {
												cccc = cc.find(c => v.cc_id3 == c.cc_id);
												if (!!cccc) {
													ccs.push(cccc['$key']);
												}									}
											if (!!v.cc_id4 && v.cc_id4 != null && v.cc_id4 != 'null' && v.cc_id4 != 'NULL') {
												cccc = cc.find(c => v.cc_id4 == c.cc_id);
												if (!!cccc) {
													ccs.push(cccc['$key']);
												}									}
											if (!!v.cc_id5 && v.cc_id5 != null && v.cc_id5 != 'null' && v.cc_id5 != 'NULL') {
												cccc = cc.find(c => v.cc_id5 == c.cc_id);
												if (!!cccc) {
													ccs.push(cccc['$key']);
												}									}
											if (!!v.cc_id_load && v.cc_id_load != null && v.cc_id_load != 'null' && v.cc_id_load != 'NULL') {
												cccc = cc.find(c => v.cc_id_load == c.cc_id);
												if (!!cccc) {
													// ccs.push(cccc['$key']);
													// console.log(`found ${cccc['$key']}`);
													v.cc_id_load = cccc['$key'];
												}
												// v.cc_id_load = cc.find(c => v.cc_id_load == c.cc_id)['$key'];
											}
											v.cc_id = ccs;

											vd_updates[v.$key] = BaseModel.toObject(v, Volcano).toFirebaseJsonObject();
										});



										let ed_updates = [];
										ed.forEach(e => {
											Object.keys(e).forEach(k => {
												if (!e[k] || e[k] == 'NULL' || e[k] == 'null') {
													delete e[k];
												}
											});
											e.$key = this.afDB.database.ref('eruptions').push().key;
											if (!!e.vd_id && e.vd_id != null && e.vd_id != 'null' && e.vd_id != 'NULL') {
												let vvvv = vd.find(v => v.vd_id == e.vd_id);
												if (!!vvvv) {
													// ccs.push(cccc['$key']);
													e.vd_id = vvvv['$key'];
												}
											}
											// let ccs = [];
											let cccc;
											if (!!e.cc_id && e.cc_id != null && e.cc_id != 'null' && e.cc_id != 'NULL') {
												cccc = cc.find(c => e.cc_id == c.cc_id);
												if (!!cccc) {
													e.cc_id = cccc['$key'];
												}
											}
											if (!!e.cc_id_load && e.cc_id_load != null && e.cc_id_load != 'null' && e.cc_id_load != 'NULL') {
												cccc = cc.find(c => e.cc_id_load == c.cc_id_load);
												if (!!cccc) {
													e.cc_id_load = cccc['$key'];
												}
											}

											// e.cb

											// ed_updates[e.$key] = BaseModel.toObject(e, Eruption).toFirebaseJsonObject();
											ed_updates.push(BaseModel.toObject(e, Eruption));
										});

										// console.log(cc);
										// console.log(vd);
										console.log(cc_updates);
										console.log(vd_updates);
										console.log(ed_updates);

										this.afDB.database.ref('observatories').update(cc_updates)
											.then(
												(_) => {
													// vd
													this.afDB.database.ref('volcanos').update(vd_updates)
														.then(
															(_) => {
																ed_updates.forEach((e: Eruption) => {
																	this.eruptionService.createEruption(e);
																});
																console.log('DOne upto to volcanos');
															}
														)
														.catch(error => {
															console.log('ERROR on vd');
															console.log(error);
														})
												}
											)
											.catch(error => {
												console.log('ERROR on obs');
												console.log(error);
											})

									});

							})
					});
			});



		// ed

	}

}
