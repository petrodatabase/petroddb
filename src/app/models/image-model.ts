import {BaseModel, ModelPermission} from "./base-model";
import {Analysis} from "./analysis";
import {Diffusion} from "./diffusion";
import {Chart} from "./chart";
import {Plagioclase} from "./plagioclase";
import {User} from "./user";
import {LinkFile} from "./link-file";
export class ImageModel extends BaseModel {
	// maybe not in schema
	$key: string;
	vd_id: string;
	ed_id: string;
	sp_id: string;
	file: File;
	stored_file_name: string;

	// assume false
	isPrivate: boolean;

	// specified time created
	createdAt: string;

	img_name: string;
	img_cat: string;
  img_cat_other: string;
	img_north: string;
	img_south: string;
	img_east: string;
	img_url: string;
	img_des: string;
	img_time: string;
	img_instr: string;
  img_instr_other:string;
	img_scale: string;
	img_color: string;

	cm_stage_x: number;
	cm_stage_y: number;
	cm_fullsize_w: number;
	cm_fullsize_h: number;
	sm_micron_bar: number;
	sm_micron_marker: number;

	progress: number;

	img_pix_w: number;
	img_pix_h: number;

	// analysis
	// linkf_list: {type: 'array'}
	mapele_list: any[];
	point_alys: Analysis[];
  point_alys_id: string;
	diffusions: Diffusion[];
  point_diff_id: string;
	charts: Chart[];
	plagioclases: Plagioclase[];

	// attach metadata for image
	metadata : LinkFile[];

	public static schema = {
		// maybe not in schema
		$key: {type: 'string'},
		vd_id: {type: 'string', placeholder: 'Volcano',},
		ed_id: {type: 'string', placeholder: 'Eruption',},
		sp_id: {type: 'string', placeholder: 'Sample',},
		file: {type: 'object', placeholder: 'File',},
		stored_file_name: {type: 'string', placeholder: 'Stored Name',},
		createdAt: {type: 'string'},

		isPrivate: {type: 'boolean', placeholder: 'Private', input: 'checkbox', defaultVal: false,},


		img_name: {type: 'string', placeholder: 'Name',},
		img_cat: {type: 'string', placeholder: 'Category', input: 'select', choices: ['Collection Site', 'Hand Sample', 'Microphotography', 'Map', 'Thin Section Map', 'BSE', 'X-ray distribution map', 'Thin Section Scan', 'Other'],},
    img_cat_other: {type: 'string'},
    img_north: {type: 'string', placeholder: 'North',},
		img_south: {type: 'string', placeholder: 'South',},
		img_east: {type: 'string', placeholder: 'East',},
		img_url: {type: 'string', placeholder: 'URL',},
		img_des: {type: 'string', placeholder: 'Description',},
		img_time: {type: 'string', placeholder: 'Time',},
		img_instr: {type: 'string', input: 'select', placeholder: 'Instrument', choices: ['TEM','SIMS','IR','Optical Mircoscope', 'SEM', 'ICP', 'EPMA', 'XRD', 'Other'],},
    img_instr_other: {type: 'string'},
    img_scale: {type: 'string', placeholder: 'Scale',},
		img_color: {type: 'string', placeholder: 'Color',},

		cm_stage_x: {type: 'number', placeholder: 'Stage X (cm)',},
		cm_stage_y: {type: 'number', placeholder: 'Stage Y (cm)',},
		cm_fullsize_w: {type: 'number', placeholder: 'Full size width (pixel)',},
		cm_fullsize_h: {type: 'number', placeholder: 'Full size height (pixel)',},
		sm_micron_bar: {type: 'number', placeholder: 'Measurement Bar (micrometer)',},
		sm_micron_marker: {type: 'number', placeholder: 'Measurement Bar (pixel)',},

		img_pix_w: {type: 'number', placeholder: 'Width',},
		img_pix_h: {type: 'number', placeholder: 'Height',},

		progress: {type: 'number', placeholder: 'Progress',},

		// analysis
		// linkf_list: {type: 'array'}
		mapele_list: {type: 'array'},

		// root key of point aly and sample
		point_alys: {type: 'array'},
    point_alys_id: {type: 'string'},
		// root key of diffusion
		diffusions: {type: 'array'},
    point_diff_id: {type: 'string'},
		// root key of image
		charts: {type: 'array'},
		plagioclases: {type: 'array'},

    metadata:{type:'array', placeholder:'Metadata File'},

	};
	constructor(obj: any) {
		super(obj, ImageModel.schema);
	}


	public toFirebaseJsonObject(obj: any = null, schema: any = null): any {
		let returnedObj = super.toFirebaseJsonObject(obj || this, schema || ImageModel.schema);
		returnedObj.point_alys = [];
		returnedObj.diffusions = [];
		returnedObj.charts = [];
		returnedObj.mapele_list = [];
		returnedObj.plagioclases = [];
		return returnedObj;
	}

	public userBelong(user: User): boolean {
		// if (!!this.sp_uploader && user.$key == this.sp_uploader.$key) return true;
		// if (!!this.sp_pi && user.$key == this.sp_pi.$key) return true;
		// if (!!this.sp_editor && user.$key == this.sp_editor.$key) return true;
		// if (!!this.sp_collector && user.$key == this.sp_collector.$key) return true;
		// if (this.sp_autho.map(u =>u.$key).includes(user.$key)) return true;
		// else return false;

		/** FIXME in future: for now as long as it is not private, grant access*/
		return user.$key != "" && user.$key != null;
	}

	// FIXME: HACK
	public authenticatePermission(user: string | User): ModelPermission {
		if (typeof user === "string") {
    			user = new User({$key: user});
    		}
    		if (this.userBelong(user)) {
    			return ModelPermission.WRITE;
    		}
    		else {
    			return this.isPrivate ? ModelPermission.INVISIBLE : ModelPermission.READ;
    		}
    		// return this.isPrivate ? ModelPermission.INVISIBLE : ModelPermission.WRITE;
    	}
  // public authenticatePermission(user: string | User): ModelPermission {
  //   return  ModelPermission.WRITE;
  // }
}
