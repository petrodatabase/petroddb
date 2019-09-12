import {BaseModel} from "./base-model";
import {Analysis} from "./analysis";
import {Traverse} from "./traverse";
export class Diffusion extends BaseModel {
	$key: string;
	dif_name: string;
	img_id: string;
	dif_instrument: string;
	dif_time: string;
	dif_comment: string;

	imgA_ratio_w: number;
	imgA_ratio_h: number;
	imgB_ratio_w: number;
	imgB_ratio_h: number;

	// analysis
	data_list: Analysis[];


	public static schema = {
		// maybe not in schema
		$key: {type: 'string'},
		dif_name: {type: 'string', placeholder: 'Name',},
		img_id: {type: 'string', placeholder: 'Image ID',},
		dif_instrument: {type: 'string', placeholder: 'Instrument', input: 'select', choices: ['Microscope', 'SEM', 'ICP', 'Microprobe', 'XRF', 'Other'],},
		dif_time: {type: 'string', placeholder: 'Time',},
		dif_comment: {type: 'string', placeholder: 'Comment',},

		imgA_ratio_w: {type: 'number', placeholder: 'A(x)',},
		imgA_ratio_h: {type: 'number', placeholder: 'A(y)',},
		imgB_ratio_w: {type: 'number', placeholder: 'B(x)',},
		imgB_ratio_h: {type: 'number', placeholder: 'B(y)',},

		// analysis
		data_list: {type: 'array'}

	};
	constructor(obj: any) {
		super(obj, Diffusion.schema);
	}


	public _resolveTypeSetData(obj: any, type: string, key: string): string | Number | any[] | any | boolean | any {
		let out = super._resolveTypeSetData(obj, type, key);
		switch (key) {
			case 'data_list':
				return out.map(v => BaseModel.toObject(v, Analysis));
			default:
				return out;
		}
	}

	public toFirebaseJsonObject(obj: any = null, schema: any = null): any {
		let output = super.toFirebaseJsonObject(obj || this, schema || Diffusion.schema);
		output.data_list = output.data_list.map(v => v.toFirebaseJsonObject());
		return output
	}
}
