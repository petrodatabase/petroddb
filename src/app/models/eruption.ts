import {BaseModel} from "./base-model";
export class Eruption extends BaseModel{
	$key: string;
	vd_id: string;

	ed_code: string;
	ed_num: string;
	ed_name: string;
	ed_name2: string;
	ed_nar: string;
	ed_stime: string;
	ed_stime_bc: string;
	ed_stime_unc: string;
	ed_etime: string;
	ed_etime_bc: string;
	ed_etime_unc: string;
	ed_climax: string;
	ed_climax_bc: string;
	ed_climax_unc: string;
	ed_com_1: string;
	ed_com_2: string;
	ed_loaddate: string;
	ed_pubdate: string;

	ed_vei: number;
	cc_id: string;
	// cc_id2: number;
	// cc_id3: number;
	cc_id_load: number;

	// analysis
	cb_ids: any[];

	public static schema = {
		// maybe not in schema
		$key: {type: 'string'},
		vd_id: {type: 'string', placeholder: 'Volcano', input: 'select', required: true},

		ed_code: {type: 'string', placeholder: 'Eruption Code',},
		ed_num: {type: 'string', placeholder: 'Eruption Number',},
		ed_name: {type: 'string', placeholder: 'Eruption Name',},
		ed_name2: {type: 'string',  placeholder: 'Other name',},
		ed_nar: {type: 'string', placeholder: 'Narrative',},
		ed_stime: {type: 'string', input: 'date', placeholder: 'Start Time (DD/MM/YYYY or negative integer for BC year)',},
		ed_stime_bc: {type: 'string', input: 'date', placeholder: 'Start Time (BC)',},
		ed_stime_unc: {type: 'string', placeholder: 'Start Time(uncertainty)',},
		ed_etime: {type: 'string', input: 'date', placeholder: 'End Time (DD/MM/YYYY) or negative integer for BC year',},
		ed_etime_bc: {type: 'string', input: 'date', placeholder: 'End Time (BC)',},
		ed_etime_unc: {type: 'string', placeholder: 'End Time(uncertainty)',},
		ed_climax: {type: 'string', input: 'date', placeholder: 'Climax Time (DD/MM/YYYY or negative integer for BC year)',},
		ed_climax_bc: {type: 'string', input: 'date', placeholder: 'Climax Time (BC)',},
		ed_climax_unc: {type: 'string', placeholder: 'Climax Time (uncertainty)',},
		ed_com_1: {type: 'string', placeholder: 'Comment',},
		ed_com_2: {type: 'string', placeholder: 'Comment 2',},
		ed_loaddate: {type: 'string', input: 'date', placeholder: 'Load Date (DD/MM/YYYY)',},
		ed_pubdate: {type: 'string', input: 'date', placeholder: 'Publish Date (DD/MM/YYYY)',},

		ed_vei: {type: 'number', placeholder: 'VEI',},
		cc_id: {type: 'string', placeholder: 'Contact ID',},
		// cc_id2: {type: 'number', placeholder: 'Owner 2 ID',},
		// cc_id3: {type: 'number', placeholder: 'Owner 3 ID',},
		cc_id_load: {type: 'string', placeholder: 'Load ID',},

		// analysis
		cb_ids: {type: 'array', placeholder: 'CC list',}

	};
	constructor(obj: any) {
		super(obj, Eruption.schema);
	}

	public toFirebaseJsonObject(obj: any = null, schema = Eruption.schema) {

		// sp.sp_uploader = sp.sp_uploader.uid;
		return super.toFirebaseJsonObject((obj == null) ? this: obj,  Eruption.schema);;
	}


  public _initialize(schema: any): any {
    super._initialize(schema);
    this.ed_loaddate = BaseModel.currentDate();
  }
}
