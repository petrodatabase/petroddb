import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
// import {Volcano} from "../../../models/volcano";
// import {VolcanoTableDatabase} from "../../../elements/volcano-table-database";
// import {VolcanoTableDatasource} from "../../../elements/volcano-table-datasource";

import {Observable} from "rxjs/Observable";
import {Publication} from "../../models/publication";
import {PublicationTableDatabase} from "../../elements/publication-table-database";
import {PublicationTableDatasource} from "../../elements/publication-table-datasource";
import {MdSort} from "@angular/material";

@Component({
  selector: 'app-publication-table',
  templateUrl: './publication-table.component.html',
  styleUrls: ['./publication-table.component.css']
})
export class PublicationTableComponent implements OnInit {
  _pubs: Publication[];
  _pubSelected: any = {};

  @ViewChild(MdSort) sort: MdSort;
	@Input() set pubs(vols: Publication[]) {
		// console.log(vols);
		this._pubs = vols;
		this.database = new PublicationTableDatabase(this._pubs);
		this.dataSource = new PublicationTableDatasource(this.database, this.sort);

		this._pubSelected = {};
		this._pubs.forEach(v => {
		  this._pubSelected[v.$key] = false;
    });

		Observable.fromEvent(this.filter.nativeElement, 'keyup')
			.debounceTime(150)
			.distinctUntilChanged()
			.subscribe(() => {
				if (!this.dataSource) { return; }
				this.dataSource.filter = this.filter.nativeElement.value;
			});
	}

	_width: number = 300;
	_height: number = 500;
	@Input() set width(w:  number) {
		this._width = w - 18;
	}

	@Input() set height(h: number) {
		this._height = h - 70;
	}

	@Input()
  allowSelect: boolean = false;

	@Input()
  allowDelete: boolean = false;


	@Output()
  onSelected = new EventEmitter<string[]>();

	@Output()
  onDeleteSelected = new EventEmitter<string[]>();



	selected: any;


	elementFilter: string = '';
	constructor() {
		this.selected = {};
		this._pubSelected = {};
	}

	// displayedColumns = ['select', 'ref_id', 'ref_name', 'color', 'type', 'instrument', 'pos_x', 'pos_y', 'elementFilter'];
	// displayedColumns = ['ref_id', 'color', 'type', 'instrument', 'pos_x', 'pos_y', 'elementFilter'];
	displayedColumns = ['select', 'cb_auth', 'cb_title', 'cb_journ', 'cb_pub', 'cb_doi', 'cb_isbn', 'cb_year', 'cb_url'];
	database: PublicationTableDatabase;
	dataSource: PublicationTableDatasource | null;

	@ViewChild('pub_filter') filter: ElementRef;

	// @ViewChild('eleFilter') eleFilter: ElementRef;

	ngOnInit() {

		// Observable.fromEvent(this.eleFilter.nativeElement, 'keyup')
		// 	.debounceTime(150)
		// 	.distinctUntilChanged()
		// 	.subscribe(() => {
		// 		if (!this.dataSource) { return; }
		// 		// this.dataSource.filter = this.filter.nativeElement.value;
		//
		// 	});

		// this._projs.forEach(v => {
		// 	this.selected[v.$key] = false;
		// })
	}

	ngAfterViewInit() {

	}

	eleChange() {
		if (!this.dataSource) { return; }
		this.dataSource.filter = this.filter.nativeElement.value;
	}

	outputSelected() {
	  let keys = Object.keys(this._pubSelected).filter(k => this._pubSelected[k]);
	  this.onSelected.emit(keys);
  }

  outputDeleteSelected() {
	  let keys = Object.keys(this._pubSelected).filter(k => this._pubSelected[k]);
	  this.onDeleteSelected.emit(keys);
  }


}
