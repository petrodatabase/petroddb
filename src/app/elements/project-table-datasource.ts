import {Component} from '@angular/core';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {ProjectTableDatabase} from "./project-table-database";
import {Project} from "../models/project";
import {MdSort} from "@angular/material";
import {MomentModule} from "angular2-moment" ;
import * as moment from "moment";

export class ProjectTableDatasource extends DataSource<any> {
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  constructor(private database: ProjectTableDatabase, private sort: MdSort) {
    super();
  }

  connect(): Observable<Project[]> {
    const displayDataChanges = [
      this.database.dataChange,
      this._filterChange,
      this.sort.mdSortChange
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      const data = this.database.data.slice().filter((item: Project) => {
        // let searchStr = (item.vd_name + item.vd_name2 + item.vd_tzone + item.vd_inf_desc + item.vd_inf_country).toLowerCase();
        let searchStr = (item.proj_name + item.proj_des + item.proj_date).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) != -1;
      });
      // console.log(this.sortData(data));
      return this.sortData(data);

      // return data;
    });
  }

  disconnect() {
  }

  sortData(data): Project[] {
	  if (!this.sort.active || this.sort.direction == '') { return data; }

    return data.sort((a, b) => {
      // let propertyA: number|string = '';
      // let propertyB: number|string = '';
      let [propertyA, propertyB] = [a[this.sort.active], b[this.sort.active]];
      // console.log(propertyA, propertyB , this.sort.active, a , b);

      // let valueA = isNaN(+propertyA) ? ('' + propertyA).toLowerCase() : +propertyA;
      // let valueB = isNaN(+propertyB) ? ('' + propertyB).toLowerCase() : +propertyB;
      // console.log(valueA,valueB,(valueA < valueB ? -1 : 1) * (this.sort.direction == 'asc' ? 1 : -1));
      // return (valueA < valueB ? -1 : 1) * (this.sort.direction == 'asc' ? 1 : -1);
      // console.log(this.sort.active)
      // console.log(a,b,a[this.sort.active],b[this.sort.active]);

      switch(this.sort.active){
        case 'proj_date': {
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
        case 'proj_creator':{
          propertyA = (propertyA.us_first&&propertyA.us_family)?(propertyA.us_first+" " + propertyA.us_family):(propertyA.displayName);
          propertyB= (propertyB.us_first&&propertyB.us_family)?(propertyB.us_first+" " + propertyB.us_family):(propertyB.displayName);

          // console.log(propertyA,propertyB);

          return (propertyA.toString().toLowerCase() < propertyB.toString().toLowerCase() ? 1 : -1) * (this.sort.direction == 'asc' ? 1 : -1);

        }
        case 'proj_pi':{
          propertyA = (propertyA.us_first&&propertyA.us_family)?(propertyA.us_first+" " + propertyA.us_family):(propertyA.displayName);
          propertyB= (propertyB.us_first&&propertyB.us_family)?(propertyB.us_first+" " + propertyB.us_family):(propertyB.displayName);

          // console.log(propertyA,propertyB);

          return (propertyA.toString().toLowerCase() < propertyB.toString().toLowerCase() ? 1 : -1) * (this.sort.direction == 'asc' ? 1 : -1);
        }

        default:
          return (propertyA.toString().toLowerCase() < propertyB.toString().toLowerCase() ? 1 : -1) * (this.sort.direction == 'asc' ? 1 : -1);

      }


    });
  }
}
