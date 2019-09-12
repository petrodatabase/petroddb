import {Injectable} from '@angular/core';
import {MdDialog} from "@angular/material";
import {ConfirmDialogComponent} from "./confirm-dialog.component";

@Injectable()
export class ConfirmService {

	config = {
		disableClose: true,
		// panelClass: 'custom-overlay-pane-class',
		panelClass: 'my-full-screen-dialog',
		hasBackdrop: true,
		backdropClass: '',
		width: '',
		// width: '850px',
		height: '',
		// height: '500px',
		position: {
			top: '',
			bottom: '',
			left: '',
			right: ''
		},
		data: {},
	};

	constructor(
		public dialog: MdDialog,
	) {
	}

	openConfirm(content: string, title: string = 'Confirm your choice?', yes: any = null, no: any = null) {
		this.config.data = {
			content: content,
			title: title || 'Confirm your choice?',
		};
		let dialogRef = this.dialog.open(ConfirmDialogComponent, this.config);
		dialogRef.afterClosed().subscribe(
			(result: any ) => {
				console.log(result);
				if (result.data) {
					// confirm
					if (yes) {
						yes();
					}
				}
				else {
					// no
					if (no) {
						no();
					}
				}
			}
		);
	}

}
