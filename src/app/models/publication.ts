import {BaseModel} from "./base-model";
export class Publication extends BaseModel {
	// maybe not in schema
	$key: string;

	ref_id: string;
	cb_auth: string;
	cb_title: string;
	cb_journ: string;
	cb_vol: string; // number
	cb_pub: string; //
	cb_doi: string; // string
	cb_isbn: string;// string
	cb_url: string;
	cb_pdf: string;
	cb_labadr: string; //
	cb_keywords: string;
	cb_com: string;
	cb_loaddate: string; //
	// cc_id_load: string;

	cb_page: number;
	cb_year: number;

	/*
	 b_auth
	 null
	 cb_doi: "10.1029/1999GL005390"
	 cb_id:
	 "126"cb_isbn
	 :
	 null
	 cb_journ
	 :
	 "Geophysical Research Letters"
	 cb_keywords
	 :
	 null
	 cb_labadr
	 :
	 null
	 cb_loaddate
	 :
	 "2015-02-25 14:52:50"
	 cb_page
	 :
	 "3013-3016"
	 cb_pdf
	 :
	 ""
	 cb_pub
	 :
	 null
	 cb_title
	 :
	 "Very long-period signals associated with vulcanian explosions at Popocatepetl Volcano, Mexico"
	 cb_url
	 :
	 "http://pubs.er.usgs.gov/publication/70021394"
	 cb_vol
	 :
	 "26"
	 cb_year
	 :
	 "1999"
	 cc_id_load
	 :
	 "531"
	 */

	public static schema = {
		// maybe not in schema
		$key: {type: 'string'},

		ref_id: {type: 'string'},
		cb_auth: {type: 'string', placeholder: 'Author'},
		cb_title: {type: 'string', placeholder: 'Title'},
		cb_journ: {type: 'string', placeholder: 'Journal'},
		cb_vol: {type: 'string', placeholder: 'Volume'},
		cb_pub: {type: 'string', placeholder: 'Publication'},
		cb_doi: {type: 'string', placeholder: 'DOI'},
		cb_isbn: {type: 'string', placeholder: 'ISBN'},
		cb_url: {type: 'string', placeholder: 'URL'},
		cb_pdf: {type: 'string', placeholder: 'PDF Link'},
		cb_labadr: {type: 'string', placeholder: 'Lab Address'},
		cb_keywords: {type: 'string', placeholder: 'Key words("," comma separated)'},
		cb_com: {type: 'string', placeholder: 'Comment'},
		cb_loaddate: {type: 'string', placeholder: 'Load Date'},
		// cc_id_load: {type: 'string', placeholder: 'Observatory'},

		cb_page: {type: 'string', placeholder: 'Page'},
		cb_year: {type: 'number', placeholder: 'Year'},

	};
	constructor(obj: any) {
		super(obj, Publication.schema);
	}


  public _initialize(schema: any): any {
    super._initialize(schema);
    this.cb_loaddate = BaseModel.currentDate();
  }
}
