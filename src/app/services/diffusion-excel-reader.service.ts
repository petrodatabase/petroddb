import {EventEmitter, Injectable} from '@angular/core';
import {ExcelReaderService} from "./excel-reader.service";
import {ImageModel} from "../models/image-model";
import {environment} from "../../environments/environment";
import {Analysis} from "../models/analysis";
import {AlyElement} from "../models/aly-element";
import {Diffusion} from "../models/diffusion";
import {Traverse} from "../models/traverse";


@Injectable()
export class DiffusionExcelReaderService extends ExcelReaderService {

	abortCreate = new EventEmitter<any>();

	processedData: Analysis[];
	requiredParam =  ["cm_stage_x", "cm_stage_y", "sm_micron_bar", "sm_micron_marker"];
	rejectCol = ['ref_id', 'aly_comment', "color", 'pos_x', 'pos_y', 'pos_z', "reference id", "analysis comment", "marker color" ];

	interpolatingDirection = environment.interpolating_direction;

	// autoInterpolator = new  AutoInterpolatorFromStageCentral();
	// manualInterpolatorX = new ManualInterpolator_Linear();
	// manualInterpolatorY = new ManualInterpolator_Linear();
	imgObj: ImageModel;
	// diffusion: Diffusion;
	newDiffusion: Diffusion;

	constructor() {
		super();
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
			this.callbackOnData(this.newDiffusion);
		}
	}


	//handle the data once it read the file
	dataHandle() {
		this.preprocessData();

	}


	// this will transfer all this.data to analysis data
	preprocessData() {
		// let _this = this;
		this.processedData = [];
		this.newDiffusion.data_list = [];

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
			let aly = new Analysis(this.data.rows[i]);
			aly.data = data;

			aly.pos_x_unit = this.data.rows[0].pos_x;
			aly.pos_y_unit = this.data.rows[0].pos_y;
			aly.pos_z_unit = this.data.rows[0].pos_z;

			this.newDiffusion.data_list.push(aly);
		}
		// console.log(this.processedData);


		// this.newDiffusion.data_list = [];
		//
		// this.data.columns.forEach((k, i) => {
		// 	if (this.rejectCol.indexOf(k) == -1) {
		// 		// console.log(aly.data);
		// 		// data[k] = new AlyElement({
		// 		// 	ele_name: k,
		// 		// 	ele_unit: this.data.rows[0][k],
		// 		// 	ele_val: this.data.rows[i][k]
		// 		// });
		// 		let trav = new Traverse({
		// 			trav_id: i,
		// 			trav_elem: k,
		// 			trav_unit: this.data.rows[0][k],
		// 			trav_data_list: [],
		// 		});
		// 		this.data.rows.forEach((v, j) => {
		// 			if (j == 0) {
		// 				return;
		// 			}
		// 			// ad to it
		// 			trav.trav_data_list.push(new AlyElement({
		// 				ele_id: j,
		// 				ele_name: k,
		// 				ele_unit: trav.trav_unit,
		// 				ele_val: this.data.rows[j][k]
		// 			}));
		// 		});
		// 		this.newDiffusion.data_list.push(trav);
		// 	}
		// });
		console.log(this.newDiffusion);

		// this.data.rows = this.processedData;

		//
	}

}
