import {Injectable} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2/database";
import {AngularFireAuth} from "angularfire2/auth";
import {BaseService} from "../base.service";
import {User} from "../../models/user";
import {AuthService} from "../../auth/auth.service";
import {Observable} from "rxjs/Observable";
import {AlertService} from "../../components/alert-dialog/alert.service";

@Injectable()
export class UserService extends BaseService {

	public basePath: string = '/users';

	constructor(private afDB: AngularFireDatabase,
				private afAuth: AngularFireAuth,
				private authService: AuthService,
				private alertService: AlertService,
	) {
		super();
		this.user = this.afDB.object(this.basePath);
		this.users = this.afDB.list(this.basePath);
	}

	users: FirebaseListObservable<User[]> = null;
	user: FirebaseObjectObservable<User> = null;

	getUsersList(query: any = {}): FirebaseListObservable<User[]> {
		this.users = this.afDB.list(this.basePath, {
			query: query
		});
		return this.users;
	}

	getUser(key: string): FirebaseObjectObservable<User> {
		const itemPath = `${this.basePath}/${key}`;
		this.user = this.afDB.object(itemPath);
		return this.user;
	}

	getCurrentUser(): Observable<User> {
		if (this.authService.authenticated) {
			return this.afDB.object(`${this.basePath}/${this.authService.currentUserId}`);
		}
		else {
			return new Observable((observer) => {
				observer.error({
					message: `No available user`
				});
			});
		}
	}

	createUser(us: User): firebase.database.ThenableReference {
		return this.users.push(us.toFirebaseJsonObject(us, User.schema))
			.catch(error => this.handleError(error));
	}

	updateUser(key: string, us: User): firebase.Promise<any> {
		return this.users.update(key, us.toFirebaseJsonObject())
			.catch(error => this.handleError(error));
	}


	deleteUser(key: string): void {
		this.users.remove(key)
			.catch(error => this.handleError(error));
	}

	deleteAll(): void {
		this.users.remove()
			.catch(error => this.handleError(error));
	}

}
