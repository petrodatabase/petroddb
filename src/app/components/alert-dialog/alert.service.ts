import {Injectable} from '@angular/core';
import {MdDialog} from "@angular/material";
import {AlertDialogComponent} from "./alert-dialog.component";

@Injectable()
export class AlertService {

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

	openAlert(content: string, title: string = 'Alert', onClose: any = null) {
		this.config.data = {
			content: content,
			title: title || 'Confirm your choice?',
		};
		let dialogRef = this.dialog.open(AlertDialogComponent, this.config);
		dialogRef.afterClosed().subscribe(
			(result: any ) => {
				console.log(result);
				// if (result.data) {
				// 	// confirm
				// 	if (yes) {
				// 		yes();
				// 	}
				// }
				// else {
				// 	// no
				// 	if (no) {
				// 		no();
				// 	}
				// }
				if (onClose) {
					onClose();
				}
			}
		);
	}

}
