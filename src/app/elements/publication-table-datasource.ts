import {Component} from '@angular/core';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {PublicationTableDatabase} from "./publication-table-database";
import {Publication} from "../models/publication";
import {MdSort} from "@angular/material";


export class PublicationTableDatasource extends DataSource<any> {
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  constructor(private database: PublicationTableDatabase, private sort: MdSort) {
    super();
  }

  connect(): Observable<Publication[]> {
    const displayDataChanges = [
      this.database.dataChange,
      this._filterChange,
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      const data = this.database.data.slice().filter((item: Publication) => {
        // let searchStr = (item.vd_name + item.vd_name2 + item.vd_tzone + item.vd_inf_desc + item.vd_inf_country).toLowerCase();
        let searchStr = (item.cb_auth + item.cb_title + item.cb_journ
          + item.cb_vol + item.cb_pub + item.cb_keywords + item.cb_year).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) != -1;
      });
      return this.sortData(data);
    });
  }

  disconnect() {}

  // sort(sortable: MdSortable) {}
  sortData(data): Publication[] {
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
