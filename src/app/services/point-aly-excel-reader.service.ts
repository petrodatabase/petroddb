import {EventEmitter, Injectable, Output} from '@angular/core';
import {ExcelReaderService} from "./excel-reader.service";
import {ImageModel} from "../models/image-model";
import {AlyElement} from "../models/aly-element";
import {Analysis} from "../models/analysis";
import {environment} from "../../environments/environment";

interface TopLeftPos {
	X: number,
	Y: number
}

export class AutoInterpolatorFromStageCentral {
	divDifArr = [];
	size = 0;
	pixelPerMicro = 0;
	topLeftPos: TopLeftPos;
	direction = [0, 1];
	requiredParam = ["cm_stage_x", "cm_stage_y", "sm_micron_bar", "sm_micron_marker", "cm_fullsize_w", "cm_fullsize_h"];
	inputImg: ImageModel;
	constructor() {
	}

	importData(inputImg, direction) {
		this.inputImg = inputImg;
		this.direction = direction;

		this.requiredParam.forEach(k => {
			if (!inputImg[k] || isNaN(inputImg[k]) || inputImg[k] == 0) {
				alert(`value ${k} = ${inputImg[k]} not valid for auto-interpolation!`);
				return false;
			}
		});

		this.pixelPerMicro = this.inputImg['sm_micron_bar'] / this.inputImg['sm_micron_marker'];
		let w = this.inputImg['cm_fullsize_w'] / 2 / this.pixelPerMicro / 1000;
		let h = this.inputImg['cm_fullsize_h'] / 2 / this.pixelPerMicro / 1000;
		let x = this.inputImg['cm_stage_x'] * 1 + ((direction[0] == 1)?(-w):w);
		let y = this.inputImg['cm_stage_y'] * 1 + ((direction[1] == 1)?(-h):h);
		console.log(`Direction: ${direction}`);
		console.log(`import w=${w} h=${h} x=${x}, y=${y}`);
		this.topLeftPos = {
			X: x,
			Y: y,
		};
		return true;
	}

	interpolate(pos_x, pos_y) {
		return {
			width: ((this.direction[0] == 1)?1:-1) * (pos_x - this.topLeftPos.X) * 1000 * this.pixelPerMicro,
			height: ((this.direction[1] == 1)?1:-1) * (pos_y - this.topLeftPos.Y) * 1000 * this.pixelPerMicro,
		}
	}
}


// FIXME: this still follow [1, 1] interpolation direction!
export class ManualInterpolator_Linear {
	inputData = [];
	outputData = [];
	f0 = 0;
	f01 = 0;
	constructor() {

	}
	importData (input, output) {
		if (input.length != 2 || output.length != 2) {
			console.log("Input or output size not 2!");
			return;
		}
		this.inputData = input;
		this.outputData = output;
		this.f0 = this.outputData[0];
		if (this.inputData[1] - this.inputData[0] == 0) {
			console.log("ERROR 2 input interpolating array same value!");
			alert("ERROR 2 input interpolating array same value!");
			return;
		}
		this.f01 = (this.outputData[1] - this.outputData[0]) / (this.inputData[1] - this.inputData[0]);
	}

	interpolate(val) {
		return this.f0 + this.f01 * (val - this.inputData[0]);
	}
}

@Injectable()
export class PointAlyExcelReaderService extends ExcelReaderService {

	processedData: Analysis[];
	requiredParam =  ["cm_stage_x", "cm_stage_y", "sm_micron_bar", "sm_micron_marker"];
	rejectCol = ['ref_id', 'aly_comment', "color", 'pos_x', 'pos_y', 'pos_z', "reference id", "analysis comment", "marker color" ];

	interpolatingDirection = environment.interpolating_direction;

	autoInterpolator = new  AutoInterpolatorFromStageCentral();

	manualInterpolatorX = new ManualInterpolator_Linear();
	manualInterpolatorY = new ManualInterpolator_Linear();
	imgObj: ImageModel;

	abortCreateMultiple = new EventEmitter<any>();

	constructor() {
		super();
		this.processedData = [];
	}

	workbookHandle(wb) {
		super.workbookHandle(wb);
		//    convert all undefined value to -999
		// this.rejectCol = ['ref_id', 'aly_comment', 'color', 'pos_x', 'pos_y', 'pos_z'];
		let rejectCol_pos = ['pos_x', 'pos_y', 'pos_z'];


		this.data.columns.forEach(k => {
			// convert field name into variable name
			let newKey = k;
			switch (newKey) {
				case "reference id":
					newKey = "ref_id";
					break;
				case "analysis comment":
					newKey = "aly_comment";
					break;
				case "marker color":
					newKey = "color";
					break;

			}

			if (!(k in this.rejectCol) && this.data.rows[1].hasOwnProperty(k)) {
				//index 1 is unit declare
				if (this.data.rows[0][k] == null) {
					this.data.rows[0][k] = "";
				}
				if (newKey != k) {
					this.data.rows[0][newKey] = this.data.rows[0][k];
					delete this.data.rows[0][k];
				}

				// from index 2 is data
				for (let i = 1; i < this.data.rows.length; i++) {
					if (newKey != k) {
						this.data.rows[i][newKey] = this.data.rows[i][k];
						delete this.data.rows[i][k];
					}

					if (this.data.rows[i][newKey] == null) {
						if (rejectCol_pos.indexOf(newKey) > -1) {
							this.data.rows[i][newKey] = 0;
						}
						else if (this.rejectCol.indexOf(k) > -1) {
							this.data.rows[i][newKey] = "";
						}
						else {
							this.data.rows[i][newKey] = -999;
						}
					}
				}
			}
		});
		// console.log(this.data);
		//FIXME: generate interpolation - both auto and manual!
		this.dataHandle();
		console.log(this.data);
		// return this.data;
		if (this.callbackOnData) {
			this.callbackOnData(this.data);
		}
	}

	//handle the data once it read the file
	dataHandle() {
		this.preprocessData();


		// let canAuto = this.imgObj.pointAlyCanvas.canAuto;
		// if (this.verifyAutoInterpolatable()) {
		// 	if (this.data.rows.length >= 1) {
		// 		console.log('Start auto interpolate')
		// 		this.autoInterpolate();
		// 	}
		// 	else {
		// 		alert('not enough point to interpolate');
		// 		// this.imgObj.pointAlyCanvas.abortCreateMultiple();
		// 		this.abortCreateMultiple.emit({});
		// 		return;
		// 	}
		// }
		// else {
		// 	if (this.data.rows.length >= 3) {
		// 		console.log('Start manual interpolate')
		// 		this.manualInterpolate();
		// 	}
		// 	else {
		// 		alert('not enough point to interpolate');
		// 		// this.imgObj.pointAlyCanvas.abortCreateMultiple();
		// 		this.abortCreateMultiple.emit({});
		// 		return;
		// 	}
		// }

		// FIXME: close the panel and generate new points!
		// this.imgObj.pointAlyCanvas.processInterpolation(this.processedData);
	}

	verifyAutoInterpolatable() {
		if (!this.imgObj) {
			alert('ERROR: Point aly excel reader: img not undefined');
			return;
		}
		let valid = true;
		this.autoInterpolator.requiredParam.forEach(k => {
			if (!this.imgObj[k] || this.imgObj[k] == 0) {
				valid = false;
			}
		});
		return valid;
	}

	// this will transfer all this.data to analysis data
	preprocessData() {
		// let _this = this;
		this.processedData = [];
		for (let i = 1; i < this.data.rows.length; i++) {
			let data = {};
			this.data.columns.forEach(k => {
				if (this.rejectCol.indexOf(k) == -1) {
					// console.log(aly.data);
					data[k] = new AlyElement({
						ele_name: k,
						ele_unit: this.data.rows[0][k],
						ele_val: this.data.rows[i][k]
					});
				}
			});
			// this.data.rows[i].data = data;
			//FIXME: currently only the one uploaded is the analysist
			// this.data[i].aly_analyst = rootData.cur_us_id;

			console.log(data);
			var aly = new Analysis(this.data.rows[i]);
			aly.data = data;

			aly.pos_x_unit = this.data.rows[0].pos_x;
			aly.pos_y_unit = this.data.rows[0].pos_y;
			aly.pos_z_unit = this.data.rows[0].pos_z;

			this.processedData.push(aly);
		}
		console.log(this.processedData);

		this.data.rows = this.processedData;
	}

	autoInterpolate() {
		if (!this.autoInterpolator.importData(this.imgObj, this.interpolatingDirection)) {
			alert("ERROR: unable to import autointerpolator parameters");
			return;
		}
		// let afterInterpol = [];
		let interpolated = null;
		for (let i = 0; i < this.data.rows.length; i++) {
			interpolated = this.autoInterpolator.interpolate(this.data.rows[i]['pos_x'], this.data.rows[i]['pos_y']);
			this.data.rows[i].pos_pix_x = interpolated.width;
			this.data.rows[i].pos_pix_y = interpolated.height;
			// afterInterpol.push(this.processedData[i]);
		}
	}

	manualInterpolate() {
		// this will take the 2 points of imgPointAlyCanvas
		// let points = [this.imgObj.pointAlyCanvas.multipleInputPoints[0],
		// 	this.imgObj.pointAlyCanvas.multipleInputPoints[1]];

		let points =[];

		this.data.rows[0].pos_pix_x = points[0].circle.left;
		this.data.rows[1].pos_pix_x = points[1].circle.left;
		this.data.rows[0].pos_pix_y = points[0].circle.top;
		this.data.rows[1].pos_pix_y = points[1].circle.top;
		// let x_interpolator = new ManualInterpolator_Linear();
		// let y_interpolator = new ManualInterpolator_Linear();
		this.manualInterpolatorX.importData([this.data.rows[0].pos_x, this.data.rows[1].pos_x], [this.data.rows[0].pos_pix_x, this.data.rows[1].pos_pix_x]);
		this.manualInterpolatorY.importData([this.data.rows[0].pos_y, this.data.rows[1].pos_y], [this.data.rows[0].pos_pix_y, this.data.rows[1].pos_pix_y]);

		for (let i = 2; i < this.data.rows.length; i++) {
			this.data.rows[i].pos_pix_x = this.manualInterpolatorX.interpolate(this.data.rows[i].pos_x);
			this.data.rows[i].pos_pix_y = this.manualInterpolatorY.interpolate(this.data.rows[i].pos_y);
		}
	}

}
