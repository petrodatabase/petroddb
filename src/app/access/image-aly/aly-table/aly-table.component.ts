
import {Component, OnInit, ElementRef, ViewChild, Input, AfterViewInit} from '@angular/core';
import {DataSource} from '@angular/cdk/collections';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import {AlyTableDatabase} from "../../../elements/aly-table-database";
import {Analysis} from "../../../models/analysis";
import {AlyTableDataSource} from "../../../elements/aly-table-data-source";


@Component({
	selector: 'app-aly-table',
	templateUrl: './aly-table.component.html',
	styleUrls: ['./aly-table.component.css']
})
export class AlyTableComponent implements OnInit, AfterViewInit {

	_alys: Analysis[];
	@Input() set alys(alys: Analysis[]) {
		console.log(alys);
		this._alys = alys;
		this.database = new AlyTableDatabase(this._alys);
		this.dataSource = new AlyTableDataSource(this.database);

		Observable.fromEvent(this.filter.nativeElement, 'keyup')
			.debounceTime(150)
			.distinctUntilChanged()
			.subscribe(() => {
				if (!this.dataSource) { return; }
				this.dataSource.filter = this.filter.nativeElement.value;
			});
	}

	_width: number = 300;
	_height: number = 550;
	@Input() set width(w:  number) {
		this._width = w - 18;
	}

	@Input() set height(h: number) {
		this._height = h - 70;
	}

	selected: any;

	elementFilter: string = '';
	elementFilter2: string = '';
	constructor() {
		this.selected = {};
	}

	// displayedColumns = ['select', 'ref_id', 'ref_name', 'color', 'type', 'instrument', 'pos_x', 'pos_y', 'elementFilter'];
	displayedColumns = ['select', 'ref_id', 'color', 'type', 'instrument', 'pos_x', 'pos_y', 'elementFilter', 'elementFilter2'];
	database: AlyTableDatabase;
	dataSource: AlyTableDataSource | null;

	@ViewChild('aly_filter') filter: ElementRef;

	@ViewChild('eleFilter') eleFilter: ElementRef;
	@ViewChild('eleFilter2') eleFilter2: ElementRef;

	ngOnInit() {


		// Observable.fromEvent(this.eleFilter.nativeElement, 'keyup')
		// 	.debounceTime(150)
		// 	.distinctUntilChanged()
		// 	.subscribe(() => {
		// 		if (!this.dataSource) { return; }
		// 		// this.dataSource.filter = this.filter.nativeElement.value;
		//
		// 	});

		this._alys.forEach(v => {
			this.selected[v.$key] = false;
		})
	}

	ngAfterViewInit() {

	}

	toggleSelectAll() {
		if (this.selected[this._alys[0].$key]) {
			// toggle false
			this._alys.forEach(v => {
				this.selected[v.$key] = false;
			})
		}
		else {
			// toggle true
			this._alys.forEach(v => {
				this.selected[v.$key] = true;
			})
		}
		console.log(this.selected);
	}

	eleChange() {
		if (!this.dataSource) { return; }
		this.dataSource.filter = this.filter.nativeElement.value;
	}

	eleChange2() {
		if (!this.dataSource) { return; }
		this.dataSource.filter = this.filter.nativeElement.value;
	}

}


