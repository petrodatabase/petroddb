import {BaseModel} from "./base-model";
export class Report  extends BaseModel {
	$key: string;
	title: string;
	us_id: string;
	description: string;
	createdAt: Date = new Date();


	public static schema = {
		// maybe not in schema
		$key: {type: 'string'},
		title: {type: 'string', placeholder: 'Title',},
		description: {type: 'string', placeholder: 'Description',},
		us_id: {type: 'string'},
	};
	constructor(obj: any) {
		super(obj, Report.schema);
	}

	public toFirebaseJsonObject(obj: any = null, schema: any = null): any {
		return super.toFirebaseJsonObject(obj || this, schema || Report.schema);
	}
}
