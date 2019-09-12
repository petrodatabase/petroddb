import {BaseModel} from "./base-model";
export class Reference extends BaseModel {
	/*
	 'cb_auth', 'cb_year', 'cb_title', 'cb_journ', 'cb_vol', 'cb_pub', 'cb_page', 'cb_doi', 'cb_isbn',
	 'cb_url', 'cb_pdf', 'cb_labadr', 'cb_keywords', 'cb_com', 'cb_loaddate', 'cc_id_load'
	 */

	$key: string;
	author: string;
	title: string;
	journal: string;
	volume: string;
	publication

	public static schema = {
		// maybe not in schema
		// _id: {type: 'string'},
		$key: {type: 'string'},

		proj_pi: {type: 'object', placeholder: 'Principal Investigator',  input: 'select', target: 'User', option: {}, choices: []},
		proj_creator: {type: 'object', placeholder: 'Creator', input: 'select', target: 'User', option: {}, choices: [ ]},
		proj_autho: {type: 'array', placeholder: 'Authorities', input: 'select', target: 'User', option: {}, choices: []},

		proj_contact: {type: 'object', placeholder: 'Contact', input: 'select', target: 'User', option: {}, choices: [ ]},


    isPrivate: {type: 'boolean', placeholder: 'Private', input: 'checkbox', defaultVal: false, ngModel : 'isPrivate',},
    isReadonlyAccess: {type: 'boolean', placeholder: 'Read-only Access', input: 'checkbox', defaultVal: true,ngModel : 'isReadonlyAccess',},
    isPublicAccess: {type: 'boolean', placeholder: 'Public Access', input: 'checkbox', defaultVal: false,ngModel : 'isPublicAccess',},
    isCustomized: {type: 'boolean', placeholder: 'Customized', input: 'checkbox', defaultVal: false,ngModel : 'isCustomized',},

		proj_name: {type: 'string', placeholder: 'Project Name',},
		proj_date: {type: 'string', placeholder: 'Date (DD/MM/YYYY)',},
		proj_des: {type: 'string', placeholder: 'Description',},


		// analysis
		// linkf_list: {type: 'array'}
		proj_sp_ids: {type: 'array'},
		proj_data: {type: 'array'},
		img: {type: 'array'},
		linkf_list: {type: 'array'},
		cb_list: {type: 'array'},

	};
	constructor(obj: any) {
		super(obj, Reference.schema);
	}
}
