import {Component} from '@angular/core';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {SampleTableDatabase} from "./sample-table-database";
import {Sample} from "../models/sample";
import {Volcano} from "../models/volcano";
import {Project} from "../models/project";
import {MdSort} from "@angular/material";
import * as moment from "moment";

export class SampleTableDatasource extends DataSource<any> {
	_filterChange = new BehaviorSubject('');
	_searchFields: string[] = [];

	_volcanoList: Volcano[];
	_projectList: Project[];
	get filter(): string { return this._filterChange.value; }
	set filter(filter: string) { this._filterChange.next(filter); }
	set searchFields(fields: string[]) {this._searchFields = fields;}
	set volcanoList(vols: Volcano[]) {this._volcanoList = vols;}
	set projectList(projs: Project[]) {this._projectList = projs;}

	constructor(private database: SampleTableDatabase, private sort: MdSort) {
		super();
		this._volcanoList = null;
		this._projectList = null;
	}

	// sort(sortable: MdSortable) {}
  sortData(data): Sample[] {
    if (!this.sort.active || this.sort.direction == '') { return data; }

    return data.sort((a, b) => {

      let [propertyA, propertyB] = [a[this.sort.active], b[this.sort.active]];

      switch(this.sort.active){
        case 'sp_coldate': {
          if (propertyA.toString() == "") {
            // console.log("Invalid Date");
            propertyA = "01/01/1000"
          }
          if (propertyB.toString() == "") {
            // console.log("Invalid Date");
            propertyB = "01/01/1001"
          }
          //convert to date object
          let newDateA: Date = moment(propertyA.toString(), "DD/MM/YYYY").toDate();
          let newDateB: Date = moment(propertyB.toString(), "DD/MM/YYYY").toDate();

          // console.log(newDateA,newDateB,newDateA< newDateB);
          return (newDateA < newDateB ? 1 : -1) * (this.sort.direction == 'asc' ? 1 : -1);

        }
        default:
          return (propertyA.toString().toLowerCase() < propertyB.toString().toLowerCase() ? 1 : -1) * (this.sort.direction == 'asc' ? 1 : -1);

      }
    });
  }

	connect(): Observable<Sample[]> {
		const displayDataChanges = [
			this.database.dataChange,
			this._filterChange,
      this.sort.mdSortChange
		];

		return Observable.merge(...displayDataChanges).map(() => {
			const data = this.database.data.slice().filter((item: Sample) => {
				/** All search logic here, this.filter will be the text string
				 *  Search by matching each input after "," to each key of string
				 */
				if (!this.filter) {
					return true;
				}
				let queries = this.filter.toLowerCase().split(",").map(v => v.trim()).filter(v => v != '');
				if (queries.length == 0) {
					return true;
				}

				let arrayFields = ['sp_type', 'sp_rocktype', 'sp_rockcomp'];
				let found = false;

				let arrayParts;
				this._searchFields.forEach(k => {
					/** special search for volcano and project */
					if (k == 'vd') {
						// This logics works as long as vd attach to sample
						queries.forEach(q => {
							if ((!!item[k] && ("" + item[k]) != "null" && item[k] != null) // item is defined
							// && vd_ids.includes((item[k]['$key'] || item[k]))	// item contains the text
							) {
								if (([item[k].vd_name, item[k].vd_name2].join(",").toLowerCase().indexOf(q) != -1)) {
									found = true;
								}
							}
						});

						// FIXME: the following still works in case volcano list is available
						// if (!this._volcanoList) return;
						// queries.forEach(q => {
						// 	let vd_ids = this._volcanoList.filter(vol => (vol.vd_name + "," + vol.vd_name2).toLowerCase().indexOf(q) != -1).map(v => v.$key);
						// 	if ((!!item[k] && ("" + item[k]) != "null" && item[k] != null) // item is defined
						// 		// && vd_ids.includes((item[k]['$key'] || item[k]))	// item contains the text
						// 	) {
						// 		if (vd_ids.includes(item[k].toKey())) {
						// 			found = true;
						// 		}
						// 	}
						// });
						return;
					}
					if (k == 'proj') {
						queries.forEach(q => {
							if ((!!item[k] && ("" + item[k]) != "null" && item[k] != null) // item is defined
							// && vd_ids.includes((item[k]['$key'] || item[k]))	// item contains the text
							) {
								if (([item[k].proj_name].join(",").toLowerCase().indexOf(q) != -1)) {
									found = true;
								}
							}
						});
						// FIXME: the following still works in case volcano list is available
						// if (!this._projectList) return;
						// queries.forEach(q => {
						// 	let proj_ids = this._projectList.filter(proj => (proj.proj_name).toLowerCase().indexOf(q) != -1).map(v => v.$key);
						// 	if ((!!item[k] && ("" + item[k]) != "null" && item[k] != null) // item is defined
						// 	// && vd_ids.includes((item[k]['$key'] || item[k]))	// item contains the text
						// 	) {
						// 		if (proj_ids.includes(item[k].toKey())) {
						// 			found = true;
						// 		}
						// 	}
						// });
						return;
					}
					if (k == 'workspaces') {
						queries.forEach(q => {
							if ((!!item[k] && ("" + item[k]) != "null" && item[k] != null && item[k].constructor === Array) // item is defined
							) {
								if (item[k].find(w =>
										([w.ws_name, w.ws_des]
											.join(",")
											.toLowerCase()
											.indexOf(q) != -1)
									)
								) found = true;
							}
						});
						return;
					}
					if (k == 'img') {
						queries.forEach(q => {
							if ((!!item[k] && ("" + item[k]) != "null" && item[k] != null && item[k].constructor === Array) // item is defined
							) {
								if (item[k].find(img =>
										([img.img_name, img.img_cat, img.img_instr, img.img_des, img.img_color, img.img_time]
											.join(",")
											.toLowerCase()
											.indexOf(q) != -1)
									)
								) found = true;
							}
						});
						return;
					}
					if (k == 'linkf_list') {
						queries.forEach(q => {
							if ((!!item[k] && ("" + item[k]) != "null" && item[k] != null && item[k].constructor === Array) // item is defined
							) {
								if (item[k].find(f =>
										([f.file_name, f.file_comment]
											.join(",")
											.toLowerCase()
											.indexOf(q) != -1)
									)
								) found = true;
							}
						});
						return
					}


					/** Regular keys */
					if (arrayFields.includes(k) 	// key is an array
						&& (!!item[k] && item[k].constructor === Array)	// check for valid key
					) {
						queries.forEach(v => {
							if (item[k].map(v => v.toLowerCase()).join().indexOf(v) != -1) {
								found = true;
							}
						});
					}
					else {
						queries.forEach(v => {
							if ((!!item[k] && item[k] != "null" && item[k] != null) // item is defined
								&& ("" + item[k]).toLowerCase().indexOf(v) != -1	// item contains the text
							) {
								found = true;
							}
						});
					}
				});

				// return str.toLowerCase().indexOf(this.filter.toLowerCase()) != -1;
				return found;
			});
			return this.sortData(data);
		});
	}

	disconnect() {}
}
