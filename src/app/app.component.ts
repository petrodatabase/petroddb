import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {LoadingService} from './services/loading.service';
import {MdDialog, MdDialogConfig, MdSidenavContainer} from '@angular/material';
import {AuthComponent} from './auth/auth.component';
import {Observable} from 'rxjs/Observable';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {AuthService} from './auth/auth.service';
import {NavigationEnd, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {isPlatformBrowser} from '@angular/common';
import {ReportComponent} from "./components/report/report.component";
import {Report} from "./models/report";

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
	title = 'app';
	navItems = [
		{name: 'Home', route: '/home'},
    {name: 'Input', route: '/input'},
		{name: 'Access Database', route: '/access'},

		// {name: 'query', route: '/query'},
		{name: 'Account', route: '/account'},
		{name: 'Tutorial', route: '/tutorial'},
		// {name: 'tesing', route: '/pwa'},
		// {name: 'Button', route: '/button'},
		// {name: 'Button Toggle', route: '/button-toggle'},
	];


	user: Observable<firebase.User>;
	// router: Router;
	sub: Subscription;

	@ViewChild('sidenavContainer')
	// @ViewChild(MdSidenavContainer)
	sidenavContainer: any;

	authDiaglogConfig = {
		disableClose: true,
		panelClass: 'custom-overlay-pane-class',
		hasBackdrop: true,
		backdropClass: '',
		width: '',
		height: '',
		position: {
			top: '',
			bottom: '',
			left: '',
			right: ''
		},
		data: {
			message: 'data receive from opener'
		}
	};

	constructor(
		public afAuth: AngularFireAuth,
		public authService: AuthService,
		public dialog: MdDialog,
		public router: Router,
	) {
		this.user = afAuth.authState;
		// console.log(this.user);
	}

	ngOnInit() {
		// if (isPlatformBrowser) {
		this.sub = this.router.events
			.filter(event => event instanceof NavigationEnd)
			.subscribe(event => {
				const element = document.getElementsByClassName(`mat-drawer-content`);
				if (element) {

					element[0].scrollTop = 0;
				}
			});
		// }
	}

	ngOnDestroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}

	openAuthDialog() {
		// let authDialogRef = this.dialog.open(AuthComponent, this.authDiaglogConfig);
		//
		// authDialogRef.afterClosed().subscribe(
		// 	result => {
		// 		console.log(`open authdialog returned`);
		// 		console.log(result);
		// 	}
		// );
		this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
		console.log(this.user);
	}


	config = {
		disableClose: true,
		// panelClass: 'custom-overlay-pane-class',
		panelClass: 'my-full-screen-dialog',
		hasBackdrop: true,
		backdropClass: '',
		width: '',
		// width: '850px',
		height: '',
		// height: '500px',
		position: {
			top: '',
			bottom: '',
			left: '',
			right: ''
		},
		data: {},
	};
	openFeedback() {
	  let config = new MdDialogConfig();
	  Object.keys(this.config).forEach(k => config[k] = this.config[k]);

		config.data = new Report({us_id: this.authService.currentUserId});

		let dialogRef = this.dialog.open(ReportComponent, config);
		dialogRef.afterClosed().subscribe(
			(result: any ) => {
				console.log(result);
			}
		);
	}

	loginEmailAndPassword() {
	  let config = new MdDialogConfig();
	  Object.keys(this.config).forEach(k => config[k] = this.config[k]);
	  config.data = {
	    message: ''
    };

		// config.data = new Report({us_id: this.authService.currentUserId});

		let dialogRef = this.dialog.open(AuthComponent, config);
		dialogRef.afterClosed().subscribe(
			(result: any ) => {
				console.log(result);
			}
		);
  }

	loginGoogle() {
		this.authService.googleLogin()
			.then(() => this.afterLogin());
	}

	loginFacebook() {
		this.authService.facebookLogin()
			.then(() => this.afterLogin());
	}

	logout() {
		// this.afAuth.auth.signOut();
		// this.afAuth.auth.signOut();
		this.authService.logout();
	}

	afterLogin() {
		console.log(this.authService.currentUserId);
		console.log(this.authService.currentUserDisplayName);
	}

	get isAuthenticated() {
		return this.authService.authenticated;
	}

	get currentUsername() {
		return this.authService.currentUserDisplayName;
	}


}

