import {BaseModel} from "./base-model";
import {Analysis} from "./analysis";
export class Plagioclase extends BaseModel{
	// maybe not in schema
	$key: string;
	plag_name: string; // should not include the img
	img_id: string;
	plag_comment: string;

	// analysis
	data: Analysis[];

	public static schema = {
		// maybe not in schema
		$key: {type: 'string'},
		plag_name: {type: 'string'}, // should not include the img
		img_id: {type: 'string'},
		plag_comment: {type: 'string'},

		// analysis
		data: {type: 'array'}
	};
	constructor(obj: any) {
		super(obj, Plagioclase.schema);
	}
}
