import {Component, Inject, OnInit} from '@angular/core';
import {Volcano} from "../../../models/volcano";
import {MD_DIALOG_DATA, MdDialogRef} from "@angular/material";

@Component({
	selector: 'app-new-volcano-list',
	templateUrl: './new-volcano-list.component.html',
	styleUrls: ['./new-volcano-list.component.css']
})
export class NewVolcanoListComponent implements OnInit {

	volcanos: Volcano[];
	constructor(
		public dialogRef: MdDialogRef<NewVolcanoListComponent>,
		@Inject(MD_DIALOG_DATA) public data: any,
	) {
		this.volcanos = data.volcanos;
	}

	ngOnInit() {
	}

	onCloseCancel() {
		this.dialogRef.close({
			data: false,
		});
	}


}
