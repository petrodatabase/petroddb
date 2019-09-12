import {Component, OnInit, Inject} from '@angular/core';
import {MdDialogRef} from "@angular/material";
import { MD_DIALOG_DATA } from '@angular/material';

interface AuthData {
	message: string
}


@Component({
	selector: 'app-auth',
	templateUrl: './auth.component.html',
	styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

	constructor(
		public dialogRef: MdDialogRef<AuthComponent>,
		@Inject(MD_DIALOG_DATA) public data: AuthData,
	) {
	}

	ngOnInit() {
	}

	onCloseConfirm (data?: any) {
		this.dialogRef.close({
			data: 'data after close',
		})
	}

}
