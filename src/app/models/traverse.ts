import {BaseModel} from "./base-model";
import {AlyElement} from "./aly-element";
export class Traverse extends BaseModel {
	$key: string;
	img_id: string; // should not include the img

	trav_elem: string;
	trav_unit: string;
	trav_points: number;

	// analysis
	// linkf_list: {type: 'array'}
	trav_data_list: AlyElement[];


	public static schema = {
		// maybe not in schema
		$key: {type: 'string'},
		img_id: {type: 'string'}, // should not include the img

		trav_elem: {type: 'string'},
		trav_unit: {type: 'string'},
		trav_points: {type: 'number'},

		// analysis
		// linkf_list: {type: 'array'}
		trav_data_list: {type: 'array'},

	};
	constructor(obj: any) {
		super(obj, Traverse.schema);
	}
}
