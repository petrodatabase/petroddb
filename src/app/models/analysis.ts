import {BaseModel} from "./base-model";
import {AlyElement} from "./aly-element";
export class Analysis extends BaseModel {
	$key: string;

	ref_id: any;
	ele_name: string;
	ele_unit: string;
	ref_name: string;
	pos_x_unit: string;
	pos_y_unit: string;
	pos_z_unit: string;
	color: string;
	aly_type: string;
	aly_instrument: string;
	aly_cond: string;
	aly_comment: string;

	pos_x: number;
	pos_y: number;
	pos_z: number;
	pos_pix_x: number;
	pos_pix_y: number;

	// elements // list of elements with keys
	data: any;

	public static schema = {
		// maybe not in schema
		$key: {type: 'string'},

		ref_id: {type: 'string', placeholder: 'Ref ID',},
		ele_name: {type: 'string', placeholder: 'Name',},
		ele_unit: {type: 'string', placeholder: 'Unit',},
		ref_name: {type: 'string', placeholder: 'Ref Name',},
		pos_x_unit: {type: 'string', placeholder: 'position x (unit)',},
		pos_y_unit: {type: 'string', placeholder: 'position y (unit)',},
		pos_z_unit: {type: 'string', placeholder: 'position z (unit)',},
		color: {type: 'string', placeholder: 'Color',},
		aly_type: {type: 'string', placeholder: 'Type', input: 'select', choices: ['Whole Rock', 'Glass', 'Mineral', 'inclusion melt-volatile', 'inclusion melt-element', 'inclusion mineral', 'Other'],},
		aly_instrument: {type: 'string', placeholder: 'Instrument', choices: ['Microscope', 'SEM', 'ICP', 'Microprobe', 'XRF', 'Other'],},
		aly_cond: {type: 'string', placeholder: 'Condition',},
		aly_comment: {type: 'string', placeholder: 'Comment',},

		pos_x: {type: 'number', placeholder: 'Position X',},
		pos_y: {type: 'number', placeholder: 'Position Y',},
		pos_z: {type: 'number', placeholder: 'Position z',},
		pos_pix_x: {type: 'number', placeholder: 'Position x (pixel)',},
		pos_pix_y: {type: 'number', placeholder: 'Position y (pixel)',},

		// elements
		data: {type: 'object'}

	};
	constructor(obj: any) {
		super(obj, Analysis.schema);
	}


	public _resolveTypeSetData(obj: any, type: string, key: string): string | Number | any[] | any | boolean | any {
		let returnedObj = super._resolveTypeSetData(obj, type, key);
		switch (key) {
			case 'data':
				// return Object.key(returnedObj).map(k => {returnedObj[k] = BaseModel.toObject(returnedObj[k], AlyElement));
				Object.keys(returnedObj).forEach(k => {
					returnedObj[k] = BaseModel.toObject(returnedObj[k], AlyElement);
				});
				return returnedObj;
			default:
				return returnedObj;
		}
	}

	public toFirebaseJsonObject(obj: any = null, schema: any = null): any {
		let returnObj = super.toFirebaseJsonObject(obj || this, schema || Analysis.schema);
		/**
		 * Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"
		 */
		Object.keys(returnObj.data).forEach(k => {
			// let newKey = k;
			let newKey = k.replace(/[.#$\/\[\]]/g, "_");
			if (newKey != k) {
				returnObj.data[newKey] = returnObj.data[k].toFirebaseJsonObject();
				returnObj.data[newKey].ele_name = newKey;
				delete returnObj.data[k];
			} else {
				returnObj.data[k] = returnObj.data[k].toFirebaseJsonObject();
			}
		});

		return returnObj;
	}
}
