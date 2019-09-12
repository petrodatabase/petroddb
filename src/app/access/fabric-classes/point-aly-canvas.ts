import {CanvasModel, ContainerScroll } from "./canvas-model";
import {Analysis} from "../../models/analysis";
import {ManualInterpolator_Linear} from "../../services/point-aly-excel-reader.service";

declare var $: any;

interface CanvasPointAly {
	pointAly: Analysis;
	circle: any;
}



// FIXME: deal with interpolation
export class PointAlyCanvas extends CanvasModel {

	pointAlys: Analysis[];
	createdPointAlys: Analysis[];

	canvasPointAlyList: CanvasPointAly[];

	edittedCanvasPointAlys: CanvasPointAly[];
	removedCanvasPointAlys: CanvasPointAly[];
	containerScroll: ContainerScroll = {top: 0, left: 0};

	createdCanvasPointAlys: CanvasPointAly[];
	mode: string;


	constructor(canvasId: string, width: number, height: number, public getPosMouse = null) {
		super(canvasId, width, height, getPosMouse);
		this.pointAlys = [];
		this.createdPointAlys = [];
		this.canvasPointAlyList = [];
		this.edittedCanvasPointAlys = [];
		this.removedCanvasPointAlys = [];
		this.createdCanvasPointAlys = [];
		this.mode = '';

	}



	getMouseTopLeftPos(options): any | { top; left } {
		// return super.getMouseTopLeftPos(options);
		// let left = options.e.clientX - this.canvas._offset.left ;

		// var top = options.e.clientY - _thisCanvas.canvas._offset.top + $("div.imgLink-img").scrollTop();
		// let top = options.e.clientY - this.canvas._offset.top ;
		// let scrollTop = $(this.canvasId).viewportOffset.top;
		// let scrollLeft = $(this.canvasId).viewportOffset.left;
		let bound = document.getElementById(this.canvasId).getBoundingClientRect();
		// let scrollTop = $(`div#point-aly-wrapper canvas`).viewportOffset.top;
		// let scrollLeft = $(`div#point-aly-wrapper canvas`).viewportOffset.left;
		let scrollTop = bound.top;
		let scrollLeft = bound.left;

		let left = options.e.clientX - scrollLeft;
		let top = options.e.clientY - scrollTop;

		console.log(`mouse: ${options.e.clientX} - ${options.e.clientX}`);
		console.log(`canvas offset: ${this.canvas._offset.left} - this.canvas._offset.top`);
		console.log(`scroll: ${scrollLeft} - ${scrollTop}`);
		console.log(`pos: ${left} - ${top}`);


		// handle scrolling
		left += this.containerScroll.left;
		top += this.containerScroll.top;

		left /= this.currentZoomRatio;
		top /= this.currentZoomRatio;

		return {
			left: left,
			top: top,
		}
	}

	importCanvas(objs: Analysis[]): any {
		 super.importCanvas(objs);
		 this.pointAlys = objs;
		 this.pointAlys.forEach(v => {
		 	this.generatePoint(v, {lockMovement: true});
		 });

		// testing
		// this.createRectangle(null, 10, 10, 'red', {});

		// change canvas size
		this.canvas.renderAll();
	}

	importCreatedPointAlys(objs: Analysis[]): any {
		this.createdPointAlys = objs;
		this.createdPointAlys.forEach(v => {
			this.createRectangle(v, v.pos_pix_x, v.pos_pix_y, 'red');
		})
	}

	// when finish uploading pages
	reTransformCreatedPointAlys() {

	}

	generatePoint(aly: Analysis, params = {}) {
		let circle = this.createPoint(aly, aly.pos_pix_x, aly.pos_pix_y, aly.color, params);
	}


	createPoint(aly: Analysis, clientX, clientY, color, otherParams = {}): any {
		// return super.createPoint(clientX, clientY, color, otherParams, onmodified, onselected, onmoving);
		let canvasPointAly = {
			pointAly: aly,
			circle: null,
		};

		canvasPointAly.circle = super.createPoint(clientX, clientY, (color) ? color : 'blue', {
			lockMovementX: otherParams['lockMovement'] && true, lockMovementY: otherParams['lockMovement'] && true,
			radius: 7,
		}, (obj) => {
			// on modified
		}, (obj) => {
			// on selected
			console.log(canvasPointAly);
			if (this.mode == 'remove') {
				if (confirm("Are you sure to delete this point analysis?")) {
					this.removePoint(canvasPointAly);// remove point add to edited already
				}
			}
			else {
				// show some infor
			}
		}, (obj) => {
			// moving
			canvasPointAly.pointAly.pos_pix_x = obj.left;
			canvasPointAly.pointAly.pos_pix_y = obj.top;
			if (this.mode == 'edit') {
				if (this.edittedCanvasPointAlys.indexOf(canvasPointAly) == -1) {
					// the point is editted
					this.edittedCanvasPointAlys.push(canvasPointAly);
				}
			}

		});

		this.canvasPointAlyList.push(canvasPointAly);
		// console.log(canvasPointAly);
		return canvasPointAly.circle;
	}


	createRectangle(aly: Analysis, clientX, clientY, color, otherParams = {}) : any {
		// return super.createPoint(clientX, clientY, color, otherParams, onmodified, onselected, onmoving);
		let canvasPointAly = {
			pointAly: aly,
			circle: null,
		};

		canvasPointAly.circle = super.createRectangle(clientX, clientY, (color) ? color : 'blue', {
			lockMovementX: otherParams['lockMovement'] && true, lockMovementY: otherParams['lockMovement'] && true,
			width: otherParams['width'] || 12, height: otherParams['height'] || 12,
			// radius: 7,
		}, (obj) => {
			// on modified
		}, (obj) => {
			// on selected
			console.log(canvasPointAly);
			if (this.mode == 'remove') {
				if (confirm("Are you sure to delete this point analysis?")) {
					this.removePoint(canvasPointAly);// remove point add to edited already
				}
			}
			else {
				// show some infor
			}
		}, (obj) => {
			// moving
			canvasPointAly.pointAly.pos_pix_x = obj.left;
			canvasPointAly.pointAly.pos_pix_y = obj.top;
			// if (this.mode == 'edit') {
			// 	if (this.edittedCanvasPointAlys.indexOf(canvasPointAly) == -1) {
			// 		// the point is editted
			// 		this.edittedCanvasPointAlys.push(canvasPointAly);
			// 	}
			// }

			// interpolation!
			if (canvasPointAly == this.createdCanvasPointAlys[0]) {
				// it is the first 1
			}
			else if (canvasPointAly == this.createdCanvasPointAlys[1]) {
				// it is the second 1
			}
			else {
				// re interpolate the rest???
			}

		});

		this.createdCanvasPointAlys.push(canvasPointAly);
		console.log(canvasPointAly);
		this.canvas.renderAll();
		return canvasPointAly.circle;
	}


	removePoint(obj: CanvasPointAly): any {
		// remove it from analysys....
		this.removedCanvasPointAlys.push(obj);
		this.canvasPointAlyList.splice(this.canvasPointAlyList.indexOf(obj) , 1);
		this.pointAlys.splice(this.pointAlys.indexOf(obj.pointAly), 1);
		// notify the events....
		// FIXME: event to remove from outside if needed
		return super.removePoint(obj.circle);
	}

	clearCache() {
		this.removedCanvasPointAlys = [];
		this.edittedCanvasPointAlys = [];
		this.createdCanvasPointAlys = [];
		this.createdPointAlys = [];
		// this.pointAlys = [];
    this.setMode('');
	}

	revertEdit() {
		this.edittedCanvasPointAlys.forEach(v => {
			this.pointAlys.push(v.pointAly);
			this.generatePoint(v.pointAly);
		});
		this.edittedCanvasPointAlys = [];
	}

	revertRemove() {
		this.removedCanvasPointAlys.forEach(v => {
			this.pointAlys.push(v.pointAly);
			this.generatePoint(v.pointAly);
		});
		this.removedCanvasPointAlys = [];
	}

	setLockPointMovement (isLock) {
		if (this.canvas) {
			this.canvasPointAlyList.forEach(v => {
				v.circle.set({
					lockMovementX: isLock, lockMovementY: isLock,
				});
			});
			this.canvas.renderAll();
		}
	}

	createCanvas(): any {
		super.createCanvas();

		this.setCanvasMouseMove((options) => {
			// if (options.target && this.pointHovering) {
			// 	let pointAly = this.canvasPointAlyList.find(v => v.circle == options.target);
			// 	if (pointAly) {
			// 		this.pointHovering(pointAly);
			// 	}
			// }
		});

		this.setCanvasMouseUp((options) => {
			let pos = this.getMouseTopLeftPos(options);
			console.log(pos);
			console.log(this.mode);

			if (this.mode == "create") {
				if (!options.target && this.createdCanvasPointAlys.length < 2 && this.createdPointAlys.length >= 3) {
					// let newPoint = _this.createPointAlyPoint({}, pos.left, pos.top, false, 'cyan');
					// _this.multipleInputPoints.push(newPoint);
					// if (_this.multipleInputPoints.length == 2) {
					// 	_this.pointAlyExcelReader.openForm();
					// }
					let x_interpol = new ManualInterpolator_Linear();
					let y_interpol = new ManualInterpolator_Linear();
					let index = this.createdCanvasPointAlys.length;

					this.createRectangle(this.createdPointAlys[index],
						pos.left, pos.top, this.createdCanvasPointAlys.length == 0 ? 'cyan' : 'yellow',
						{lockMovement: false, width: 18, height: 18})
						.on('moving', () => {
							// on moving

							let interpolOutput_x = [this.createdPointAlys[0].pos_pix_x, this.createdPointAlys[1].pos_pix_x];
							let interpolInput_x = [this.createdPointAlys[0].pos_x, this.createdPointAlys[1].pos_x];
							let interpolOutput_y = [this.createdPointAlys[0].pos_pix_y, this.createdPointAlys[1].pos_pix_y];
							let interpolInput_y = [this.createdPointAlys[0].pos_y, this.createdPointAlys[1].pos_y];

							interpolOutput_y[index] = this.createdCanvasPointAlys[index].circle.top;
							interpolOutput_x[index] = this.createdCanvasPointAlys[index].circle.left;
							x_interpol.importData(interpolInput_x, interpolOutput_x);
							y_interpol.importData(interpolInput_y, interpolOutput_y);
							for (let j = 2; j < this.createdCanvasPointAlys.length; j++) {
								// console.log(`interpolate point ${j}`);
								this.createdCanvasPointAlys[j].pointAly.pos_pix_y = y_interpol.interpolate(this.createdCanvasPointAlys[j].pointAly.pos_y);
								this.createdCanvasPointAlys[j].pointAly.pos_pix_x = x_interpol.interpolate(this.createdCanvasPointAlys[j].pointAly.pos_x);
								this.createdCanvasPointAlys[j].circle.set({
									top: this.createdCanvasPointAlys[j].pointAly.pos_pix_y,
									left: this.createdCanvasPointAlys[j].pointAly.pos_pix_x,
								});

							}
						});

					if (index == 1) {
						// newPoint = this.createRectangle(this.createdPointAlys[0], pos.left, pos.top, 'cyan', {lockMovement: false, width: 15, height: 15});
						console.log('setup inter');
						this.setupInterpolation();
					}
					// else {
					// 	newPoint = this.createRectangle(this.createdPointAlys[1], pos.left, pos.top, 'yellow', {lockMovement: false, width: 15, height: 15});
					// 	create the rest of points
					// }
					console.log(this.createdPointAlys);
					console.log(this.createdCanvasPointAlys);

				}
				// else {
				//     // alert("Over size of 2 interpolating points");
				//     // alert("You can only choose the first 10 points for interpolation!");
				//     // return;
				//
				// }
			}
		});

		this.setCanvasGroupSelection(() => {
			console.log('group selection created');
			let selectedObjs = this.canvas.getActiveGroup()._objects;
			// console.log(_this.canvas.getActiveGroup()._objects);
			if (this.mode == "remove") {
        // console.log();
				if (!confirm(`Are you sure to confirm delete these ${selectedObjs.length} points?`)) {
					return;
				}
				selectedObjs.forEach(canvasObj => {
					let pointAly = this.canvasPointAlyList.find(v => v.circle == canvasObj);
					this.removePoint(pointAly);
				});
			}
			setTimeout(() => {
				this.canvas.deactivateAll().renderAll();
			}, 0);
		})
	}

	setMode(mode: string = '') {
		this.mode = mode;
		switch (mode) {
			case 'edit':
				this.setLockPointMovement(false);
				break;
			case 'remove':
				this.setLockPointMovement(true);
				break;
			default:
				this.setLockPointMovement(true);
		}
	}


	abortCreateMultiple( ) {
		console.log('abort create multiple point');
		// let _pointAlyCanvas = this;
		// $.each(_pointAlyCanvas.multipleInputPoints, function (index, obj) {
		// 	_pointAlyCanvas.canvas.remove(obj.circle);
		// });
		// _pointAlyCanvas.canvas.renderAll();
		// _pointAlyCanvas.multipleInputPoints = [];
		if (this.canvas) {
			this.createdCanvasPointAlys.forEach(v => {
				this.canvas.remove(v.circle); // actually is rectangle
			});
			this.canvas.renderAll();
		}
		this.createdCanvasPointAlys = [];
		this.createdPointAlys = [];
		this.setMode();
		// window.ngGlobalService.instruction.setShow(false);
	}


	// must be overriden
	isAutoInterpolatable() {
		return true;
	}


	setupInterpolation() {
		if (this.createdPointAlys.length >=2 ){
			let x_interpol = new ManualInterpolator_Linear();
			let y_interpol = new ManualInterpolator_Linear();

			// we already have the position for first 2
			this.createdPointAlys[0].pos_pix_x = this.createdCanvasPointAlys[0].circle.left;
			this.createdPointAlys[1].pos_pix_x = this.createdCanvasPointAlys[1].circle.left;
			this.createdPointAlys[0].pos_pix_y = this.createdCanvasPointAlys[0].circle.top;
			this.createdPointAlys[1].pos_pix_y = this.createdCanvasPointAlys[1].circle.top;



			// let x_interpolator = new ManualInterpolator_Linear();
			// let y_interpolator = new ManualInterpolator_Linear();
			console.log(this.createdPointAlys);
			x_interpol.importData([this.createdPointAlys[0].pos_x, this.createdPointAlys[1].pos_x], [this.createdPointAlys[0].pos_pix_x, this.createdPointAlys[1].pos_pix_x]);
			y_interpol.importData([this.createdPointAlys[0].pos_y, this.createdPointAlys[1].pos_y], [this.createdPointAlys[0].pos_pix_y, this.createdPointAlys[1].pos_pix_y]);

			let interpolOutput_x = [this.createdPointAlys[0].pos_pix_x, this.createdPointAlys[1].pos_pix_x];
			let interpolInput_x = [this.createdPointAlys[0].pos_x, this.createdPointAlys[1].pos_x];
			let interpolOutput_y = [this.createdPointAlys[0].pos_pix_y, this.createdPointAlys[1].pos_pix_y];
			let interpolInput_y = [this.createdPointAlys[0].pos_y, this.createdPointAlys[1].pos_y];


			for (let i = 2; i < this.createdPointAlys.length; i++) {
				this.createdPointAlys[i].pos_pix_x = x_interpol.interpolate(this.createdPointAlys[i].pos_x);
				this.createdPointAlys[i].pos_pix_y = y_interpol.interpolate(this.createdPointAlys[i].pos_y);

				this.createRectangle(this.createdPointAlys[i],this.createdPointAlys[i].pos_pix_x, this.createdPointAlys[i].pos_pix_y, 'red', {width: 10, height: 10})
					// .on('moving', () => {
					//
					// })
			}



		}
		else {
			alert('Less than 2 analysis, unable to interpolate!');

		}
	}

}
