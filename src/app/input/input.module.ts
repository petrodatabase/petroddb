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
import { NgxSelectModule } from 'ngx-select-ex';
import {INPUT_ROUTES} from "./input.routing";

import {InputComponent} from './input.component';
import { NewSampleComponent } from './new-sample/new-sample.component';
import { NewProjectComponent } from './new-project/new-project.component';
import { NewVolcanoComponent } from './new-volcano/new-volcano.component';
import { NewEruptionComponent } from './new-eruption/new-eruption.component';
import { NewReferenceComponent } from './new-reference/new-reference.component';
import {AngularFireModule} from "angularfire2";
import {environment} from "../../environments/environment";
import {AngularFireDatabaseModule} from "angularfire2/database";
import {AngularFireAuthModule} from "angularfire2/auth";
import { NewSampleListComponent } from './new-sample/new-sample-list/new-sample-list.component';
import { NewVolcanoListComponent } from './new-volcano/new-volcano-list/new-volcano-list.component';
import { NewProjectListComponent } from './new-project/new-project-list/new-project-list.component';
import { NewObservatoryComponent } from './new-observatory/new-observatory.component';


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


		RouterModule.forChild(INPUT_ROUTES),
    NgxSelectModule
	],
	declarations: [InputComponent,
    NewSampleComponent,
    NewProjectComponent,
    NewVolcanoComponent,
    NewEruptionComponent,
    NewReferenceComponent, NewSampleListComponent, NewVolcanoListComponent, NewProjectListComponent, NewObservatoryComponent],
	entryComponents: [
		NewSampleListComponent,
		NewVolcanoListComponent,
		NewProjectListComponent,
	]
})
export class InputModule {
}
