import {BaseModel, ModelPermission} from "./base-model";
import {User} from "./user";
import {Sample} from "./sample";
import {ImageModel} from "./image-model";
import {LinkFile} from "./link-file";
import {Publication} from "./publication";
export class ProjectTest extends BaseModel{

  $key: string;

  proj_pi: User;
  proj_creator: User;
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




}
