import {CanvasModel} from "./canvas-model";
import {ImgRel} from "../../models/img-rel";
import {Workspace} from "../../models/workspace";

declare var $: any;

interface MakeLinkImportReceiver {
	fromImgRel: ImgRel,
	toImgRel: ImgRel,
	workspace: Workspace,
	targetImgRel: ImgRel,

}

export class MakeLinkCanvas extends CanvasModel {

	onSet = false; // already set the place, if false, allow drag, disable confirming
	position = [0, 0, 0, 0, 0, 0, 0, 0]; // store in pixel, W1, H1, W2 H2, W3, H3, W4, H4 (topleft, topright, bottom left, bottom right)
	fromImgRel: ImgRel; // must be imported from import
	toImgRel: ImgRel;
	workspace: Workspace;

	parentImage: any;
	childImage: any;
	targetImgrel: ImgRel;
	constructor(canvasId: string, width: number, height: number) {
		super(canvasId, width, height);
	}


	importCanvas(objs: MakeLinkImportReceiver): any {
		super.importCanvas(objs);
		this.fromImgRel = objs.fromImgRel;
		this.toImgRel = objs.toImgRel;
		this.workspace = objs.workspace;
		this.targetImgrel = objs.targetImgRel;

		// let the hold parent image as background
		// this.parentImage = this.createImgThumbnail(`img-placeholder-${this.fromImgRel.img_id}`, {
		this.parentImage = this.createImgThumbnail(`makelink-from-image`, {
			top: 0, left: 0,
			// lockMovementX: false, lockMovementY: false,
			selectable: false,
		}, (imgObj) => {

		}, (imgObj) => {

		}, (imgObj) => {

		});

		this.canvas.setWidth(this.parentImage.width);
		this.canvas.setHeight(this.parentImage.height);
		this.canvas.renderAll();
	}

	createCanvas(): any {
		super.createCanvas();
		// let _this = this;
		this.canvas.set({
			backgroundColor: 'rgba(0,0,0,0)',
		});
		// this.canvas.setWidth($scope.imgMakeLink.img1.img_pix_w);
		// this.canvas.setHeight($scope.imgMakeLink.img1.img_pix_h);
		console.log("make link canvas created");

		// this.canvas.on('mouse:down', function (options) {
		// 	console.log('mouse:down');
		// 	console.log(options);
		// });


		this.setCanvasMouseDown((options) => {
			// console.log("make link mousedown: " + options.e.clientX + " - " + options.e.clientY);
			// console.log("canvas offset: " + $scope.imgMakeLink.canvasManip.canvas._offset.left + " - " + $scope.imgMakeLink.canvasManip.canvas._offset.top);
			// console.log("window scroll: " + $("div.imgLink-img").scrollLeft() + " - " + $("div.imgLink-img").scrollTop());
			//
			// var left = options.e.clientX - $scope.imgMakeLink.canvasManip.canvas._offset.left + $("div.imgLink-img").scrollLeft();
			// var top = options.e.clientY - $scope.imgMakeLink.canvasManip.canvas._offset.top + $("div.imgLink-img").scrollTop();
			//
			// left /= $scope.imgMakeLink.currentZoomRatio;
			// top /= $scope.imgMakeLink.currentZoomRatio;
			// // if onset false: set the first topleft coord
			// if (!$scope.imgMakeLink.onSet) {
			// 	console.log("Making link: top-left create: " + top + " " + left);
			// 	$scope.imgMakeLink.position[0] = left;
			// 	$scope.imgMakeLink.position[1] = top;
			// }

			console.log("make link mousedown: " + options.e.clientX + " - " + options.e.clientY);
			console.log("canvas offset: " + this.canvas._offset.left + " - " + this.canvas._offset.top);
			// console.log("window scroll: " + $("div.imgLink-img").scrollLeft() + " - " + $("div.imgLink-img").scrollTop());

			// var left = options.e.clientX - this.canvas._offset.left + $("div.imgLink-img").scrollLeft();
			var left = options.e.clientX - this.canvas._offset.left ;
			// var top = options.e.clientY - this.canvas._offset.top + $("div.imgLink-img").scrollTop();
			var top = options.e.clientY - this.canvas._offset.top ;

			left /= this.currentZoomRatio;
			top /= this.currentZoomRatio;

			let pos = this.getMouseTopLeftPos(options);
			left = pos.left;
			top = pos.top;
			// if onset false: set the first topleft coord
			if (!this.onSet) {
				console.log("Making link: top-left create: " + top + " " + left);
				this.position[0] = left;
				this.position[1] = top;
			}
		});

		this.setCanvasMouseUp((options) => {
			console.log("make link mousedown: " + options.e.clientX + " - " + options.e.clientY);
			console.log("canvas offset: " + this.canvas._offset.left + " - " + this.canvas._offset.top);
			// console.log("window scroll: " + $("div.imgLink-img").scrollLeft() + " - " + $("div.imgLink-img").scrollTop());

			// MUST be deprecated
			// var left = options.e.clientX - this.canvas._offset.left + $("div.imgLink-img").scrollLeft();
			var left = options.e.clientX - this.canvas._offset.left ;
			// var top = options.e.clientY - this.canvas._offset.top + $("div.imgLink-img").scrollTop();
			var top = options.e.clientY - this.canvas._offset.top ;
			left /= this.currentZoomRatio;
			top /= this.currentZoomRatio;

			let pos = this.getMouseTopLeftPos(options);
			left = pos.left;
			top = pos.top;

			if (!this.onSet) {
				console.log("Making link: bottom-right: " + top + " " + left);

				if (this.position[0] == 0 && this.position[1] == 0) {
					console.log("ERROR: top-left yet to set, 0 - 0");
				}
				else {
					// the rest of the position
					this.position[6] = left;
					this.position[7] = top;

					this.position[2] = left;
					this.position[3] = this.position[1];
					this.position[4] = this.position[0];
					this.position[5] = top;

					var width = this.position[6] - this.position[0];
					var height = this.position[7] - this.position[1];
					if (width < 0 || height < 0) {
						console.log("CANNOT drag backward!");
						alert("You must drag from top-left to bottom-right!!");
						this.position = [0, 0, 0, 0, 0, 0, 0, 0];
						return;
					}

					// make the image
					// FIXME: since the return image thumbnail is not here, so cannot retrieve it and set scaleX, scaleY
					this.childImage = this.createImgThumbnail(`makelink-to-image`, {
						left: this.position[0],
						top: this.position[1],
						// lockRotation: true,
						// lockScalingFlip: true,
						// scaleX: width / fabricImg.getWidth(),
						// scaleX: 0,
						// scaleY: height / fabricImg.getHeight(),
						lockMovementX: false, lockMovementY: false,
						lockScalingX: false, lockScalingY: false,
						// selectable: true,
						// scaleY: 0,
					}, (imgObj) => {
						// modified
						this.onChildImageModified(imgObj)
					}, (imgObj) => {
						// moving
					}, (imgObj) => {
						// select
					});

					this.childImage.set({
						scaleX: width / this.childImage.width,
						scaleY: height / this.childImage.height,
					});
					// this.canvas.setBackgroundColor('rgba(0,0,0,0.5)');
					this.parentImage.set({opacity: 0.5});
					this.onSet = true;

					this.canvas.renderAll();

				}
			}
		})
	}

	onChildImageModified(imgObj: any) {

		this.position[0] = imgObj.left;
		this.position[1] = imgObj.top;
		// top-right
		this.position[2] = imgObj.left + imgObj.width;
		this.position[3] = imgObj.top;
		// bottom-left
		this.position[4] = imgObj.left;
		this.position[5] = imgObj.top + imgObj.height;
		// bottom-right
		this.position[6] = imgObj.left + imgObj.width;
		this.position[7] = imgObj.top + imgObj.height;


		console.log('Position change');
		console.log(this.position);
	}


	clearCanvas(): any {
		super.clearCanvas();
		this.position = [0, 0, 0, 0, 0, 0 ,0 ,0];
		// FIXME: notify user....
	}


	confirm(): ImgRel {
		if (!this.invalidatePosition()) {
			// this.targetImgrel = new ImgRel({
				// id: this.workspace.lines.length + 1,
				// label: this.workspace.lines.length + 1,
				// from: this.fromImgRel.id,
				// to: this.toImgRel.id,
				// type: 'line',
				// link_pos: this.position,
			// });
			this.targetImgrel.link_pos = this.position;
			return this.targetImgrel;
		}
		else {
			return null;
		}
	}

	invalidatePosition() {
		if (this.position[0] == 0 && this.position[1] == 0) {
			return 'top-left yet to set, 0 - 0';
		}
		if (this.position[0] == this.position[2]){
			return 'width must > 0'
		}
		if (this.position[1] == this.position[5]){
			return 'height must > 0'
		}

		return '';
	}

	reset() {
		this.position = [0, 0, 0, 0, 0, 0, 0, 0]; // store in pixel, W1, H1, W2 H2, W3, H3, W4, H4 (topleft, topright, bottom left, bottom right)
		// this.onShow = false;
		this.onSet = false; // already set the place, if false, allow drag, disable confirming
		// this.imgaly = {};
		if (this.childImage) {
			this.canvas.remove(this.childImage);
			this.childImage = null;
		}
		// this.clearCanvas();
	}
}
