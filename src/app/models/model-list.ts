/**
 * Created by nxphi47 on 10/9/17.
 */
import {ImgRel} from "./img-rel";
import {AlyElement} from "./aly-element";
import {Analysis} from "./analysis";
import {Eruption} from "./eruption";
import {Diffusion} from "./diffusion";
import {Chart} from "./chart";
import {ImageModel} from "./image-model";
import {LinkFile} from "./link-file";
import {Observatory} from "./observatory";
import {Plagioclase} from "./plagioclase";
import {Project} from "./project";
import {Workspace} from "./workspace";
import {Volcano} from "./volcano";
import {User} from "./user";
import {Traverse} from "./traverse";
import {Publication} from "./publication";
import {Sample} from "./sample";


export const ModelList = {
	'aly-element': AlyElement,
	'analysis': Analysis,
	'chart': Chart,
	'diffusion': Diffusion,
	'eruption': Eruption,
	'image-model': ImageModel,
	'img-rel': ImgRel,
	'link-file': LinkFile,
	'observatory': Observatory,
	'plagioclase': Plagioclase,
	'project': Project,
	'publication': Publication,
	'sample': Sample,
	'traverse': Traverse,
	'user': User,
	'volcano': Volcano,
	'workspace': Workspace
};