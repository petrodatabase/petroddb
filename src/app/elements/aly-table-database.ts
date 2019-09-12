import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Analysis} from "../models/analysis";
import {Component, ElementRef, ViewChild} from '@angular/core';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';

export class AlyTableDatabase {
	/** Stream that emits whenever the data has been modified. */
	dataChange: BehaviorSubject<Analysis[]> = new BehaviorSubject<Analysis[]>([]);
	get data(): Analysis[] { return this.dataChange.value; }

	constructor(public alys: Analysis[]) {
		// Fill up the database with 100 users.
		// for (let i = 0; i < 100; i++) { this.addUser(); }
		// alys.forEach(v => {
		// 	this.addAly(v);
		// })
		this.loadDB(this.alys);
	}

	addAly(aly: Analysis) {
		// const copiedData = this.data.splice();
		// copiedData.push(aly);
		// this.dataChange.next(copiedData);
	}

	loadDB(alys: Analysis[]) {
		this.alys = alys;
		this.dataChange.next(alys);
	}

	/** Adds a new user to the database. */
	// addUser() {
	// 	const copiedData = this.data.slice();
	// 	copiedData.push(this.createNewUser());
	// 	this.dataChange.next(copiedData);
	// }

	/** Builds and returns a new User. */
	// private createNewUser() {
	// 	const name =
	// 		NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
	// 		NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';
	//
	// 	return {
	// 		id: (this.data.length + 1).toString(),
	// 		name: name,
	// 		progress: Math.round(Math.random() * 100).toString(),
	// 		color: COLORS[Math.round(Math.random() * (COLORS.length - 1))]
	// 	};
	// }
}
