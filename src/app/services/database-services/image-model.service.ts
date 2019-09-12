import {Injectable} from '@angular/core';
import {BaseService} from "../base.service";
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2/database";
import {AngularFireAuth} from "angularfire2/auth";
import {ImageModel} from "../../models/image-model";
import {DateTimeFormatService} from "../date-time-format.service";
import {AlertService} from "../../components/alert-dialog/alert.service";
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {filterObjectsMultipleQuery, isFirebase, normalizeGetObject, normalizeGetObjectList} from '../../../utils/dataConvertHelper';
import {Project} from '../../models/project';
import {AuthService} from '../../auth/auth.service';

@Injectable()
export class ImageModelService extends BaseService {
	public basePath: string = '/images';

	constructor(private afDB: AngularFireDatabase,
				private afAuth: AngularFireAuth,
				private datetimeService: DateTimeFormatService,
				private alertService: AlertService,
        private http: HttpClient,
        private authService: AuthService

  ) {
		super();
		this.images = this.afDB.list(this.basePath);
		this.image = this.afDB.object(this.basePath);
	}

	images: FirebaseListObservable<ImageModel[]> = null;
	image: FirebaseObjectObservable<ImageModel> = null;

  // NOTE: This code below is for Firebase Version

  getImagesList(query: any = {}): FirebaseListObservable<ImageModel[]> {
		this.images = this.afDB.list(this.basePath, {
			query: query
		});
		return this.images;
	}

	getImage(key: string): FirebaseObjectObservable<ImageModel> {
		const itemPath = `${this.basePath}/${key}`;
		this.image = this.afDB.object(itemPath);
		return this.image;
	}

	createImage(img: ImageModel, callback: any = null): firebase.database.ThenableReference {
		return this.images.push(img.toFirebaseJsonObject(img, ImageModel.schema))
			.then((ref) => {
				if (callback) {
					callback(ref);
				}
			})
			.catch(error => this.handleError(error));
	}

	updateImage(key: string, value: any, callback: any = null): firebase.Promise<any> {
		return this.images.update(key, value)
			.then((ref) => {
				callback ? callback(ref) : null;
			})
			.catch(error => this.handleError(error));
	}


	deleteImage(key: string): firebase.Promise<any> {
		return this.images.remove(key)
			.catch(error => this.handleError(error));
	}

	deleteAll(): void {
		this.images.remove()
			.catch(error => this.handleError(error));
	}

  // NOTE: THIS CODE BELOW IS FOR MONGODB VERSION
  createImageMongo(img: ImageModel, callback: any = null) {
    // const uri = 'http://localhost:4000/images/add';
    // const obj = img.toFirebaseJsonObject(img, ImageModel.schema);
    // let img_id = null;
    // this
    //   .http
    //   .post(uri, obj)
    //   .subscribe(res =>
    //   { img_id = res["item"]["_id"];
    //     console.log(img_id);
    //     // pass the img id
    //     window.localStorage.setItem("new-img-id",img_id);});
    // callback();

    return new Promise((resolve, reject) => {
      const uri = this.globals.serverHost +'/images/add';
      const obj = img.toFirebaseJsonObject(img, ImageModel.schema);
      this
        .http
        .post(uri, obj)
        .subscribe(res =>
        {
          if (res["item"]["_id"] !== null) {
            console.log("good");
            resolve(res["item"]["_id"]);
          } else {
            console.log("fail");
            reject("FAILURE");
          }
        });
    });
  }

  getImagesListMongo(Query: any ={}){
    const uri = this.globals.serverHost +'/images';
    let token = this.authService.IDToken;

    const requestOptions = {
      headers: new HttpHeaders({token: token}),
    };

    return this
      .http
      .get(uri, requestOptions)
      .map(res => {
        return normalizeGetObjectList(filterObjectsMultipleQuery(res,Query));
      });
  }

  getImageMongo(id: string) {
    // NOTE: If this is a FirebaseProject, get project detail using Firebase function
    let mongoKey = id;
    if (isFirebase(id)){
      return this.getImagesListMongo({fireBaseKey:id});
    }

    const uri = this.globals.serverHost +'/images/edit/' + mongoKey;
    return this
      .http
      .get(uri)
      .map(res => {
        return normalizeGetObject(res);
      });
  }
  validateInput(img: ImageModel): boolean {
		if (img.img_time != '' && !this.datetimeService.validate(img.img_time)) {
			this.alertService.openAlert(`Date time format must be DD/MM/YYYY`, `Invalid Input`);
			return false;
		}
		if (img.img_name == '' || img.img_name == null || img.img_name == 'null') {
			this.alertService.openAlert(`Name must not be empty`, `Invalid Input`);
			return false;
		}
		else return true;
	}

}
