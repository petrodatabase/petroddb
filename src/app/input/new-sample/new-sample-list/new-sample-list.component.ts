import {Component, Inject, OnInit} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from "@angular/material";
import {Sample} from "../../../models/sample";

@Component({
	selector: 'app-new-sample-list',
	templateUrl: './new-sample-list.component.html',
	styleUrls: ['./new-sample-list.component.css']
})
export class NewSampleListComponent implements OnInit {

	samples: Sample[];
	constructor(
		public dialogRef: MdDialogRef<NewSampleListComponent>,
		@Inject(MD_DIALOG_DATA) public data: any,
	) {
		this.samples = data.samples;
	}

	ngOnInit() {
	  console.log(this.samples);
	}

	onCloseCancel() {
		this.dialogRef.close({
			data: false,
		});
	}

}
