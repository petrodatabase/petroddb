
import {Component} from '@angular/core';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {DifTableDatabase} from "./dif-table-database";
import {Diffusion} from "../models/diffusion";


export class DifTableDataSource extends DataSource<any> {
	_filterChange = new BehaviorSubject('');
	get filter(): string { return this._filterChange.value; }
	set filter(filter: string) { this._filterChange.next(filter); }

	constructor(private database: DifTableDatabase) {
		super();
	}

	connect(): Observable<Diffusion[]> {
		const displayDataChanges = [
			this.database.dataChange,
			this._filterChange,
		];

		return Observable.merge(...displayDataChanges).map(() => {
			return this.database.data.slice().filter((item: Diffusion) => {

				let searchStr = (item.dif_name + item.dif_instrument + item.dif_comment).toLowerCase();
				return searchStr.indexOf(this.filter.toLowerCase()) != -1;
			});
		});
	}


	disconnect() {}
}
