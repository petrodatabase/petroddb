import {BaseModel} from "./base-model";
export class AlyElement extends BaseModel {

	$key: string;
	_id: string;
	ele_name: string;
	ele_unit: string;
	ele_val: number;
	ele_error: number;

	public static schema = {
		// maybe not in schema
		$key: {type: 'string'},
		_id: {type: 'string'},

		ele_name: {type: 'string'},
		ele_unit: {type: 'string'},
		ele_val: {type: 'number'},
		ele_error: {type: 'number'},

	};
	constructor(obj: any) {
		super(obj, AlyElement.schema);
	}


	public toFirebaseJsonObject(obj: any = null, schema: any= null): any {
		return super.toFirebaseJsonObject(obj || this, schema || AlyElement.schema);
	}
}
