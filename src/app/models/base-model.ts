import {User} from './user';

export enum ModelPermission {
	INVISIBLE = 1,
	READ = 2,
	WRITE = 3,
}

export class BaseModel {
	constructor(obj: any = {}, schema: any = {}) {
		this._initialize(schema);
		this._setData(obj, schema);
	}

	public _setData(obj: any, schema: any) {

		if (obj) {
			Object.keys(schema)
			// .filter(v => schema[v].type != 'object') // why filter them out
				.forEach(k => {
					if (typeof(obj[k]) !== 'undefined') {
						this[k] = this._resolveTypeSetData(obj[k], schema[k].type, k);
					}
				});
		}

	}

	public _initialize(schema: any) {
		Object.keys(schema).forEach(k => {
			this[k] = BaseModel._resolveType(schema[k].type);
		})
	}

	public static _resolveType(type: string) {
		switch (type) {
			case 'string':
				return '';
			case 'number':
				return 0;
			case 'array':
				return [];
			case 'boolean':
				return false;
			case 'object':
				return {};
		}
	}

	public toKey(): string {
		if (!!this["$key"]) return this['$key'];
		else return "";
	}

	// this will depends on schema
	// subclass must implement to fulfill the requirement for object!
	public _resolveTypeSetData(obj: any, type: string, key: string) {
		switch (type) {
			case 'string':
				return (obj != null && ('' + obj).toLowerCase() != 'null') ? '' + obj : '';
			case 'number':
				return Number(obj);
			case 'array':
				if (!Array.isArray(obj)) {
					return [obj];
				}
				return obj;
			case 'boolean':
				return !!obj;
			case 'object':
				return obj;
		}
	}

	// public static toObject(obj: any, objectType: string) {
	public static toObject(obj: any, objectType: any) {
		if (typeof obj === 'string' || obj instanceof String) {
			// return new ModelList[objectType]({$key: obj});
			return new objectType({$key: obj});
		}
		return new objectType(obj);
		// return new ModelList[objectType](obj);
	}

	public toFirebaseJsonObject(obj: any, schema: any): any {
		let returnObj = {};
		if (obj) {
			Object.keys(schema)
			// .filter(v => schema[v].type != 'object') // why filter them out
				.forEach(k => {
					if (typeof(obj[k]) !== 'undefined') {
						// this[k] = this._resolveTypeSetData(obj[k], schema[k].type, k);
						returnObj[k] = obj[k];
					}
					else {
						returnObj[k] = null;
					}
				});
			delete returnObj['$key'];
		}
		return returnObj;
	}

	public clone(): any {
		// let
		return null;
	}
  // FIXME: HACK
	public authenticatePermission(user: string): ModelPermission {
		return ModelPermission.INVISIBLE;
	}

  // public authenticatePermission(user: string | User): ModelPermission {
  //   return  ModelPermission.WRITE;
  // }

	static fixNumLength(value, length): string {
	  return ("0".repeat(length) + value).slice(-length);
  }

  static currentDate(): string {
    let d = new Date();
	  return `${BaseModel.fixNumLength(d.getDate(), 2)}/${BaseModel.fixNumLength(d.getMonth() + 1, 2)}/${d.getFullYear()}`;
  }
}
