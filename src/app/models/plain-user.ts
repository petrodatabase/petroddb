import {BaseModel} from "./base-model";

export class PlainUser extends BaseModel {
	email: string;
	password: string; // hidden

	// us_photo: ImageModel;


	public static schema = {
		// maybe not in schema

		// us_first: {type: 'string', placeholder: 'First Name',},
		// us_family: {type: 'string', placeholder: 'Last Name',},
		// displayName: {type: 'string', placeholder: 'User Name',},
		email: {type: 'string', placeholder: 'Email',},
		password: {type: 'string'}, // hidden
		// us_photo: {type: 'object'},
		//
		// us_note: {type: 'string',  placeholder: 'Note',},
		// us_biblio: {type: 'string', placeholder: 'Bibliography',},
		//
		// us_is_pi: {type: 'boolean', placeholder: 'Principal Investigator',},
		// us_is_co: {type: 'boolean', placeholder: 'Collector',},
		// us_is_up: {type: 'boolean', placeholder: 'Uploader',},
		// us_is_ad: {type: 'boolean', placeholder: 'Admin',},
		// us_con: {type: 'boolean', placeholder: 'Confirmed',},

	};
  constructor(obj: any) {
		super(obj, PlainUser.schema);
	}
}
