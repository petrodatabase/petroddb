import {BehaviorSubject} from "rxjs/BehaviorSubject";
// import {Analysis} from "../models/analysis";
import {Component, ElementRef, ViewChild} from '@angular/core';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import {Project} from "../models/project";


export class ProjectTableDatabase {
	/** Stream that emits whenever the data has been modified. */
	dataChange: BehaviorSubject<Project[]> = new BehaviorSubject<Project[]>([]);
	get data(): Project[] { return this.dataChange.value; }

	 constructor(public projs: Project[]) {
		// Fill up the database with 100 users.
		// for (let i = 0; i < 100; i++) { this.addUser(); }
		// alys.forEach(v => {
		// 	this.addAly(v);
		// })
		this.loadDB(this.projs);
	}


	loadDB(projs: Project[]) {
		this.projs = projs;
		this.dataChange.next(projs);
	}
}
