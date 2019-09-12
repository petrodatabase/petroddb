import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Workspace} from "../../../../models/workspace";
import {Sample} from "../../../../models/sample";
import {MdDialog} from "@angular/material";
import {ImageSelectDialogComponent} from "../../image-select-dialog/image-select-dialog.component";
import {ImgRel} from "../../../../models/img-rel";
import {MakelinkDialogComponent} from "../../makelink-dialog/makelink-dialog.component";
import {WorkspaceService} from "../../../../services/database-services/workspace.service";
import {ConfirmService} from "../../../../components/confirm-dialog/confirm.service";
import {AlertService} from "../../../../components/alert-dialog/alert.service";
import {ImageModelService} from "../../../../services/database-services/image-model.service";
import {ImageModel} from "../../../../models/image-model";
import {User} from "../../../../models/user";
import {environment} from "../../../../../environments/environment";
import {ImageDialogComponent} from "../../sample-image-list/image-dialog/image-dialog.component";
import {MakeLinkCanvasAlready} from "../../../fabric-classes/make-link-canvas-already";
import {MakelinkDialogAlreadyComponent} from "../../makelink-dialog/makelink-dialog-already.component";
import { Globals } from '../../../../globals';

declare var jquery: any;
declare var $: any;
declare var vis: any;

interface WorkspaceImageLine {
	images: ImgRel[],
	lines: ImgRel[],
}

@Component({
	selector: 'app-workspace',
	templateUrl: './workspace.component.html',
	styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnInit, AfterViewInit {
  globals: Globals;
	workspace: Workspace;
	imageDoubleClickRel : ImgRel[];
  imageDoubleClickModel: ImageModel;
  lineDoubleClickRel : ImgRel[];
	@Input()
	set setWorkspace(ws: Workspace) {
		this.workspace = ws;
	}

	@Input()
	workspaces: Workspace[];

	@Input()
	authenticated: boolean;

	editQueue: WorkspaceImageLine[];

	@Input()
	index: number;

	_tabIndex: number;
	@Input()
	set tabIndex(t: number) {
		this._tabIndex = t;
		if (t == this.index) {
			this.instantiateNetwork();
		}
	}

	@Input()
	sample: Sample;

	@Output()
	onDuplicate = new EventEmitter<Workspace>();

	network: any;
	nodes: any[];
	edges: any[];
	networkData: any;
	networkOption: any;
	editted: boolean;
	infoEditting: boolean;

	imageSelecDialogConfig = {
		disableClose: true,
		panelClass: 'custom-overlay-pane-class',
		hasBackdrop: true,
		backdropClass: '',
		width: '1000px',
		height: '800px',
		position: {
			top: '',
			bottom: '',
			left: '',
			right: ''
		},
		data: [],
		// callback: null,
	};

	makeLinkDialogConfig = {
		disableClose: true,
		panelClass: 'custom-overlay-pane-class',
		hasBackdrop: true,
		backdropClass: '',
		// width: '1200px',
		// height: '800px',
		position: {
			top: '',
			bottom: '',
			left: '',
			right: ''
		},
		data: {},
	};

	constructor(
		public mdDialog: MdDialog,
		private workspaceService: WorkspaceService,
		private confirmService: ConfirmService,
		private alertService: AlertService,
    private imageModelService: ImageModelService
	) {
		this.editQueue = [];
		this.editted = false;
		this.infoEditting = false;
		this.globals = new Globals();
	}

	ngOnInit() {
	}

	ngAfterViewInit() {
		console.log(this.index);
		this.initNetworkConfig();
		if (this.index == 0) {
		}
	}

	// FIXME: call on tab change from workspaces component
	tabChange(ws: Workspace, params: any = {}) {
		console.log(ws);
		if (ws.$key == this.workspace.$key && !this.network) {
			console.log(params['editted']);
			if (params['editted']) {
				this.editted = true;
			}
			console.log(this.editted);
			this.instantiateNetwork();
		}
		else {
			console.log(ws.$key);
			console.log(this.workspace.$key);

		}
	}

	onUndo() {
		if (confirm(`Are you sure to undo the change`)) {
			let previous = this.editQueue.pop();
			this.editted = true;
			this.workspace.images = previous.images;
			this.workspace.lines = previous.lines;
			this.instantiateNetwork();
		}
	}

	onSave() {
		this.confirmService.openConfirm(`Are you sure to save this workspace`, 'Workspace',
			() => {
				// yesy
        console.log(this.workspace);
        if(this.workspace.$key !== 'new-workspace' && this.workspace.$key !== null){
          this.workspaceService.updateWorkspaceMongo(this.workspace);
        }
        else{
          this.workspaceService.createWorkspaceMongo(this.workspace);
        }
			},
			() => {

			}
		);
	}

	onDelete() {
		// delete workspace
		this.confirmService.openConfirm(`Are you sure to delete this workspace`, 'Workspace',
			() => {
				// yes
				this.sample.workspaces.splice(this.sample.workspaces.indexOf(this.workspace), 1);
				// this.workspaceService.deleteWorkspace(this.sample.$key, this.workspace.$key);
        console.log(this.workspace.$key);
        this.workspaceService.deleteWorkspaceMongo(this.workspace.$key);

      },
			() => {}
		);
	}

	onNewWorkspace() {
		let newWorkspace = new Workspace({
			// set user as ws_creator
			$key: 'new-workspace',
			// $key: this.workspaceService.getNewId(this.sample.$key),
			sp_id: this.sample.$key,
			ws_name: 'new workspace',
			ws_des: 'new description',
		});
		this.onDuplicate.emit(newWorkspace);
	}

	duplicate() {
		// event duplicating event
		if (confirm('Are you sure to duplicate this workspace')) {
			let newWorkspace = this.workspace.clone();
			// newWorkspace.$key = this.workspaceService.getNewId(this.sample.$key);
      newWorkspace.$key = 'new-workspace';
      newWorkspace.ws_name += '_duplicate';
			this.onDuplicate.emit(newWorkspace);
		}
	}

	// before making changes enqueue the old one
	enqueueEditWorkspace() {
		this.editted = true;
		let images = this.workspace.images.map(v => v.clone());
		let lines = this.workspace.lines.map(v => v.clone());
		this.editQueue.push({
			images: images,
			lines: lines,
		});
		console.log(this.editQueue)
	}

	initNetworkConfig() {
		this.networkOption = {
			layout: {
				hierarchical: {
					direction: 'LR',
					levelSeparation: 250,
					sortMethod: 'directed',
				}
				// randomSeed: 1
			},
			nodes: {
				borderWidth: 4,
				size: 30,
				color: {
					border: '#406897',
					background: '#6AAFFF',
          highlight:{
					  border: '#ff0000',
          }
				},
				font: {color: '#605fee'},
				shapeProperties: {
					useBorderWithImage: true
				}

			},
			manipulation: {
				addNode: (data, callback) => {
					this.addNode(data, callback);
				},
				editEdge: false,

				addEdge: (data, callback) => {
					if (data.from == data.to) {
						alert('You cannot connect an image to itself');
						return;
					}
					this.addEdge(data, callback);
				},
				deleteNode: (data, callback) => {
					this.deleteNode(data, callback);
				},
				deleteEdge: (data, callback) => {
					this.deleteEdge(data, callback);
				},

			}
		};

	}

	instantiateNetwork() {
		// if ()
		if (this.network) {
			this.network.destroy();
			this.network = null;
		}

		this.networkData = {
			// nodes: this.workspace.images,
			nodes: new vis.DataSet(),
			// edges: this.workspace.lines
			edges: new vis.DataSet(),
		};

		this.networkData.nodes.add(this.workspace.images);
		this.networkData.edges.add(this.workspace.lines);

		let id = `vis-workspace-${this.workspace.$key}`;
		console.log(id);

		let container = null;
		// do {
		// } while (!container);

		setTimeout(() => {

			container = document.getElementById(id);
			if (!container) {
				// this.instantiateNetwork();
				console.log(`cannot create network of ${id}`);
			}
			else {
				this.network = new vis.Network(container, this.networkData, this.networkOption);
				this.workspaceEventBind();

			}

		}, 500);
	}


	// operation on add - delete
	// delete node information will be in control!
	addNode(data, callback) {
		// document.getElementById('node-label').value = data.label;
		// document.getElementById('node-saveButton').onclick = saveNodeData.bind(this, data, callback);
		// document.getElementById('node-cancelButton').onclick = clearNodePopUp.bind();
		// document.getElementById('node-popUp').style.display = 'block';
		console.log(data,this.sample.img);
		this.imageSelecDialogConfig.data = this.sample.img;
		console.log(this.imageSelecDialogConfig);
		let imgSelectDialogRef = this.mdDialog.open(ImageSelectDialogComponent, this.imageSelecDialogConfig);

		imgSelectDialogRef.afterClosed().subscribe(
			img => {
				if (img) {
					// selected
					let newNode = new ImgRel(data);
					// newNode.$key = this.workspaceService.getNewId(this.sample.$key);
          /*
          * sample_keys:
          *   [work_space_key1:
          *       ws_name:
          *       img_rel
          *   ]
          * */
					// newNode.id = this.workspaceService.getNewId(this.sample.$key);
					newNode.label = img.img_name;
					newNode.img_id = img.$key;
					newNode.shape = 'image';
					newNode.image = img.img_url || `${this.globals.uploadHost}/${img.sp_id}/${img.$key}/${img.stored_file_name}`;
					newNode.type = 'img';
					this.enqueueEditWorkspace();
					this.workspace.images.push(newNode);
					callback(newNode);
					console.log(this.workspace);
				}
				else {
					console.log('No image selection made');
				}
				// console.log(`open authdialog returned`);
				// console.log(result);
			}
		);
	}

	addEdge(data, callback) {
		console.log(data);
		console.log(data);

		let fromImgRel = this.workspace.images.find(v => v.id == data.from);
		let toImgRel = this.workspace.images.find(v => v.id == data.to);
		let targetImgRel = new ImgRel(data);

		this.makeLinkDialogConfig.data = {
			workspace: this.workspace,
			from: fromImgRel,
			to: toImgRel,
			target: targetImgRel,
		};
		console.log(this.makeLinkDialogConfig);
		let makeLinkDialogRef = this.mdDialog.open(MakelinkDialogComponent, this.makeLinkDialogConfig);

		makeLinkDialogRef.afterClosed().subscribe(
			(targetImgRel: ImgRel) => {
				if (targetImgRel) {
					// selected
					// let newLine = new ImgRel(data);
					let id = this.workspace.lines.length + 1;
					// targetImgRel.$key = this.workspaceService.getNewId(this.sample.$key);
					targetImgRel.id = fromImgRel.label + '-' + toImgRel.label ;
					targetImgRel.label = "line" + id;
					// newLine.img_id = img.img_id;
					// newLine.shape = 'image';
					// newLine.image = img.img_url;
					targetImgRel.type = 'line';

					// newLine._setData(targetImgRel, ImgRel.schema);
					callback(targetImgRel);

					this.enqueueEditWorkspace();
					this.workspace.lines.push(targetImgRel);
					console.log(this.workspace);
				}
				else {
					console.log('No image selection made');
				}
				// console.log(`open authdialog returned`);
				// console.log(result);
			}
		);
		// this.testSaveEditData(data, callback);
	}

	deleteNode(data, callback) {
		if (confirm(`Are you sure to delete this node?`)) {
			// delete the node from workspace
			this.enqueueEditWorkspace();
			// del links
			// this.networkData.edges.remove({id: this.workspace.lines.find(v => v.from == data.id).id});
			// this.networkData.edges.remove({id: this.workspace.lines.find(v => v.to == data.id).id});
			// this.networkData.edges.remove({to: data.id});
      this.workspace.lines = this.workspace.lines.filter(v => v['from'] != data.id && v['to'] != data.id);
      // ['from', 'to'].forEach(k => {
		// 	});

			this.workspace.images.splice(this.workspace.images.indexOf(data), 1);
			callback(data);
		}
	}

	deleteEdge(data, callback) {
		if (confirm(`Are you sure to delete this node?`)) {
			// delete the node from workspace
			this.enqueueEditWorkspace();
			this.workspace.lines.splice(this.workspace.lines.indexOf(data), 1);
			callback(data);

		}
	}



	// editEdge(data, callback) {
	// 	this.testSaveEditData(data, callback);
	// }


	// testSaveEditData(data, callback) {
	// 	if (typeof data.to === 'object')
	// 		data.to = data.to.id;
	// 	if (typeof data.from === 'object')
	// 		data.from = data.from.id;
	// 	data.label = 'edge label';
	// 	data.arrows = 'to';
	// 	// data.label = document.getElementById('edge-label').value;
	// 	// clearEdgePopUp();
	// 	callback(data);
	// }


	// LIST of workspace event binding
	workspaceOnClick(params) {
    console.log(params)
	}

	workspaceOnDoubleClick(params) {

    console.log(params);
    if (params.nodes.length!=0){
      let thumbnail_id = params.nodes[0];

      this.imageDoubleClickRel = this.workspace.images.filter(v => v.id == thumbnail_id);
      let stock_image_id = this.imageDoubleClickRel[0].img_id;

      this.imageModelService.getImageMongo(stock_image_id).subscribe(img => {this.imageDoubleClickModel = new ImageModel(img)
        let config = environment.defaultDialogConfig;
        config.data = {
          img: this.imageDoubleClickModel,
          authenticated: this.authenticated
        };
        let dialogRef = this.mdDialog.open(ImageDialogComponent, config);
          dialogRef.afterClosed().subscribe((result) => {
          });
      });
    }
    else if (params.edges.length !=0 && params.nodes.length == 0){
      let thumbnail_id = params.edges[0];
      console.log(thumbnail_id);
      this.lineDoubleClickRel = this.workspace.lines.filter(v => v.id == thumbnail_id);
      let data = this.lineDoubleClickRel[0];
      console.log(data);
      let fromImgRel = this.workspace.images.find(v => v.id == data.from);
      let toImgRel = this.workspace.images.find(v => v.id == data.to);
      let targetImgRel = new ImgRel(data);

      this.makeLinkDialogConfig.data = {
        workspace: this.workspace,
        from: fromImgRel,
        to: toImgRel,
        target: data,
      };

      let makeLinkDialogRef = this.mdDialog.open(MakelinkDialogAlreadyComponent, this.makeLinkDialogConfig);
      makeLinkDialogRef.afterClosed().subscribe((result) => {

      });
    }
	}

	workspaceOnContext(params) {

	}

	workspaceOnDragStart(params) {

	}

	workspaceOnDragging(params) {

	}

	workspaceOnDragEnd(params) {

	}

	workspaceOnZoom(params) {

	}

	workspaceOnShowPopup(params) {

	}

	workspaceOnHidePopup() {

	}

	workspaceOnSelect(params) {

	}

	workspaceOnSelectNode(params) {

	}

	workspaceOnSelectEdge(params) {

	}

	workspaceOnDeselectNode(params) {

	}

	workspaceOnDeselectEdge(params) {

	}

	workspaceOnHoverNode(params) {

	}

	workspaceOnHoverEdge(params) {

	}

	workspaceOnBlurEdge(params) {

	}

	workspaceOnBlurNode(params) {

	}

	// call after instantiate network
	workspaceEventBind() {
		this.network.on("click", (params) => {
			// params.event = "[original event]";
			// document.getElementById('eventSpan').innerHTML = '<h2>Click event:</h2>' + JSON.stringify(params, null, 4);
			// console.log('click event, getNodeAt returns: ' + this.getNodeAt(params.pointer.DOM));
			// console.log('click');
			// console.log(params);


      this.workspaceOnClick(params);
		});
		this.network.on("doubleClick", (params) => {
			// params.event = "[original event]";
			// document.getElementById('eventSpan').innerHTML = '<h2>doubleClick event:</h2>' + JSON.stringify(params, null, 4);
			// console.log('doubleClick');
			// console.log(params);
			this.workspaceOnDoubleClick(params);

		});
		this.network.on("oncontext", (params) => {
			// params.event = "[original event]";
			// document.getElementById('eventSpan').innerHTML = '<h2>oncontext (right click) event:</h2>' + JSON.stringify(params, null, 4);
			// console.log('oncontext');
			// console.log(params);
			this.workspaceOnContext(params);

		});
		this.network.on("dragStart", (params) => {
			// params.event = "[original event]";
			// document.getElementById('eventSpan').innerHTML = '<h2>dragStart event:</h2>' + JSON.stringify(params, null, 4);
			// console.log('dragStart');
			// console.log(params);
			this.workspaceOnDragStart(params);

		});
		this.network.on("dragging", (params) => {
			// params.event = "[original event]";
			// document.getElementById('eventSpan').innerHTML = '<h2>dragging event:</h2>' + JSON.stringify(params, null, 4);
			// console.log('dragging');
			// console.log(params);
			this.workspaceOnDragging(params);

		});
		this.network.on("dragEnd", (params) => {
			// params.event = "[original event]";
			// document.getElementById('eventSpan').innerHTML = '<h2>dragEnd event:</h2>' + JSON.stringify(params, null, 4);
			// console.log('dragEnd');
			// console.log(params);
			this.workspaceOnDragEnd(params);

		});
		this.network.on("zoom", (params) => {
			// document.getElementById('eventSpan').innerHTML = '<h2>zoom event:</h2>' + JSON.stringify(params, null, 4);
			// console.log('zoom');
			// console.log(params);
			this.workspaceOnZoom(params);

		});
		this.network.on("showPopup", (params) => {
			// document.getElementById('eventSpan').innerHTML = '<h2>showPopup event: </h2>' + JSON.stringify(params, null, 4);
			// console.log('showPopup');
			// console.log(params);
			this.workspaceOnShowPopup(params);

		});
		this.network.on("hidePopup", function () {
			// console.log('hidePopup Event');
			this.workspaceOnHidePopup();

		});
		this.network.on("select", (params) => {
			// console.log('select Event:', params);
			this.workspaceOnSelect(params);

		});
		this.network.on("selectNode", (params) => {
			// console.log('selectNode Event:', params);
			this.workspaceOnSelectNode(params);

		});
		this.network.on("selectEdge", (params) => {
			// console.log('selectEdge Event:', params);
			this.workspaceOnSelectEdge(params);

		});
		this.network.on("deselectNode", (params) => {
			// console.log('deselectNode Event:', params);
			this.workspaceOnDeselectNode(params);

		});
		this.network.on("deselectEdge", (params) => {
			// console.log('deselectEdge Event:', params);
			this.workspaceOnDeselectEdge(params);

		});
		this.network.on("hoverNode", (params) => {
			// console.log('hoverNode Event:', params);
			this.workspaceOnHoverNode(params);

		});
		this.network.on("hoverEdge", (params) => {
			// console.log('hoverEdge Event:', params);
			this.workspaceOnHoverEdge(params);

		});
		this.network.on("blurNode", (params) => {
			// console.log('blurNode Event:', params);
			this.workspaceOnBlurNode(params);

		});
		this.network.on("blurEdge", (params) => {
			// console.log('blurEdge Event:', params);
			this.workspaceOnBlurEdge(params);

		});
	}


}
