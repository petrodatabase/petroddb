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


import {ACCOUNT_ROUTES} from "./account.routing";
import {AccountComponent} from "./account.component";
import {AngularFireModule} from "angularfire2";
import {environment} from "../../environments/environment";
import {AngularFireDatabaseModule} from "angularfire2/database";
import {AngularFireAuthModule} from "angularfire2/auth";
import {ProjectSampleTableComponent} from "../components/project-sample-table/project-sample-table.component";
// import {ProjectTableComponent} from "../components/project-table/project-table.component";

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

		RouterModule.forChild(ACCOUNT_ROUTES),
	],
	declarations: [
	  AccountComponent,
    // ProjectTableComponent,
    ProjectSampleTableComponent,
  ]
})
export class AccountModule {
}
