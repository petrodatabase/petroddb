import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './home.component';
import {MaterialImportModule} from "../material/material.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpModule} from "@angular/http";
import {HttpClientModule} from "@angular/common/http";
import 'hammerjs';
import {RouterModule} from "@angular/router";
import {HOME_ROUTES} from "./home.routing";
import {FlexLayoutModule} from "@angular/flex-layout";
import {AngularFireModule} from "angularfire2";
import {environment} from "../../environments/environment";
import {AngularFireDatabaseModule} from "angularfire2/database";
import {AngularFireAuthModule} from "angularfire2/auth";
import { FooterComponent } from './footer/footer.component';

@NgModule({
	imports: [
		CommonModule,
		// BrowserModule,
		// BrowserAnimationsModule,
		FormsModule,
		ReactiveFormsModule,
		HttpModule,
		HttpClientModule,

		FlexLayoutModule,

		MaterialImportModule,
		AngularFireModule.initializeApp(environment.firebaseConfig),
		AngularFireDatabaseModule, // imports firebase/database, only needed for database features
		AngularFireAuthModule,


		RouterModule.forChild(HOME_ROUTES),
	],
	declarations: [HomeComponent, FooterComponent]
})
export class HomeModule {
}
