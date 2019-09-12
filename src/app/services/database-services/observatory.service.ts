import {Injectable} from '@angular/core';
import {BaseService} from "../base.service";
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2/database";
import {AngularFireAuth} from "angularfire2/auth";
import {Observatory} from "../../models/observatory";

@Injectable()
export class ObservatoryService extends BaseService {
	public basePath: string = '/observatories';

	constructor(private afDB: AngularFireDatabase,
				private afAuth: AngularFireAuth,) {
		super();
	}

	observatories: FirebaseListObservable<Observatory[]> = null;
	image: FirebaseObjectObservable<Observatory> = null;

	getObservatoriesList(query: any = {}): FirebaseListObservable<Observatory[]> {
		this.observatories = this.afDB.list(this.basePath, {
			query: query
		});
		return this.observatories;
	}

	getObservatory(key: string): FirebaseObjectObservable<Observatory> {
		const itemPath = `${this.basePath}/${key}`;
		this.image = this.afDB.object(itemPath);
		return this.image;
	}

	createObservatory(observatory: Observatory): firebase.database.ThenableReference {
		return this.observatories.push(observatory.toFirebaseJsonObject(observatory, Observatory.schema))
			.catch(error => this.handleError(error));
	}

	updateObservatory(key: string, value: any): firebase.Promise<any> {
		return this.observatories.update(key, value)
			.catch(error => this.handleError(error));
	}


	deleteObservatory(key: string): void {
		this.observatories.remove(key)
			.catch(error => this.handleError(error));
	}

	deleteAll(): void {
		this.observatories.remove()
			.catch(error => this.handleError(error));
	}

}
