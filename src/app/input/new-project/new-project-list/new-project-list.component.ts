import {Component, Inject, OnInit} from '@angular/core';
import {Project} from "../../../models/project";
import {MD_DIALOG_DATA, MdDialogRef} from "@angular/material";

@Component({
	selector: 'app-new-project-list',
	templateUrl: './new-project-list.component.html',
	styleUrls: ['./new-project-list.component.css']
})
export class NewProjectListComponent implements OnInit {

	projects: Project[];
	constructor(
		public dialogRef: MdDialogRef<NewProjectListComponent>,
		@Inject(MD_DIALOG_DATA) public data: any,
	) {
		this.projects = data.projects;
	}

	ngOnInit() {
	}

	onCloseCancel() {
		this.dialogRef.close({
			data: false,
		});
	}

}
