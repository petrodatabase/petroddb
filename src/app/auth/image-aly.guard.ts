import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {AngularFireAuth} from "angularfire2/auth";
import {AlertService} from "../components/alert-dialog/alert.service";

@Injectable()
export class ImageAlyGuard implements CanActivate {

	constructor(private auth: AngularFireAuth, private router: Router,
				private activatedRoute: ActivatedRoute,
				private alertService: AlertService,) {

	}

	// canActivate(next: ActivatedRouteSnapshot,
	// 			state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
	// 	return true;
	// }

	canActivate(): Observable<boolean> {
		return this.auth.authState
			.take(1)
			.map((authState) => !!authState)
			.do(authenticated => {
				if (!authenticated) {
					this.alertService.openAlert(`You are not authorized to access this page`, 'Permission Denied', () => {
							this.router.navigate(['/access']);
						}
					);
				}
				else {
					this.activatedRoute.params.subscribe(params => {
						// this.params =
					})
				}
			});
	}
}
