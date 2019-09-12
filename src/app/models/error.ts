import {BaseModel} from "./base-model";
export class Error extends BaseModel {
	public static schema = {
		// maybe not in schema
		title: {type: 'string'},
		message: {type: 'string'},
		error: {type: 'object'}, // object error server message, statusCode
	};
	constructor(obj: any) {
		super(obj, Error.schema);
	}
}
