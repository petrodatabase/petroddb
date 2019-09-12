/**
 * Created by nxphi47 on 26/8/17.
 */
import {BaseModel} from "./base-model";
export class Observatory extends BaseModel{
	$key: string;
	vd_id: string;

	cc_code: string;
	cc_code2: string;

	cc_fname: string;
	cc_lname: string;
	cc_obs: string;
	cc_add1: string;
	cc_add2: string;
	cc_city: string;
	cc_state: string;
	cc_country: string;
	cc_post: string;
	cc_url: string;
	cc_email: string;
	cc_phone: string;
	cc_phone2: string;
	cc_fax: string;
	cc_com: string;
	cc_loaddate: string;

	public static schema = {
		// maybe not in schema
		$key: {type: 'string'},
		vd_id: {type: 'string'},

		cc_code: {type: 'string'},
		cc_code2: {type: 'string'},

		cc_fname: {type: 'string'},
		cc_lname: {type: 'string'},
		cc_obs: {type: 'string'},
		cc_add1: {type: 'string'},
		cc_add2: {type: 'string'},
		cc_city: {type: 'string'},
		cc_state: {type: 'string'},
		cc_country: {type: 'string'},
		cc_post: {type: 'string'},
		cc_url: {type: 'string'},
		cc_email: {type: 'string'},
		cc_phone: {type: 'string'},
		cc_phone2: {type: 'string'},
		cc_fax: {type: 'string'},
		cc_com: {type: 'string'},
		cc_loaddate: {type: 'string'},


	};
	constructor(obj: any) {
		super(obj, Observatory.schema);
	}


	public toFirebaseJsonObject(obj?: any, schema?: any): any {
		return super.toFirebaseJsonObject(obj || this, schema || Observatory.schema);
	}
}
