import {BaseModel} from "./base-model";
export class ImgRel extends BaseModel  {

	$key: string; // copy of _id to be use in visjs
	id: string; // copy of _id to be use in visjs

	img_id: string; // should not include the img

	label: string; // img_name or link name
	shape: string;
	image: string; // url to images

	from: string; // id of first item
	to: string; // id of first item

	arrows: string;
	type: string; // either img or line

	link_pos: number[];

	// FIXME fix this schema according to visjs
	public static schema = {
		// maybe not in schema
		// _id: {type: 'string'},

		$key: {type: 'string'}, // copy of _id to be use in visjs
		id: {type: 'string'}, // copy of _id to be use in visjs

		img_id: {type: 'string'}, // should not include the img

		label: {type: 'string'}, // img_name or link name
		shape: {type: 'string'},
		image: {type: 'string'}, // url to images

		from: {type: 'string'}, // id of first item
		to: {type: 'string'}, // id of first item

		type: {type: 'string'}, // either img or line

		// imgrel_type: {type: 'string'},
		// imgrel_id1: {type: 'string'},
		// imgrel_id2: {type: 'string'},
		//
		// img_url: {type: 'string'},
		// img_id2: {type: 'string'},
		//
		// img_top: {type: 'number'},
		// img_left: {type: 'number'},
		// img_scale: {type: 'number'},

		// analysis
		// linkf_list: {type: 'array'}
		link_pos: {type: 'array'},

	};
	constructor(obj: any) {
		super(obj, ImgRel.schema);
		this.arrows = 'to';
	}


	public clone(): any {
		let newImgRel = new ImgRel(this);
		newImgRel.link_pos = [];
		this.link_pos.forEach(v => newImgRel.link_pos.push(v));
		// if (this.link_pos == newImgRel.link_pos) {
		// 	throw 'wrong!!!';
		// }
		// else {
		// 	newImgRel.link_pos[1]++;
		// 	console.log(newImgRel);
		// 	console.log(this);
		// }
		return newImgRel;
	}
}
