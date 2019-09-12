import {CanvasModel, ContainerScroll} from "./canvas-model";
import {ImageModel} from "../../models/image-model";
import {Diffusion} from "../../models/diffusion";

interface CanvasDif {
	dif: Diffusion,
	A: any;
	B: any;
	line: any;
}
export class DiffusionCanvas extends CanvasModel  {
	mode: string;
	diffusions: Diffusion[] = [];
	canvasDifs: CanvasDif[] = [];

	newDiffusion: Diffusion = null;
	newCanvasDif: CanvasDif;
	newA: any = null;
	newB: any = null;
	edittedDiffusions: Diffusion[] = [];
	edittedCanvasDifs: CanvasDif[] = [];

	containerScroll: ContainerScroll = {top: 0, left: 0};


	removedDiffusions: Diffusion[] = [];
	removedCanvasDifs: CanvasDif[] = [];

	constructor(canvasId: string, width: number, height: number, public getPosMouse = null) {
		super(canvasId, width, height, getPosMouse);
		this.mode = '';
	}


	getMouseTopLeftPos(options): any | { top; left } {

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

	importCanvas(objs: Diffusion[]): any {
		// return super.importCanvas(objs);
		super.importCanvas(objs);
		this.canvasDifs = [];
		this.diffusions = objs;
		this.diffusions.forEach(v => {
			this.createCanvasDif(v);
		});

		// testing
		// this.createRectangle(null, 10, 10, 'red', {});

		// change canvas size
		this.canvas.renderAll();
	}

	initNewCanvasDif(dif) {

	}

	createCanvasDif(dif: Diffusion, params: any = {}) {
		let canvasDif = {
			dif : dif,
			A: null,
			B: null,
			line: null,
		};
		// create line to follow A and B
		canvasDif.line = this.createLine(dif.imgA_ratio_w, dif.imgA_ratio_h, dif.imgB_ratio_w, dif.imgB_ratio_h,null, {selectable: false},
			(obj) => {
				// modified
			},
			(obj) => {
				// selected
			}
		);

		// create A
		canvasDif.A = this.createPoint(dif.imgA_ratio_w, dif.imgA_ratio_h, 'red', params,
			(obj) => {
				// modified
			},
			(obj) => {
				// selected
				this.onPointSelect(obj, canvasDif);

			},
			(obj) => {
				// moving
				dif.imgA_ratio_w = obj.left;
				dif.imgA_ratio_h = obj.top;
				canvasDif.line.set({
					x1: dif.imgA_ratio_w,
					y1: dif.imgA_ratio_h,
				});
				canvasDif.line.setCoords();

				if (this.edittedCanvasDifs.indexOf(canvasDif) < 0) {
					this.edittedCanvasDifs.push(canvasDif);
				}
			}
		);

		// create B
		canvasDif.B = this.createPoint(dif.imgB_ratio_w, dif.imgB_ratio_h, 'green', params,
			(obj) => {
				// modified
			},
			(obj) => {
				// selected
				this.onPointSelect(obj, canvasDif);
			},
			(obj) => {
				// moving
				dif.imgB_ratio_w = obj.left;
				dif.imgB_ratio_h = obj.top;
				canvasDif.line.set({
					x2: dif.imgB_ratio_w,
					y2: dif.imgB_ratio_h,
				});
				canvasDif.line.setCoords();

				if (this.edittedCanvasDifs.indexOf(canvasDif) < 0) {
					this.edittedCanvasDifs.push(canvasDif);
				}
			}
		);

		if (!params['create']) {
			// console.log()
			// this.diffusions.push(dif);
			this.canvasDifs.push(canvasDif);
		}
		this.canvas.renderAll();
		return canvasDif;
	}

	onPointSelect(obj: any, canvasDif: CanvasDif) {
		switch (this.mode) {
			case 'edit':
				break;
			case 'remove':
				if (confirm(`Are you sure to remove this diffusion`)) {
					this.removeCanvasDif(canvasDif);
				}
				break;
			default:
				break;
		}
	}

	removeCanvasDif(canvasDif: CanvasDif) {
		this.removedCanvasDifs.push(canvasDif);
		this.removedDiffusions.push(canvasDif.dif);

		this.canvas.remove(canvasDif.line);
		this.canvas.remove(canvasDif.A);
		this.canvas.remove(canvasDif.B);

		this.diffusions.splice(this.diffusions.indexOf(canvasDif.dif), 1);
		this.canvasDifs.splice(this.canvasDifs.indexOf(canvasDif), 1);

		this.canvas.renderAll();
	}

	revertRemoveCanvasDif() {
		this.removedCanvasDifs.forEach((canvasDif: CanvasDif) => {
			this.createCanvasDif(canvasDif.dif);
		});
		this.removedCanvasDifs = [];
		this.removedDiffusions = [];
	}

	setMode(mode) {
		this.mode = mode;
		switch (mode) {
			case 'edit':
			case 'create':
				this.setLockPointMovement(false);
				break;
			case 'remove':
				this.setLockPointMovement(true);
				break;
			default:
				this.setLockPointMovement(true);
		}
	}

	setLockPointMovement (isLock) {
		if (this.canvas) {
			this.canvasDifs.forEach(v => {
				v.A.set({
					lockMovementX: isLock, lockMovementY: isLock,
				});
				v.B.set({
					lockMovementX: isLock, lockMovementY: isLock,
				});

			});
			console.log(this.canvasDifs);
			this.canvas.renderAll();
		}
	}
	clearCache() {
		this.removedCanvasDifs = [];
		this.removedDiffusions = [];
		this.edittedCanvasDifs = [];
		this.edittedDiffusions = [];
	}

	createCanvas(): any {
		super.createCanvas();

		this.setCanvasMouseUp((options) => {
			let pos = this.getMouseTopLeftPos(options);
			console.log(pos);
			console.log(this.mode);

			if (this.mode == 'create' && this.newDiffusion && !this.newCanvasDif) {
				if (!this.newA) {
					this.newA = this.createPoint(pos.left, pos.top, 'red', {lockMovement: false},
						() => {
							// modified
						},
						() => {
							// select
						},
						() => {
							// moving
						}
					);
				}
				else {
					this.newDiffusion.imgA_ratio_w = this.newA.left;
					this.newDiffusion.imgA_ratio_h = this.newA.top;
					this.newDiffusion.imgB_ratio_w = pos.left;
					this.newDiffusion.imgB_ratio_h = pos.top;
					this.newCanvasDif = this.createCanvasDif(this.newDiffusion, {radius: 13, lockMovementX: false, lockMovementY: false, create: true});

					console.log(this.diffusions);
					this.canvas.remove(this.newA);
					this.newA = null;
				}
			}
		})
	}

	abortCreate() {
		if (this.canvas) {
			if (this.newA) {
				this.canvas.remove(this.newA);
			}
			if (this.newB) {
				this.canvas.remove(this.newB);
			}

			if (this.newCanvasDif) {
				this.canvas.remove(this.newCanvasDif.line);
				this.canvas.remove(this.newCanvasDif.A);
				this.canvas.remove(this.newCanvasDif.B);
				this.newCanvasDif = null;
			}
			if (this.newDiffusion) {
				this.newDiffusion = null;
			}
			this.canvas.renderAll();
		}
		this.mode = '';
		this.newCanvasDif = null;
		this.newDiffusion = null;
	}
}
