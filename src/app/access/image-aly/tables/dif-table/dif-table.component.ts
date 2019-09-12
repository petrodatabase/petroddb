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
import {Diffusion} from "../../../../models/diffusion";
import {DifTableDatabase} from "../../../../elements/dif-table-database";
import {DifTableDataSource} from "../../../../elements/dif-table-data-source";

@Component({
	selector: 'app-dif-table',
	templateUrl: './dif-table.component.html',
	styleUrls: ['./dif-table.component.css']
})
export class DifTableComponent implements OnInit {

	@Input()
	difs: Diffusion[];
	displayedColumns = ['dif_name',
		'dif_instrument', 'dif_time', 'dif_comment',
		'imgA_ratio_w', 'imgA_ratio_h', 'imgB_ratio_w','imgB_ratio_h'];
	database: DifTableDatabase;
	dataSource: DifTableDataSource | null;

	@ViewChild('dif_filter') filter: ElementRef;

	constructor() {
	}


	ngOnInit() {
		console.log(this.difs);
		this.database = new DifTableDatabase(this.difs);
		this.dataSource = new DifTableDataSource(this.database);
		Observable.fromEvent(this.filter.nativeElement, 'keyup')
			.debounceTime(150)
			.distinctUntilChanged()
			.subscribe(() => {
				if (!this.dataSource) { return; }
				this.dataSource.filter = this.filter.nativeElement.value;
			});
	}


}
