import {Component} from '@angular/core';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Analysis} from "../models/analysis";
import {AlyTableDatabase} from "./aly-table-database";


// filter by reference name
export class AlyTableDataSource extends DataSource<any> {
	_filterChange = new BehaviorSubject('');
	get filter(): string { return this._filterChange.value; }
	set filter(filter: string) { this._filterChange.next(filter); }

	constructor(private database: AlyTableDatabase) {
		super();
	}

	connect(): Observable<Analysis[]> {
		const displayDataChanges = [
			this.database.dataChange,
			this._filterChange,
		];

		return Observable.merge(...displayDataChanges).map(() => {
			return this.database.data.slice().filter((item: Analysis) => {
				let searchStr = (item.ref_name + item.color + item.ref_id + item.aly_type + item.aly_comment).toLowerCase();
				return searchStr.indexOf(this.filter.toLowerCase()) != -1;
			});
		});
	}




	disconnect() {}
}
