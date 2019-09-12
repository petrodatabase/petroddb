import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {HttpClientModule} from "@angular/common/http";
import {MaterialImportModule} from "../material/material.module";
import {AngularFireModule} from "angularfire2";
import {environment} from "../../environments/environment";
import 'hammerjs';
import {AngularFireDatabaseModule} from "angularfire2/database";
import {AngularFireAuthModule} from "angularfire2/auth";
import {RouterModule} from "@angular/router";
import {TUTORIAL_ROUTES} from "./tutorial.routing";
import {TutorialComponent} from "./tutorial.component";

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


		RouterModule.forChild(TUTORIAL_ROUTES),
  ],
  declarations: [
    TutorialComponent,
  ]
})
export class TutorialModule { }
