import {BaseModel} from "./base-model";
export class LinkFile extends BaseModel{
	$key: string;
	file_name: string; // should not include the img
	stored_file_name: string;
	file: File;

	file_url: string;

	linkItem_id: string;
	linkItem_type: string;
	file_comment: string;

	progress: number;
	// createdAt: Date = new Date();
  sp_id: string;
  img_id : string;
	public static schema = {
		// maybe not in schema
		$key: {type: 'string'},
		file_name: {type: 'string'}, // should not include the img
		db_file_name: {type: 'string'},

		file: {type: 'object'},
		file_url: {type: 'string'},
		linkItem_id: {type: 'string'},
		linkItem_type: {type: 'string'},
		file_comment: {type: 'string'},
		stored_file_name: {type: 'string'},

		createdAt: {type: 'date'},
		progress: {type: 'number'},

		// analysis
		// linkf_list: {type: 'array'}
    img_id:{ type: 'string'},
    sp_id:{ type: 'string'},
	};
	constructor(obj: any) {
		super(obj, LinkFile.schema);
		// FIXME: must be overrided some how

	}
}
