import {Component, EventEmitter, Input, OnInit, ViewChild, AfterViewInit, ViewChildren, QueryList} from '@angular/core';
import {Workspace} from "../../../models/workspace";
import {WorkspaceComponent} from "./workspace/workspace.component";
import {Sample} from "../../../models/sample";
import {AngularFireDatabase} from "angularfire2/database";
import {WorkspaceService} from "../../../services/database-services/workspace.service";

@Component({
	selector: 'app-workspaces',
	templateUrl: './workspaces.component.html',
	styleUrls: ['./workspaces.component.css']
})
export class WorkspacesComponent implements OnInit, AfterViewInit {

	@Input()
	workspaces: Workspace[];

	@Input()
	sample: Sample;

	@Input()
	authenticated: boolean;

	tabSelectEmitter = new EventEmitter<Workspace>();

	@ViewChildren(WorkspaceComponent)
	workspaceComponent: QueryList<WorkspaceComponent>;

	selectedIndex: number = 0;

	constructor(
		private workspaceService: WorkspaceService,
	) {
	}

	ngOnInit() {

	}


	ngAfterViewInit() {

		// setTimeout(() => {
		// 	this.selectedIndex = 1;
		// }, 3000);
	}

	tabSelectChange(event: any) {
		console.log(event);
		// this.tabSelectEmitter.emit(this.workspaces[event.index]);
		this.workspaceComponent.forEach(component => component.tabChange(this.workspaces[event.index]));
	}

	onDuplicate($event) {
		console.log($event);
		// it is the workspace
		this.workspaces.push($event);
		// let newComponent = this.workspaceComponent[this.workspaceComponent.length - 1];
		// newComponent.editted = true;
		this.selectedIndex = this.workspaces.length - 1;
		// setTimeout(() => {
		// 	this.workspaceComponent.forEach(component => component.tabChange(this.workspaces[this.selectedIndex], {editted: true}));
		// }, 300);
	}

	onNewWorkspace() {
		console.log('NEw workspace from workspaceS compoentn');
		let newWorkspace = new Workspace({
			// set user as ws_creator
			// $key: this.workspaceService.getNewId(this.sample.$key),
      $key: 'new-workspace',
      sp_id: this.sample.$key,
			ws_name: 'new workspace',
			ws_des: 'new description',
		});
		this.onDuplicate(newWorkspace);
	}

	// createNewWorkspaceKey(): string {
	// 	return this.afDB.database.ref(`workspaces/${this.sample.$key}`).push().key;
	// }

}
