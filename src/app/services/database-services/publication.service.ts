import {Injectable} from '@angular/core';
import {BaseService} from "../base.service";
import {AngularFireAuth} from "angularfire2/auth";
import {AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable} from "angularfire2/database";
import {Publication} from "../../models/publication";

@Injectable()
export class PublicationService extends BaseService {
	public basePath: string = '/publications';
	publications: FirebaseListObservable<Publication[]> = null;
	publication: FirebaseObjectObservable<Publication> = null;

	constructor(private afDB: AngularFireDatabase,
				private afAuth: AngularFireAuth,) {
		super();
		this.publications = this.afDB.list(this.basePath);
		this.publication = this.afDB.object(this.basePath);
	}


	getPublicationsList(query: any = {}): FirebaseListObservable<Publication[]> {
		this.publications = this.afDB.list(this.basePath, {
			query: query
		});
		return this.publications;
	}

	getPublication(key: string): FirebaseObjectObservable<Publication> {
		const itemPath = `${this.basePath}/${key}`;
		this.publication = this.afDB.object(itemPath);
		return this.publication;
	}

	createPublication(pu: Publication, callback?: any): firebase.database.ThenableReference {
		return this.publications.push(pu.toFirebaseJsonObject(pu, Publication.schema))
			.then((ref: firebase.database.ThenableReference) => {
				if (callback) {
					callback(ref);
				}
			})
			.catch(error => this.handleError(error));
	}

	createWholePubs(pus: Publication[]) {
		let updates = {};
		pus.forEach(pus => {
			pus.$key = this.publications.push({}).key;
			updates[pus.$key] = pus.toFirebaseJsonObject(pus, Publication.schema);
		});
		return this.afDB.database.ref(`${this.basePath}/`).set(updates)
			.catch(error => this.handleError(error));
	}

	updatePublication(key: string, value: any): firebase.Promise<any> {
		return this.publications.update(key, value)
			.catch(error => this.handleError(error));
	}


	deletePublication(key: string): void {
		this.publications.remove(key)
			.catch(error => this.handleError(error));
	}

	deleteAll(): void {
		this.publications.remove()
			.catch(error => this.handleError(error));
	}
}
