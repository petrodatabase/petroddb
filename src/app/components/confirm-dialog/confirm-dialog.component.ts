import {Component, Inject, OnInit} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from "@angular/material";

export interface ConfirmConfig {
	content: string;
	title: string;
}

@Component({
	selector: 'app-confirm-dialog',
	templateUrl: './confirm-dialog.component.html',
	styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

	constructor(
		public dialogRef: MdDialogRef<ConfirmDialogComponent>,
		@Inject(MD_DIALOG_DATA) public data: ConfirmConfig,
	) {

	}

	ngOnInit() {
	}

	onCloseCancel() {
		this.dialogRef.close({
			data: false,
		});
	}

	onCloseConfirm() {
		this.dialogRef.close({
			data: true,
		});
	}
}
