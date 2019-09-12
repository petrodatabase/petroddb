import {Component} from '@angular/core';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {VolcanoTableDatabase} from "./volcano-table-database";
import {Volcano} from "../models/volcano";
import {MdSort, MdSortable} from "@angular/material";

export class VolcanoTableDatasource extends DataSource<any> {
	_filterChange = new BehaviorSubject('');

	// sort: MdSort;
	get filter(): string { return this._filterChange.value; }
	set filter(filter: string) { this._filterChange.next(filter); }

	constructor(private database: VolcanoTableDatabase, private sort: MdSort) {
		super();
	}

	connect(): Observable<Volcano[]> {
		const displayDataChanges = [
			this.database.dataChange,
			this._filterChange,
      this.sort.mdSortChange,
		];

		return Observable.merge(...displayDataChanges).map(() => {
		  const data = this.database.data.slice().filter((item: Volcano) => {
				// let searchStr = (item.vd_name + item.vd_name2 + item.vd_tzone + item.vd_inf_desc + item.vd_inf_country).toLowerCase();
				let searchStr = (item.vd_name + item.vd_name2).toLowerCase();
				return searchStr.indexOf(this.filter.toLowerCase()) != -1;
			});

		  return this.sortData(data);
		});
	}

	disconnect() {}

	// sort(sortable: MdSortable) {}
  sortData(data): Volcano[] {
	  if (!this.sort.active || this.sort.direction == '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';
      [propertyA, propertyB] = [a[this.sort.active], b[this.sort.active]];


      let valueA = isNaN(+propertyA) ? ('' + propertyA).toLowerCase() : +propertyA;
      let valueB = isNaN(+propertyB) ? ('' + propertyB).toLowerCase() : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this.sort.direction == 'asc' ? 1 : -1);
    });
  }
}
