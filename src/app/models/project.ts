import {BaseModel, ModelPermission} from "./base-model";
import {User} from "./user";
import {Sample} from "./sample";
import {ImageModel} from "./image-model";
import {LinkFile} from "./link-file";
import {Publication} from "./publication";
export class Project extends BaseModel{
// maybe not in schema
// 	_id: string;
  $key: string;
  fireBaseKey: string;
  proj_pi: User;
  proj_pi_email: string;
  proj_creator: User;
  proj_creator_email:string;
  proj_autho: User[];
  proj_autho_read_only: User[];
  proj_contact: User;

  // assume false
  isPrivate: boolean;
  isReadonlyAccess: boolean;
  isPublicAccess: boolean;
  isCustomized: boolean;

  accessType: string;

  proj_name: string;
  proj_date: string;
  proj_des: string;

  // analysis
  // linkf_list: {type: 'array'}
  proj_sp_ids: Sample[];
  proj_data: any[];
  img: ImageModel[];
  linkf_list: LinkFile[];
  cb_list: Publication[];

  public static schema = {
    // maybe not in schema
    // _id: {type: 'string'},
    $key: {type: 'string'},
    fireBaseKey: {type: 'string'},

    proj_pi: {type: 'object', placeholder: 'Principal Investigator',  input: 'select', target: 'User', option: {}, choices: []},
    proj_creator: {type: 'object', placeholder: 'Creator', input: 'select', target: 'User', option: {}, choices: [ ]},
    proj_autho: {type: 'array', placeholder: 'Authors Full Access', input: 'select', target: 'User', option: {}, choices: []},
    proj_autho_read_only: {type: 'array', placeholder: 'Authors Read-only', input: 'select', target: 'User', option: {}, choices: []},
    proj_contact: {type: 'object', placeholder: 'Contact', input: 'select', target: 'User', option: {}, choices: [ ]},

    proj_pi_email: {type: 'string', placeholder: 'Principal Investigator Email',},
    proj_creator_email: {type: 'string', placeholder: 'Creator Email',},
    proj_name: {type: 'string', placeholder: 'Project Name',},
    proj_date: {type: 'string', placeholder: 'Date (DD/MM/YYYY)',},
    proj_des: {type: 'string', placeholder: 'Description',},



    accessType:{type:'string'},
    // analysis
    // linkf_list: {type: 'array'}
    proj_sp_ids: {type: 'array'},
    proj_data: {type: 'array'},
    img: {type: 'array'},
    linkf_list: {type: 'array'},
    cb_list: {type: 'array'},

  };
  constructor(obj: any) {
    super(obj, Project.schema);
  }


  public _resolveTypeSetData(obj: any, type: string, key: string):  any {
    let returnObj = super._resolveTypeSetData(obj, type, key);
    switch (key) {
      case 'proj_pi':
      //FIXME be careful about this! may lead to circular object
      // return new Project(returnObj);
      // return BaseModel.toObject(returnObj, Project);
      case 'proj_creator':
      case 'proj_contact':
        // return new User(returnObj);
        return BaseModel.toObject(returnObj, User);
      case 'proj_autho':
      case 'proj_autho_read_only':
        return returnObj.map(v => BaseModel.toObject(v, User));
      // array case
      // case 'proj_sp_ids':
      // 	return returnObj.map(v => BaseModel.toObject(v, Sample));

      default:
        return returnObj;
    }
  }

  public toFirebaseJsonObject(obj?: any, schema: any =  null): any {
    let data = super.toFirebaseJsonObject(this, Project.schema);
    data.proj_pi = data.proj_pi['$key'] || null;
    data.proj_creator = data.proj_creator['$key'] || null;
    data.proj_contact = data.proj_contact['$key'] || null;
    data.proj_autho = data.proj_autho.map(v => v['$key'] || null);
    data.proj_autho_read_only = data.proj_autho_read_only.map(v => v['$key'] || null);
    return data;
  }

  // public userBelong(user: User): boolean {
  //   if (!!this.proj_pi && user.$key == this.proj_pi.$key) return true;
  //   if (!!this.proj_creator && user.$key == this.proj_creator.$key) return true;
  //   if (!!this.proj_contact && user.$key == this.proj_contact.$key) return true;
  //   if (this.proj_autho.map(u =>u.$key).includes(user.$key)) return true;
  //   else return false;
  // }

  // public authenticatePermission(user: string | User): ModelPermission {
  //   if (typeof user === "string") {
  //     user = new User({$key: user});
  //   }
  //   if (this.userBelong(user)) {
  //     return ModelPermission.WRITE;
  //   }
  //   else {
  //     return this.isPrivate ? ModelPermission.INVISIBLE : ModelPermission.READ;
  //   }
  // }
  public userBelongFullAccess(user: User): boolean {
    if (!!this.proj_pi && user.$key == this.proj_pi.$key) return true;
    if (!!this.proj_creator && user.$key == this.proj_creator.$key) return true;
    if (!!this.proj_contact && user.$key == this.proj_contact.$key) return true;
    if (this.proj_autho.map(u =>u.$key).includes(user.$key)) return true;
    else return false;
  }
  public userBelongReadOnly(user: User): boolean {
    if (this.proj_autho_read_only.map(u =>u.$key).includes(user.$key))
    {return true;}
    else {return false;}
  }

  //  FIXME: HACK
  public authenticatePermission(user: string | User): ModelPermission {

    if (typeof user === "string") {
      user = new User({$key: user});
      // console.log(user);
    }

    if (this.userBelongFullAccess(user)) {
      return ModelPermission.WRITE;
    }

    else{
      if(this.userBelongReadOnly(user)){
        return ModelPermission.READ;
      }
      else {
        // new version , use access type
        switch (this.accessType) {
          case "isPrivate":
            return ModelPermission.INVISIBLE;
          case "isReadonlyAccess":
            return ModelPermission.READ;
          case "isPublicAccess":
            return ModelPermission.WRITE;
          case "isCustomized":
            return ModelPermission.INVISIBLE;
          // old version , not use accessType -> change all to private
          default:
            return ModelPermission.INVISIBLE;
        }
      }
    }
  }

  // public authenticatePermission(user: string | User): ModelPermission {
  //   return  ModelPermission.WRITE;
  // }


}
