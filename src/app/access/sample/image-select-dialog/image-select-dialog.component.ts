import {Component, Inject, OnInit} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from "@angular/material";
import {ImageModel} from "../../../models/image-model";
import { Globals } from '../../../globals';

@Component({
	selector: 'app-image-select-dialog',
	templateUrl: './image-select-dialog.component.html',
	styleUrls: ['./image-select-dialog.component.css']
})
export class ImageSelectDialogComponent implements OnInit {
  globals: Globals;
	selectedImage: ImageModel;
	constructor(public dialogRef: MdDialogRef<ImageSelectDialogComponent>,
				@Inject(MD_DIALOG_DATA) public data: ImageModel[],) {
    this.globals = new Globals();
    console.log(data);
	}

	ngOnInit() {
	}

	onCloseConfirm() {
		this.dialogRef.close(this.selectedImage);
	}

	onCloseCancel() {
		this.dialogRef.close(null);
	}

	selectImage(img) {
		if (this.selectedImage === img) {
			// delected
			this.selectedImage = null;
			return;
		}
		this.selectedImage = img;
	}

}
