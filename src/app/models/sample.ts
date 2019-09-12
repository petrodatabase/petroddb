import {BaseModel, ModelPermission} from "./base-model";
import {Eruption} from "./eruption";
import {Project} from "./project";
import {User} from "./user";
import {Workspace} from "./workspace";
import {Analysis} from "./analysis";
import {LinkFile} from "./link-file";
import {Chart} from "./chart";
import {ImageModel} from "./image-model";
import {Volcano} from "./volcano";
import {Publication} from "./publication";


export class Sample extends BaseModel {
	// _id: string;
	$key: string;
  fireBaseKey: string;
	vd: Volcano;
	ed: Eruption;
	proj: Project;

	// assume false
	isPrivate: boolean;

	sp_uploader: User;
	sp_editor: User;
	sp_collector: User;
	sp_pi: User;

	sp_name: string;
	sp_coldate: string;

	sp_lat: number;
	sp_lon: number;
	sp_alt: number;

	sp_amount: string;
	sp_collector_other: string;
	sp_sloc_room: string;
	sp_sloc: string;
	sp_sdata: string;
	sp_remark: string;
	sp_obs: string;
	ref_frame: string;
	sp_fsrc: string;
	datum: string;
	projection: string;

	sp_type: string[];
	sp_type_other: string;
	sp_rocktype: string[];
	sp_rocktype_other: string;
	sp_rockcomp: string[];
	sp_rockcomp_other: string;

	workspaces: Workspace[];
	alys: Analysis[];
	img: ImageModel[];
	subSp: Sample[];
	linkf_list: LinkFile[];
	charts: Chart[];
	sp_autho: User[];
	publications: Publication[];


	// fields only for searching features

	public static schema = {
		// _id: {type: 'string'},
		$key: {type: 'string'},
    fireBaseKey: {type: 'string'},
    // unique name
		sp_name: {type: 'string', placeholder: 'Sample Name'},

		ed: {type: 'object', placeholder: 'Eruption', input: 'select', target: 'eruption', option: {}, required: false},
		vd: {type: 'object', placeholder: 'Volcano', input: 'select', target: 'volcano', option: {}, required: true},
		proj: {type: 'object', placeholder: 'Project', input: 'select', target: 'project', required: true},
		isPrivate: {type: 'boolean', placeholder: 'Private', input: 'checkbox', defaultVal: false,},

		sp_uploader: {type: 'object', placeholder: 'Uploader', input: 'select', required: true, target: 'User', option: {}, choices: []},
		sp_pi: {type: 'object', placeholder: 'Principal Investigator', input: 'select', required: true, target: 'User', option: {}, choices: []},
		sp_editor: {type: 'object', placeholder: 'Editor', input: 'select', target: 'User', option: {}, choices: []},
		sp_collector: {type: 'object',  placeholder: 'Collector', input: 'select', target: 'User', option: {}, choices: []},

		sp_lat: {type: 'number', placeholder: 'Latitude(geographical)',},
		sp_lon: {type: 'number', placeholder: 'Longitude(geographical)',},
		sp_alt: {type: 'number', placeholder: 'Elevation',},


		sp_amount: {type: 'string', placeholder: 'Amount(with unit)'},
		sp_collector_other: {type: 'string',  placeholder: 'Other Collector',},
		sp_coldate: {type: 'string', name: 'Collection date', placeholder: 'Collection Date (DD/MM/YYYY)'},
		sp_sloc_room: {type: 'string', placeholder: 'Location'},
		sp_sloc: {type: 'string', placeholder: 'Description',},
		sp_sdata: {type: 'string', placeholder: 'Data'},
		sp_remark: {type: 'string', placeholder: 'Remark'},
		sp_obs: {type: 'string', placeholder: 'Observation'},
		ref_frame: {type: 'string', placeholder: 'Reference Frame'},
		sp_fsrc: {type: 'string', placeholder: 'Funding Source'},
		datum: {type: 'string', placeholder: 'Datum'},
		projection: {type: 'string', placeholder: 'Projection',},


		// string array
		sp_type: {type: 'array', placeholder: 'Sample Type', input: 'checkbox', checkboxes: ['Core plug', 'Grain mount', 'Hand specimen', 'Thin section', 'Pan concentrate', 'Powder', 'Rock chip', 'Slab', 'Soil', 'Stream sediment'],},
		sp_type_other: {type: 'string', placeholder: 'Other Sample-type', },
		sp_rocktype: {type: 'array', placeholder: 'Rock Name', input: 'checkbox', checkboxes:
        // ['Altered volcanic', 'Dome fragment', 'Lahar sample', 'Lava flow', 'Pyroclastic rock', 'Xenolith']
        [
            ['Andesite', 'Anorthosite', 'Basalt', 'Diorite', 'Dunite', 'Felsite', 'Gabbro', 'Granite Alkali-','Granite Plagio- (tonolite)',
            'Granodiorite', 'Monzonite', 'Obsidian', 'Peridotite', 'Pumice','Pyroxenite',
            'Rhyolite', 'Scoria', 'Syenite', 'Vocanic breccia', 'Volcanic tuff'],

            ['Amphibolite', 'Blueschist', 'Eclogite', 'Gneiss', 'Granulite', 'Greenschist', 'Greenstone', 'Hornfels',
              'Marble - limestone', 'Marble - dolomite', 'Migmatite', 'Phyllite', 'Quartzite', 'Schist',
              'Serpentinite', 'Slate', 'Soapstone'],

            ['Arkosic Sandstone', 'Breccia', 'Chalk Limestone', 'Chert', 'Coal - Bituminous', 'Coal - Anthracite', 'Conglomerate',
              'Coquina', 'Dolomite', 'Fossil limestone', 'Gypsum', 'Halite(Rock Salt)', 'Intraclastic limestone', 'Lithic Sandstone',
                'Micrite Limestone', 'Oolitic Limestone', 'Peat', 'Quartz Sandstone', 'Shale', 'Siltstone'
          ]
        ]


      ,},
    sp_rocktype_other: {type: 'string', placeholder: 'Other Rock-type', },
    sp_rockcomp: {type: 'array', placeholder: 'Type of Volcanic rocks/deposits', input: 'checkbox', checkboxes:
        // ['Basalt', 'Basalt-Andesite', 'Basanite', 'Andesite', 'Trachyte', 'Dacite', 'Rhyolite', 'Granite', 'Diorite', 'Gabbro', 'Peridotite'],
    [
      ['Pahoehoe Flows', "A'A' Flowso", 'Pillow Lavaso','Siliceous Lava Flows', 'Lava Domes'],

      ['Tephra', 'Ash', 'Lapilli', 'Bombs', 'Pumice', 'Blocks',
      'Scoria', 'Ignimbrite', 'Pyroclastic flow deposit', 'Pyroclastic fall deposit', 'Surge deposit'],

      ['Lahar']
    ]
    },
    sp_rockcomp_other: {type: 'string', placeholder: 'Other Rock-comp', },

		// model array
		workspaces: {type: 'array', name: 'workspaces', placeholder: 'workspaces'},
		publications: {type: 'array', name: 'References', placeholder: 'references'},
		alys: {type: 'array'},
		img: {type: 'array', name: 'images', placeholder: 'images'},
		subSp: {type: 'array'},
		linkf_list: {type: 'array', name: 'files', placeholder: 'files'},
		charts: {type: 'array'},
		sp_autho: {type: 'array'},

	};
	constructor(obj: any) {
		super(obj, Sample.schema);
	}


  public _initialize(schema: any): any {
    super._initialize(schema);
    this.sp_coldate = BaseModel.currentDate();
  }

  public _resolveTypeSetData(obj: any, type: string, key: string):  any {
		let returnObj = super._resolveTypeSetData(obj, type, key);
		// console.log(key);
		// console.log(returnObj);
		switch (key) {
			case 'proj':
				//FIXME be careful about this! may lead to circular object
				// return new Project(returnObj);
				return BaseModel.toObject(returnObj, Project);
			// FIXME: user not yet
			case 'sp_uploader':
			case 'sp_pi':
			case 'sp_editor':
			case 'sp_collector':
				// return new User(returnObj);
				return BaseModel.toObject(returnObj, User);
			case 'ed':
				// return new Eruption(returnObj);
				return BaseModel.toObject(returnObj, Eruption);
			case 'vd':
				let toObj =  BaseModel.toObject(returnObj, Volcano);
				// console.log(toObj);
				return toObj;

			// array case
			case 'workspaces':
				return returnObj.map(v => BaseModel.toObject(v, Workspace));
			case 'alys':
				return returnObj.map(v => BaseModel.toObject(v, Analysis));
			case 'img':
				return returnObj.map(v => BaseModel.toObject(v, ImageModel));
			case 'subSp':
				return returnObj;
			case 'linkf_list':
				return returnObj.map(v => BaseModel.toObject(v, LinkFile));
			case 'charts':
				return returnObj.map(v => BaseModel.toObject(v, Chart));
			case 'sp_autho':
				return returnObj.map(v => BaseModel.toObject(v, User));
			case 'publications':
				return returnObj.map(v => BaseModel.toObject(v, Publication));

			default:
				return returnObj;
		}
	}

	public toFirebaseJsonObject() {
		let returnObj = super.toFirebaseJsonObject(this, Sample.schema);
		returnObj.proj = returnObj.proj['$key'] || null;
		returnObj.ed = returnObj.ed['$key'] || null;
		returnObj.vd = returnObj.vd['$key'] || null;
		returnObj.sp_uploader = returnObj.sp_uploader['$key'] || null;
		returnObj.sp_editor = returnObj.sp_editor['$key'] || null;
		returnObj.sp_collector = returnObj.sp_collector['$key'] || null;
		returnObj.sp_pi = returnObj.sp_pi['$key'] || null;
		returnObj.sp_autho = returnObj.sp_autho.map(v => (typeof v === 'string') ? v : v.$key);

		/** The following elements belong to other collections, must null them to avoid attach them to sample*/
		returnObj.img = [];
		returnObj.linkf_list = [];
		returnObj.workspaces = [];
		returnObj.charts = [];
		returnObj.alys = [];
		returnObj.publications = [];
		// returnObj.subSp = [];

		// sp.sp_uploader = sp.sp_uploader.uid;
		return returnObj;
	}


	public userBelong(user: User): boolean {
		if (!!this.sp_uploader && user.$key == this.sp_uploader.$key) return true;
		if (!!this.sp_pi && user.$key == this.sp_pi.$key) return true;
		if (!!this.sp_editor && user.$key == this.sp_editor.$key) return true;
		if (!!this.sp_collector && user.$key == this.sp_collector.$key) return true;
		if (this.sp_autho.map(u =>u.$key).includes(user.$key)) return true;
		else return false;
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
	}
  // public authenticatePermission(user: string | User): ModelPermission {
  //   return  ModelPermission.WRITE;
  // }
}
