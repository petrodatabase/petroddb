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
import {Title} from "@angular/platform-browser";

import {AccessComponent} from "./access.component";
import {ACCESS_ROUTES} from "./access.routing";
import {FlexLayoutModule} from "@angular/flex-layout";
import { VolcanoComponent } from './volcano/volcano.component';
import { ProjectComponent } from './project/project.component';
import { SampleComponent } from './sample/sample.component';
import { ImageAlyComponent } from './image-aly/image-aly.component';
import { DisplayComponent } from './display/display.component';
import {AgmCoreModule} from "@agm/core";
import { WorkspacesComponent } from './sample/workspaces/workspaces.component';
import { WorkspaceComponent } from './sample/workspaces/workspace/workspace.component';
import { GoogleMapComponent } from './sample/google-map/google-map.component';
import { SampleImageListComponent } from './sample/sample-image-list/sample-image-list.component';
import { SampleFileListComponent } from './sample/sample-file-list/sample-file-list.component';
import { ImageSelectDialogComponent } from './sample/image-select-dialog/image-select-dialog.component';
import { MakelinkDialogComponent } from './sample/makelink-dialog/makelink-dialog.component';
import { PointAlyControlComponent } from './image-aly/canvas-controls/point-aly-control/point-aly-control.component';
import { DifControlComponent } from './image-aly/canvas-controls/dif-control/dif-control.component';
import { ImagePanelCanvasComponent } from './image-aly/image-panel-canvas/image-panel-canvas.component';
import {ExcelUploaderTestComponent} from "../components/excel-uploader-test/excel-uploader-test.component";
import {FileUploadModule} from "ng2-file-upload";
import { AlyTableComponent } from './image-aly/aly-table/aly-table.component';
import { DifTableComponent } from './image-aly/tables/dif-table/dif-table.component';
import {ChartsModule} from "ng2-charts";
import { DifChartComponent } from './charts/dif-chart/dif-chart.component';
import { DifChartDialogComponent } from './charts/dif-chart-dialog/dif-chart-dialog.component';
import { ImageAlyDifComponent } from './image-aly/image-aly-dif/image-aly-dif.component';
import { PointAlyChartDialogComponent } from './charts/point-aly-chart-dialog/point-aly-chart-dialog.component';
import { PointAlyChartComponent } from './charts/point-aly-chart/point-aly-chart.component';
import {environment} from "../../environments/environment";
import {AngularFireModule} from "angularfire2";
import {AngularFireDatabaseModule} from "angularfire2/database";
import {AngularFireAuthModule} from "angularfire2/auth";
import {AgmSnazzyInfoWindowModule} from "@agm/snazzy-info-window";
import { NewImageComponent } from './sample/new-image/new-image.component';
import { ImageDialogComponent } from './sample/sample-image-list/image-dialog/image-dialog.component';
import { PlagioclaseDialogComponent } from './image-aly/plagioclase-dialog/plagioclase-dialog.component';
import { VolcanoTableComponent } from './display/volcano-table/volcano-table.component';
import { SampleTableComponent } from './display/sample-table/sample-table.component';
import { PublicationTableComponent } from './publication-table/publication-table.component';
import { PublicationListComponent } from './sample/publication-list/publication-list.component';
import {ProjectTableComponent} from "../components/project-table/project-table.component";
// import {ProjectSampleTableComponent} from "../components/project-sample-table/project-sample-table.component";
import {MakelinkDialogAlreadyComponent} from "./sample/makelink-dialog/makelink-dialog-already.component";
import { AttachMetadaComponent } from './sample/new-image/attach-metada/attach-metada.component';

import {Ng2GoogleChartsModule} from "ng2-google-charts";
import {Globals} from '../globals';

import { NgxSelectModule } from 'ngx-select-ex';

@NgModule({
	imports: [
		CommonModule,
		// BrowserModule,
		// BrowserAnimationsModule,
		FormsModule,
		ReactiveFormsModule,
		HttpModule,
		HttpClientModule,
		FileUploadModule,

		AngularFireModule.initializeApp(environment.firebaseConfig),
		AngularFireDatabaseModule, // imports firebase/database, only needed for database features
		AngularFireAuthModule,

		ChartsModule,

		AgmCoreModule.forRoot({
			// apiKey: 'AIzaSyCFxgjl-Rry-wHRS3JJaOe8GmQkvnZoCXE'
			apiKey: 'AIzaSyCQFwSOrzigBfDVuDpSZHof5lb4dRnh4_s'
		}),
		AgmSnazzyInfoWindowModule,
		MaterialImportModule,

		RouterModule.forChild(ACCESS_ROUTES),
    Ng2GoogleChartsModule,
    NgxSelectModule
	],
	declarations: [
		AccessComponent,
		VolcanoComponent,
		ProjectComponent,
		SampleComponent,
		ImageAlyComponent,
		DisplayComponent,
		WorkspacesComponent,
		WorkspaceComponent,
		GoogleMapComponent,
		SampleImageListComponent,
		SampleFileListComponent,
		ImageSelectDialogComponent,
		MakelinkDialogComponent,
		PointAlyControlComponent,
		DifControlComponent,
		ImagePanelCanvasComponent,
		ExcelUploaderTestComponent,
		AlyTableComponent,
		DifTableComponent,
		DifChartComponent,
		DifChartDialogComponent,
		ImageAlyDifComponent,
		PointAlyChartDialogComponent,
		PointAlyChartComponent,
		NewImageComponent,
		ImageDialogComponent,
		PlagioclaseDialogComponent,
		VolcanoTableComponent,
		SampleTableComponent,
    PublicationTableComponent,
    PublicationListComponent,

    ProjectTableComponent,
    MakelinkDialogAlreadyComponent,
    AttachMetadaComponent,

    // ProjectSampleTableComponent,
  ],
  providers: [ Globals ],
	entryComponents: [
		ImageSelectDialogComponent,
		MakelinkDialogComponent,
		PointAlyChartDialogComponent,
		ImageDialogComponent,
		PlagioclaseDialogComponent,
    MakelinkDialogAlreadyComponent,
	]
})
export class AccessModule {
}
