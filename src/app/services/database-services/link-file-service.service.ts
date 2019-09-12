// import {Injectable} from '@angular/core';
// import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2/database";
// import {AngularFireAuth} from "angularfire2/auth";
// import {BaseService} from "../base.service";
// import {LinkFile} from "../../models/link-file";
//
// /*
// FIXME: in the future, amount of images and files go up and exceed firebase bucket
// FIXME: we need to connect it to a separate local server to store files
//  */
//
// @Injectable()
// export class LinkFileService extends BaseService {
//
// 	private basePath: string = '/uploads';
//
// 	linkFiles: FirebaseListObservable<LinkFile[]> = null;
// 	linkFile: FirebaseObjectObservable<LinkFile> = null;
//
// 	constructor(private afDB: AngularFireDatabase,
// 				private afAuth: AngularFireAuth,) {
// 		super();
// 		this.linkFiles = this.afDB.list(this.basePath);
// 		this.linkFile = this.afDB.object(this.basePath);
// 	}
//
// 	getLinkFilesList(query: any = {}): FirebaseListObservable<LinkFile[]> {
// 		this.linkFiles = this.afDB.list(this.basePath, {
// 			query: query
// 		});
// 		return this.linkFiles;
// 	}
//
// 	getLinkFile(key: string): FirebaseObjectObservable<LinkFile> {
// 		const itemPath = `${this.basePath}/${key}`;
// 		this.linkFile = this.afDB.object(itemPath);
// 		return this.linkFile;
// 	}
//
// 	createLinkFile(linkFile: LinkFile, callback: any = null): firebase.database.ThenableReference {
// 		return this.linkFiles.push(linkFile.toFirebaseJsonObject(linkFile, LinkFile.schema))
// 			.then((newLinkFileRef: firebase.database.ThenableReference) => {
// 				console.log(newLinkFileRef);
// 				// sp.$key = newLinkFileRef.key;
// 				// let jsonSp = (new LinkFile(sp)).toFirebaseJsonObject();
// 				// console.log(sp);
// 				// console.log(jsonSp);
// 				// this.updateLinkFile(newLinkFileRef.key, jsonSp);
// 				if (callback) {
// 					callback(newLinkFileRef);
// 				}
// 			})
// 			.catch(error => this.handleError(error));
// 	}
//
// 	updateLinkFile(key: string, value: any): firebase.Promise<any> {
// 		// return this.afDB.object(`${this.basePath}/${key}`).update(value)
// 		return this.linkFiles.update(key, value)
// 			.then((data) => {
// 				console.log(data);
// 			})
// 			.catch(error => {
// 				console.log('Error update linkFile');
// 				this.handleError(error);
// 			});
// 	}
//
// 	// update linkFile with the entire linkFile
// 	// updateLinkFile(sp: LinkFile): void {
// 	//
// 	// }
//
// 	deleteLinkFile(key: string): firebase.Promise<void> {
// 		return this.linkFiles.remove(key)
// 			.catch(error => this.handleError(error));
// 	}
//
// 	deleteAll(): firebase.Promise<void> {
// 		return this.linkFiles.remove()
// 			.catch(error => this.handleError(error));
// 	}
//
// }
