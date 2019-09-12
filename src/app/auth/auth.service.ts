import {Injectable} from '@angular/core';

// FIXME: environment change to productions
import {environment} from "../../environments/environment";
import {BaseService} from "../services/base.service";
import {HttpClient} from "@angular/common/http";
import {ErrorService} from "../services/error.service";
import {User} from "../models/user";

import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';
import {AngularFireAuth} from "angularfire2/auth";
import {AngularFireDatabase} from "angularfire2/database";
import {Router} from "@angular/router";

import * as firebase from 'firebase/app';
import {AlertService} from "../components/alert-dialog/alert.service";
import {Sample} from "../models/sample";
import {ImageModel} from "../models/image-model";
import {Project} from "../models/project";
import {PlainUser} from "../models/plain-user";

@Injectable()
export class AuthService extends BaseService {

	authState: any = null;
  idToken: any = null;
	// public globalUrl: string = environment.serverHost; // including host
	constructor(
		private http: HttpClient,
		private errorService: ErrorService,
		private afAuth: AngularFireAuth,
		private afDB: AngularFireDatabase,
		private router: Router,
		private alertService: AlertService,
	) {
		super();
		this.afAuth.authState.subscribe(
			(auth) => {
				this.authState = auth;
        this.idToken = auth.getIdToken(/* forceRefresh */ true).then(function(idToken) {
          localStorage.setItem('userToken', idToken);
          return idToken ;
        }).catch(function(error) {
          // Handle error
          return "error";
        });
			}
		)

	}

	signUpWithEmailAndPassword(user: User, plainUser: PlainUser, callback: any = null, handleError: any = null): firebase.Promise<any> {
		// return observable
		// let body = JSON.stringify(user);
		// let headers = new Headers({'Content-Type': 'application/json'});
		// return this.http.post(`${this.url}users/create`, body, {headers: headers})
		// 	.map((res: Response) => {
		// 		return res.json();
		// 	})
		// 	.catch((error: Response) => {
		// 		this.errorService.handleError(error.json());
		// 		return Observable.throw(error.json());
		// 	});

    // this.authState = credential.user;
    // this.updateUserData();
    console.log(plainUser);
    console.log(user);

    return this.afAuth.auth.createUserWithEmailAndPassword(plainUser.email, plainUser.password)
      .then((credential) => {
        console.log(credential);
        // console.log(credential.user);

        this.authState = credential;
        let path = `/users/${this.currentUserId}`;
        user.displayName = user.email.split('@')[0];
        let userUpdates = user.toFirebaseJsonObject();
        this.afDB.object(path).update(userUpdates)
          .catch(error => {
            console.log(error);
          });


        if (callback) {
          callback(credential);
        }
      })
      .catch(error => {
        this.handleError(error);
        if (handleError) {
          handleError(error);
        }
      });
	}

	logInWithEmailAndPassword(user: PlainUser, callback: any = null, handleError: any = null) {
    return this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password)
      .then((credential) => {
        console.log(credential);
        this.authState = credential.user;
        // this.updateUserData();
        if (callback) {
          callback(credential);
        }
      })
      .catch(error => {
        this.handleError(error);
        if (handleError) {
          handleError(error);
        }
      });
	}

	logout() {
		// localStorage.clear();
		this.afAuth.auth.signOut();
		this.router.navigate(['/']);
	}

	resetPassword(email: string) {
		let auth = firebase.auth();
		return auth.sendPasswordResetEmail(email)
			.then(() => {
				console.log('email sent');
				this.alertService.openAlert(`Reset password email has been sent to ${email}`, 'Reset Password');
			})
			.catch(error => {
				console.log(error);
			})
	}

	get currentUser(): any {
		return this.authenticated ? this.authState : null;
	}

	get authenticated(): boolean {
		return this.authState !== null;
	}

	get IDToken(): string {
	  return this.authenticated ? localStorage.getItem('userToken') : "error" ;
  }

	authenticatedWithSample(sample: Sample): boolean {
		if (!this.authenticated || !sample) return false;
		if (this.currentUserId == sample.sp_pi.$key) return true;
		if (this.currentUserId == sample.sp_editor.$key) return true;
		if (this.currentUserId == sample.sp_uploader.$key) return true;
		if (sample.sp_autho.map(v => v.$key).includes(this.currentUserId)) return true;
		return false;
	}

	authenticatedWithImage(image: ImageModel, sample: Sample): boolean {
		return this.authenticatedWithSample(sample);
	}

	authenticatedWithProject(project: Project): boolean {
		if (!this.authenticated || !project) return false;
		if (this.currentUserId == project.proj_pi.$key) return true;
		if (this.currentUserId == project.proj_creator.$key) return true;
		if (this.currentUserId == project.proj_contact.$key) return true;
		if (project.proj_autho.map(v => v['$key']).includes(this.currentUserId)) return true;
	}

	// get authenticationObservable(): Observable<boolean> | boolean {
	getAuthState(): any {
		// let router: Router = this.router;
		// let obs;
		//
		// try {
		// 	obs = this.authHttp.get('/api/check/logged')
		// 		.map(result => result.json())
		// 		.map(resultJson => (resultJson && resultJson.success));
		//
		// } catch (err) {
		// 	obs = Observable.of(false);
		// }
		//
		// return obs
		// 	.map(success => {
		// 		// navigate to login page
		// 		if (!success)
		// 			router.navigate(['/auth/login']);
		//
		// 		return success;
		// 	});
		return this.authState;
	}

	get currentUserObservable(): any {
		return this.afAuth.authState;
	}

	get currentUserId(): string {
		return this.authenticated ? this.authState.uid : '';
	}

	get currentUserAnonymous(): boolean {
		return this.authenticated ? this.authState.isAnonymous : false;
	}

	// get display name or guest
	get currentUserDisplayName(): string {
		if (!this.authState) {
			return 'Guest';
		}
		else if (this.currentUserAnonymous) {
			return 'Anonymous';
		}
		else {
			return this.authState['displayName'] || this.authState['email'] || 'No-name';
		}
	}

	private socialSignIn(provider) {
		return this.afAuth.auth.signInWithPopup(provider)
			.then(
				(credential) => {
					this.authState = credential.user;
					this.updateUserData();
				}
			)
			.catch(error => {
				console.log(error);
			})
	}

	updateUserData(): void {
		// writes username and email to realtime DB
		let path = `/users/${this.currentUserId}`;
		// let data = {
		// 	email: this.authState.email,
		// 	name: this.authState.displayName
		// };
		let userUpdates = {
			displayName: this.authState.displayName,
			email: this.authState.email
		};

		this.afDB.object(path).update(userUpdates)
			.catch(error => {
				console.log(error);
			})
	}

	// social auth
	githubLogin() {
		const provider = new firebase.auth.GithubAuthProvider();
		return this.socialSignIn(provider);
	}

	googleLogin() {
		const provider = new firebase.auth.GoogleAuthProvider();
		return this.socialSignIn(provider);
	}

	facebookLogin() {
		const provider = new firebase.auth.FacebookAuthProvider();
		return this.socialSignIn(provider);
	}

	twitterLogin(){
		const provider = new firebase.auth.TwitterAuthProvider()
		return this.socialSignIn(provider);
	}

	anonymousLogin() {
		return this.afAuth.auth.signInAnonymously()
			.then((user) => {
				this.authState = user;
				this.updateUserData()
			})
			.catch(error => console.log(error));
	}


	emailSignUp(email:string, password:string) {
		return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
			.then((user) => {
				this.authState = user;
				this.updateUserData()
			})
			.catch(error => console.log(error));
	}



	emailLogin(email:string, password:string) {
		return this.afAuth.auth.signInWithEmailAndPassword(email, password)
			.then((user) => {
				this.authState = user
				this.updateUserData()
			})
			.catch(error => console.log(error));
	}


}
