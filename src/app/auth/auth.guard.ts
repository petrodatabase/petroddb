import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {AuthService} from "./auth.service";
import {AngularFireAuth } from "angularfire2/auth";
import {AlertService} from "../components/alert-dialog/alert.service";

/**
AuthLoggedInGuard must prevent also on user ID of sample, image...
 */

@Injectable()
export class AuthLoggedInGuard implements CanActivate {

	// constructor(private auth: AuthService, private router: Router) {
	constructor(private auth: AngularFireAuth, private router: Router,
				private alertService: AlertService,
	) {

	}

	// canActivate(next: ActivatedRouteSnapshot,
	// 			state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
	// 	console.log(this.auth);
	// 	console.log(this.auth.currentUserId);
	// 	console.log(this.auth.currentUser);
	// 	// if (this.auth.authenticated) {
    	// 	// return true;
	// 	// }
	// 	// else {
    	// 	// console.log('access denied');
    	// 	// this.router.navigate(['/access']);
    	// 	// return false;
	// 	// }
	// 	let authState = this.auth.getAuthState();
	// 	if (authState) {
	// 		return authState.map((state) => !!state)
	// 			.do(authenticated => {
	// 				if (!authenticated) this.router.navigate(['/access']);
	//
	// 			})
	// 	}
	// 	else {
	// 		return false;
	// 	}
	//
	// 	// return this.auth.getAuthState()
	// 	// 	.take(1)
	// 	// 	.map((authState) => !!authState)
	// 	// 	.do(authenticated => {
	// 	// 	});
	//
	// }


	canActivate(): Observable<boolean> {
		return this.auth.authState
			.take(1)
			.map((authState) => !!authState)
			.do(authenticated => {
				if (!authenticated) {
					this.alertService.openAlert(`You are not authorized to access this page.\nPlease log in to your account`, 'Permission Denied', () => {
							this.router.navigate(['/home']);
						}
					);
				}
			});
	}
}
