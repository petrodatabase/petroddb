import {BaseModel} from "./base-model";
import {User} from "./user";
import {ImageModel} from "./image-model";
import {ImgRel} from "./img-rel";
export class Workspace extends BaseModel {
	$key: string;

	sp_id: string;
	ws_name: string;
	ws_creator: User;
	ws_autho: User[];
	ws_des: string;

	images: ImgRel[];
	lines: ImgRel[];

	public static schema = {
		$key: {type: 'string'},
		sp_id: {type: 'string', placeholder: 'Sample ID',},

		ws_creator: {type: 'object', placeholder: 'Creator',},
		ws_autho: {type: 'array', placeholder: 'The Authorized',},
		ws_name: {type: 'string', placeholder: 'Name',},
		ws_des: {type: 'string', placeholder: 'Description',},


		// model array
		images: {type: 'array'},
		lines: {type: 'array'},
		linkf_list: {type: 'array'},

	};
	constructor(obj: any) {
		super(obj, Workspace.schema);
		this.images = this.images.map(v => new ImgRel(v));
		this.lines = this.lines.map(v => new ImgRel(v));
	}

	public clone(): any {
		console.log(this);
		let newWs = new Workspace(this);
		// FIXME: not sure of +100 is correct
		newWs.$key += 100;
 		newWs.lines = [];
		newWs.images = [];
		newWs.ws_autho = [];
		this.lines.forEach(v => newWs.lines.push(v.clone()));
		this.images.forEach(v => newWs.images.push(v.clone()));
		console.log(this);
		this.ws_autho.forEach(v => newWs.ws_autho.push(new User(v)));
		newWs.ws_creator = new User(this.ws_creator);

		return newWs;
	}


	public _resolveTypeSetData(obj: any, type: string, key: string): string | Number | any[] | any | boolean | any {
		let returnObj = super._resolveTypeSetData(obj, type, key);
		switch (key) {
			case 'ws_creator':
				// return new User(returnObj);
				return BaseModel.toObject(returnObj, User);
			case 'ws_autho':
				return returnObj.map(v => BaseModel.toObject(v, User));
		}
		return returnObj;
	}

	public toFirebaseJsonObject(obj: any = null, schema: any = null): any {
		let returnObj = super.toFirebaseJsonObject(obj == null ? this : obj, schema == null ? Workspace.schema : schema);
		returnObj.images = returnObj.images.map(v => v.toFirebaseJsonObject(v, ImgRel.schema));
		returnObj.lines = returnObj.lines.map(v => v.toFirebaseJsonObject(v, ImgRel.schema));
		returnObj.ws_creator = returnObj.ws_creator['$key'] || null;
		returnObj.ws_autho = returnObj.ws_autho.map(v => v['$key'] || v);

		return returnObj;
	}
}
