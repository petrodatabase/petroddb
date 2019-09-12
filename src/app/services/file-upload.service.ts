import {Injectable} from '@angular/core';
import {AngularFireDatabase} from "angularfire2/database";

import * as firebase from 'firebase';
import {LinkFile} from "../models/link-file";
import {AlertService} from "../components/alert-dialog/alert.service";
import {AuthService} from "../auth/auth.service";
import {LinkFileService} from "./database-services/link-file.service";
import {ImageModel} from "../models/image-model";
import {ImageModelService} from "./database-services/image-model.service";

@Injectable()
export class FileUploadService {

	private basePath: string = '/uploads';
	private imageBasePath: string = '/images';
	private uploadTask: firebase.storage.UploadTask;

	constructor(
		private afDB: AngularFireDatabase,
		private alertService: AlertService,
		private authService: AuthService,
		private linkFileService: LinkFileService,
		private imageService: ImageModelService,
	) {
	}

	// execute file uploading!
	pushUpload(uploadFile: LinkFile, callback: any = null) {
		let storageRef = firebase.storage().ref();
		let stored_name = `${this.authService.currentUserId}_${+ new Date()}_${uploadFile.file.name}`;
		this.uploadTask = storageRef.child(`${this.basePath}/${stored_name}`).put(uploadFile.file);

		this.uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
			(snapshot: firebase.storage.UploadTaskSnapshot) => {
				// uploadFile.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
				uploadFile.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100

			},
			(error) => {
				// upload failed
				console.log(error);
				this.alertService.openAlert('Upload failed!', 'Upload file');
			},
			() => {
				uploadFile.file_url = this.uploadTask.snapshot.downloadURL;
				uploadFile.file_name = uploadFile.file.name;
				uploadFile.stored_file_name = stored_name;

				this.saveFileData(uploadFile, callback);
					// .then((ref: firebase.database.ThenableReference) => {
					// 	if (callback) {
					// 		callback(ref);
					// 	}
					// })
			}
		)
	}

	imagePushUpload(imageFile: ImageModel, callback: any = null) {
		let storageRef = firebase.storage().ref();
		let stored_name = `${this.authService.currentUserId}_${+ new Date()}_${imageFile.file.name}`;
		this.uploadTask = storageRef.child(`${this.imageBasePath}/${stored_name}`).put(imageFile.file);

		this.uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
			(snapshot: firebase.storage.UploadTaskSnapshot) => {
				// uploadFile.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
				imageFile.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100

			},
			(error) => {
				// upload failed
				console.log(error);
				this.alertService.openAlert('Upload failed!', 'Upload file');
			},
			() => {
				imageFile.img_url = this.uploadTask.snapshot.downloadURL;
				imageFile.stored_file_name = stored_name;
				// imageFile.file_name = imageFile.file.name;
				this.imageSaveData(imageFile, callback);
				// .then((ref: firebase.database.ThenableReference) => {
				// 	if (callback) {
				// 		callback(ref);
				// 	}
				// })
			}
		)
	}


	imageSaveData(img: ImageModel, callback: any = null): firebase.database.ThenableReference {
		return this.imageService.createImage(img, callback);
	}

  imageSaveDataMongo(img: ImageModel, callback: any = null) {
    return this.imageService.createImageMongo(img, callback);
  }

	saveFileData(upload: LinkFile, callback: any = null): firebase.database.ThenableReference {
		// return this.afDB.list(`${this.basePath}/`).push(upload.toFirebaseJsonObject(upload, LinkFile.schema));
		return this.linkFileService.createLinkFile(upload, callback);
	}

	private deleteFileData(file: LinkFile) {
		return this.linkFileService.deleteLinkFile(file.$key);
	}

	private imageDeleteData(img: ImageModel): firebase.Promise<any> {
		return this.imageService.deleteImage(img.$key);
	}


	deleteFile(file: LinkFile) {
		this.deleteFileData(file)
			.then(() => {
				this.deleteFileStorage(this.basePath, file.stored_file_name);
			})
			.catch(error => {
				console.log('error');
				this.alertService.openAlert('Delete file failed!', 'Delete file');
			})
	}

	imageDeleteFile(img: ImageModel): firebase.Promise<any> {
		return this.imageDeleteData(img)
			.then(() => {
				this.deleteFileStorage(this.imageBasePath, img.stored_file_name);
			})
			.catch(error => {
				console.log('error');
				this.alertService.openAlert('Delete image failed!', 'Delete Image');
			})
	}

	private deleteFileStorage(basepath: string, name: string) {
		let storageRef = firebase.storage().ref();
		storageRef.child(`${basepath}/${name}`).delete();
	}

}
