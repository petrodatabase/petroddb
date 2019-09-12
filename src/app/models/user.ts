import {BaseModel} from "./base-model";
import {ImageModel} from "./image-model";
export class User extends BaseModel {
	// _id: string;
	$key: string;

	us_first: string;
	us_family: string;
	displayName: string;
	email: string;
	// password: string; // hidden

	// us_photo: ImageModel;

	us_note: string;
	us_biblio: string;

	us_is_pi: boolean;
	us_is_co: boolean;
	us_is_up: boolean;
	us_is_ad: boolean;
  us_is_re: boolean;
  us_con: boolean;

	public static schema = {
		// maybe not in schema
		$key: {type: 'string'},

		us_first: {type: 'string', placeholder: 'First Name',},
		us_family: {type: 'string', placeholder: 'Last Name',},
		displayName: {type: 'string', placeholder: 'User Name',},
		email: {type: 'string', placeholder: 'Email',},
		// password: {type: 'string'}, // hidden
		us_photo: {type: 'object'},

		us_note: {type: 'string',  placeholder: 'Note',},
		us_biblio: {type: 'string', placeholder: 'Bibliography',},

		us_is_pi: {type: 'boolean', placeholder: 'Principal Investigator',},
		us_is_co: {type: 'boolean', placeholder: 'Collector',},
		us_is_up: {type: 'boolean', placeholder: 'Uploader',},
		us_is_ad: {type: 'boolean', placeholder: 'Admin',},
    us_is_re: {type: 'boolean', placeholder: 'Researcher',},
    us_con: {type: 'boolean', placeholder: 'Confirmed',},

	};
	constructor(obj: any) {
		super(obj, User.schema);
	}

	public toFirebaseJsonObject(obj: any = null, schema = User.schema) {

		// sp.sp_uploader = sp.sp_uploader.uid;
		return super.toFirebaseJsonObject((obj == null) ? this: obj,  User.schema);;
	}
}
