import {BaseModel} from "./base-model";
import {Observatory} from "./observatory";
import {Project} from "./project";
import {Sample} from "./sample";
export class Volcano extends BaseModel {
	// maybe not in schema
	// _id: string;
	$key: string;
	vd_cavw: string;

	// cc_id: Observatory[];
	cc_id: string[];
	// cc_id
	// cc_id2
	// cc_id3
	// cc_id4
	// cc_id2

	vd_num: string;
	vd_name: string;
	vd_name2: string;
	vd_tzone: string;
	vd_mcont: string;
	vd_com: string;
	vd_loaddate: string;
	vd_pubdate: string;
	cc_id_load: string;

	// vd_inf_cavw: string;
	vd_inf_status: string[];
	vd_inf_status_other: string;
	vd_inf_rtype: string[];
	vd_inf_rtype_other: string;
  vd_inf_type: string[];
  vd_inf_type_other: string;

	vd_inf_desc: string;
	vd_inf_proj: string;
	vd_inf_datum: string;
	vd_inf_country: string;
	vd_inf_subreg: string;
	vd_inf_loc: string;
	vd_inf_evol: string;
	vd_inf_numcald: string;
	vd_inf_stime: string;
	vd_inf_stime_unc: string;
	vd_inf_etime: string;
	vd_inf_etime_unc: string;

	// vd_inf_com: string;

	// vd_inf_loaddate: string;
	// vd_inf_pubdate: string;

	vd_inf_lcald_dia: number;
	vd_inf_ycald_lat: number;
	vd_inf_ycald_lon: number;


	vd_inf_slat: number;
  vd_inf_slon: number;

  vd_has_sps: boolean;

	vd_inf_selev: number;
  // fields only for searching features
  vd_projs: Project[] = null;
  vd_samples: Sample[] = null;
  vd_selected_proj: number = -1;

	public static schema = {
		// maybe not in schema
		// _id: {type: 'string'},
		$key: {type: 'string'},

    /** vd_cavw no longer in user*/
		vd_cavw: {type: 'string', placeholder: 'CAVW',},

		cc_id: {type: 'array'},
		// cc_id
		// cc_id2
		// cc_id3
		// cc_id4
		// cc_id2

		vd_num: {type: 'string', placeholder: 'Smithsonian Catalog of Active Volcanoes of the World (CAVW)',},
		vd_name: {type: 'string', placeholder: 'Name',},
		vd_name2: {type: 'string', placeholder: 'Name 2',},
		vd_tzone: {type: 'string', placeholder: 'Time Zone',},
		vd_inf_slat: {type: 'number', placeholder: 'Summit Geographical Latitude (decimal degree)',},
		vd_inf_slon: {type: 'number', placeholder: 'Summit Geographical Longitude (decimal degree)',},
		vd_inf_selev: {type: 'number', placeholder: 'Summit Elevation',},

		vd_inf_lcald_dia: {type: 'number', placeholder: 'Crater\'s Diameter',},
		vd_inf_ycald_lat: {type: 'number', placeholder: 'Crater\'s Latitude',},
		vd_inf_ycald_lon: {type: 'number', placeholder: 'Crater\'s Longitude',},

		vd_mcont: {type: 'string', placeholder: 'Multiple Contacts',},
		vd_com: {type: 'string', placeholder: 'Comment',},
		vd_loaddate: {type: 'string', placeholder: 'Load Date',},
		vd_pubdate: {type: 'string', placeholder: 'Publication Date',},
		cc_id_load: {type: 'string', placeholder: 'Loader ID',},

		// vd_inf_cavw: {type: 'string'},

		vd_inf_status: {type: 'array', placeholder: 'Status', input: 'checkbox', checkboxes: ['Anthropology', 'Ar/Ar', 'Dendrochronology', 'Fumarolic', 'Historical', 'Holocene', 'Hot Springs', 'Hydration Rind', 'Hydrophonic', 'Ice Core', 'Lichenometry', 'Magnetism', 'Pleistocene', 'Potassium-Argon', 'Radiocarbon', 'Seismicity', 'Surface Exposure', 'Tephrochronology', 'Thermoluminescence', 'Uncertain', 'Uranium-series', 'Varve Count', 'Unknown'],},
		vd_inf_status_other: {type: 'string', placeholder: 'Other'},
		vd_inf_type: {type: 'array', placeholder: 'Volcano Type', input: 'checkbox', checkboxes: ['Caldera', 'Cinder cone', 'Complex volcano', 'Compound volcano', 'Cone', 'Crater rows', 'Explosion craters', 'Fissure vent', 'Hydrothermal field', 'Lava cone', 'Lava dome', 'Maar', 'Pumice cone', 'Pyroclastic cone', 'Pyroclastic shield', 'Scoria cone', 'Shield volcano', 'Somma volcano', 'Stratovolcano', 'Subglacial volcano', 'Submarine volcano', 'Tuff cone', 'Tuff ring', 'Unknown', 'Volcanic complex', 'Volcanic field'],},
    vd_inf_type_other: {type: 'string', placeholder: 'Other'},
    vd_inf_rtype: {type: 'array', placeholder: 'Rock Type', input: 'checkbox', checkboxes: ['Andesite/Basaltic Andesite', 'Basalt', 'Basalt/Picro-Basalt', 'Dacite', 'Foidite', 'Phonolite', 'Phonotephrite', 'Phono-tephrite/Tephri-phonolite', 'Trachyte/Trachyandesite', 'Trachybasalt/Tephrite Basanite', 'Trachyandesite/Basaltic trachy-andesite', 'Trachyandesite', 'Trachyte', 'Rhyolite', 'Unknown'],},
    vd_inf_rtype_other: {type: 'string', placeholder: 'Other'},

		vd_inf_desc: {type: 'string', placeholder: 'Description',},
		vd_inf_proj: {type: 'string', placeholder: 'Map Projection',},
		vd_inf_datum: {type: 'string', placeholder: 'Datum',},
		vd_inf_country: {type: 'string', placeholder: 'Country',},
		vd_inf_subreg: {type: 'string', placeholder: 'Sub region',},
		vd_inf_loc: {type: 'string', placeholder: 'Location',},
		vd_inf_evol: {type: 'number', placeholder: 'Volume of Edifice',},
		vd_inf_numcald: {type: 'number', placeholder: 'Number of Calderas',},
		vd_inf_stime: {type: 'string', placeholder: 'Start Time (DD/MM/YYYY)',},
		vd_inf_stime_unc: {type: 'string', placeholder: 'Start Time(uncertainty)',},
		vd_inf_etime: {type: 'string', placeholder: 'End Time (DD/MM/YYYY)',},
		vd_inf_etime_unc: {type: 'string', placeholder: 'End Time(uncertainty)',},

    vd_has_sps: {type: 'boolean', placeholder: 'Has samples',},


		// vd_inf_com: {type: 'string'},
		// vd_inf_loaddate: {type: 'string'},
		// vd_inf_pubdate: {type: 'string'},

	};
	constructor(obj: any) {
		super(obj, Volcano.schema);
	}

	public toFirebaseJsonObject(obj: any = null, schema = Volcano.schema) {

		// sp.sp_uploader = sp.sp_uploader.uid;
		return super.toFirebaseJsonObject((obj == null) ? this: obj,  Volcano.schema);;
	}
}
