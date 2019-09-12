import {Component, Inject, OnInit} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from "@angular/material";
import {Report} from "../../models/report";
import {AuthService} from "../../auth/auth.service";
import {AlertService} from "../alert-dialog/alert.service";
import {ReportService} from "../../services/database-services/report.service";

export interface ReportData {
	title: string,
	description: string
}

@Component({
	selector: 'app-report',
	templateUrl: './report.component.html',
	styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

	reportData: Report;
	schema = Report.schema;

	loading: boolean = false;
	constructor(
		public dialogRef: MdDialogRef<ReportComponent>,
		private alertService: AlertService,
		private authService: AuthService,
		private reportService: ReportService,
		@Inject(MD_DIALOG_DATA) public data: Report,
	) {
		this.reportData = data;
		this.reportData.us_id = this.authService.currentUserId;
	}

	get authenticated() {
		return this.authService.authenticated;
	}

	ngOnInit() {
	}

	onCloseCancel() {
		this.dialogRef.close({
			data: false,
		});
	}

	onCloseConfirm() {
		// upload problem
		this.loading = true;
		this.reportService.createReport(this.reportData,
			() => {
				this.loading = false
				this.alertService.openAlert(`Thank you for your feedback!`, `Thank you`, () => {
					this.dialogRef.close({
						data: true,
					});
				});
			}
		);

	}

}
