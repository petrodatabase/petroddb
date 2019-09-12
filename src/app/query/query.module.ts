import {QueryComponent} from './query.component';

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialImportModule} from "../material/material.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpModule} from "@angular/http";
import {HttpClientModule} from "@angular/common/http";
import 'hammerjs';
import {RouterModule} from "@angular/router";

import {QUERY_ROUTES} from "./query.routing";
import {AngularFireModule} from "angularfire2";
import {environment} from "../../environments/environment";
import {AngularFireAuthModule} from "angularfire2/auth";
import {AngularFireDatabaseModule} from "angularfire2/database";


@NgModule({
	imports: [
		CommonModule,
		// BrowserModule,
		// BrowserAnimationsModule,
		FormsModule,
		ReactiveFormsModule,
		HttpModule,
		HttpClientModule,
		MaterialImportModule,

		AngularFireModule.initializeApp(environment.firebaseConfig),
		AngularFireDatabaseModule, // imports firebase/database, only needed for database features
		AngularFireAuthModule,


		RouterModule.forChild(QUERY_ROUTES),
	],
	declarations: [QueryComponent]
})
export class QueryModule {
}
