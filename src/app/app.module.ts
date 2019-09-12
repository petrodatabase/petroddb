import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MaterialImportModule} from "./material/material.module";
import 'hammerjs';
import {HttpModule} from "@angular/http";
import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HomeModule} from "./home/home.module";
import {RouterModule} from "@angular/router";
import {ROOT_ROUTES} from "./app.routing";
import {InputModule} from "./input/input.module";
import {AccessModule} from "./access/access.module";
import {AccountModule} from "./account/account.module";
import {QueryModule} from "./query/query.module";
import { MomentModule } from 'angular2-moment';

import {
  MdAutocompleteModule,
  MdButtonModule,
  MdButtonToggleModule,
  MdCardModule,
  MdCheckboxModule,
  // MdChipsModule,
  MdCoreModule,
  MdTableModule,
  MdDatepickerModule,
  MdDialogModule,
  MdExpansionModule,
  // MdFormFieldModule,
  MdGridListModule,
  MdIconModule,
  MdInputModule,
  MdListModule,
  MdMenuModule,
  MdNativeDateModule,
  MdPaginatorModule,
  MdProgressBarModule,
  MdProgressSpinnerModule,
  MdRadioModule,
  MdRippleModule,
  MdSelectModule,
  MdSidenavModule,
  MdSliderModule,
  MdSlideToggleModule,
  MdSnackBarModule,
  MdSortModule,
  MdTabsModule,
  MdToolbarModule,
  MdTooltipModule,
  StyleModule
} from '@angular/material';
import {FlexLayoutModule} from "@angular/flex-layout";


import {AuthComponent} from './auth/auth.component';
import {LoginComponent} from './auth/login/login.component';
import {LogoutComponent} from './auth/logout/logout.component';
import {SignupComponent} from './auth/signup/signup.component';
import {BaseService} from "./services/base.service";
import {AuthService} from "./auth/auth.service";
import {ErrorService} from "./services/error.service";
import {HomeComponent} from "./home/home.component";
import {InputComponent} from "./input/input.component";
import {AccessComponent} from "./access/access.component";
import {AccountComponent} from "./account/account.component";
import {QueryComponent} from "./query/query.component";
import {BaseComponent} from './components/base/base.component';
import {LoadComponent} from './components/load/load.component';
import {LoadingService} from "./services/loading.service";
import {ForgetPasswordComponent} from './auth/forget-password/forget-password.component';
import {ExcelUploaderTestComponent} from './components/excel-uploader-test/excel-uploader-test.component';
import {FileUploadModule} from "ng2-file-upload";
import {ChartsModule} from "ng2-charts";
import {ConfirmDialogComponent} from './components/confirm-dialog/confirm-dialog.component';
import {AlertDialogComponent} from './components/alert-dialog/alert-dialog.component';
import {ErrorDialogComponent} from './components/error-dialog/error-dialog.component';
import {ConfirmService} from "./components/confirm-dialog/confirm.service";
import {AlertService} from "./components/alert-dialog/alert.service";
import {AngularFireModule} from "angularfire2";
import {environment} from "../environments/environment";
import {AngularFireDatabaseModule} from "angularfire2/database";
import {AngularFireAuthModule} from "angularfire2/auth";
import {AnalysisService} from "./services/database-services/analysis.service";
import {ChartService} from "./services/database-services/chart.service";
import {DiffusionService} from "./services/database-services/diffusion.service";
import {EruptionService} from "./services/database-services/eruption.service";
import {ImageModelService} from "./services/database-services/image-model.service";
import {ImgRelService} from "./services/database-services/img-rel.service";
import {ObservatoryService} from "./services/database-services/observatory.service";
import {ProjectService} from "./services/database-services/project.service";
import {PublicationService} from "./services/database-services/publication.service";
import {SampleService} from "./services/database-services/sample.service";
import {TraverseService} from "./services/database-services/traverse.service";
import {UserService} from "./services/database-services/user.service";
import {VolcanoService} from "./services/database-services/volcano.service";
import {WorkspaceService} from "./services/database-services/workspace.service";
import {AuthLoggedInGuard} from "./auth/auth.guard";
import {FileUploadService} from "./services/file-upload.service";
import {LinkFileService} from "./services/database-services/link-file.service";
import {SampleGuard} from "./auth/sample.guard";
import {ProjectGuard} from "./auth/project.guard";
import {ImageAlyGuard} from "./auth/image-aly.guard";
import {DateTimeFormatService} from "./services/date-time-format.service";
import {ReportComponent} from './components/report/report.component';
import {ReportService} from "./services/database-services/report.service";
import {ReferenceService} from "./services/database-services/reference.service";
import {TutorialComponent} from './tutorial/tutorial.component';
import { PwaComponent } from './pwa/pwa.component';

// import { ProjectSampleTableComponent } from './components/project-sample-table/project-sample-table.component';

// import {GoogleChart} from 'angular2-google-chart/directives/angular2-google-chart.directive';
import {Ng2GoogleChartsModule} from "ng2-google-charts";
import {Globals} from './globals';

import { HashLocationStrategy, LocationStrategy } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    // HomeComponent,
    // InputComponent,
    // AccessComponent,
    // AccountComponent,
    // QueryComponent,

    AuthComponent,
    LoginComponent,
    LogoutComponent,
    SignupComponent,
    BaseComponent,
    LoadComponent,
    ForgetPasswordComponent,
    ConfirmDialogComponent,
    AlertDialogComponent,
    ErrorDialogComponent,
    ReportComponent,
    PwaComponent,
    // GoogleChart,
    // TutorialComponent,
    // ProjectSampleTableComponent,


    // ExcelUploaderTestComponent,

  ],
  imports: [
    CommonModule,
    MaterialImportModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    FileUploadModule,

    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule, // imports firebase/database, only needed for database features
    AngularFireAuthModule,
    // AngularFireStorageModule,

    ChartsModule,

    // materia
    MdAutocompleteModule,
    MdButtonModule,
    MdButtonToggleModule,
    MdCardModule,
    MdCheckboxModule,
    // MdChipsModule,
    MdTableModule,
    MdDatepickerModule,
    MdDialogModule,
    MdExpansionModule,
    // MdFormFieldModule,
    MdGridListModule,
    MdIconModule,
    MdInputModule,
    MdListModule,
    MdMenuModule,
    MdCoreModule,
    MdPaginatorModule,
    MdProgressBarModule,
    MdProgressSpinnerModule,
    MdRadioModule,
    MdRippleModule,
    MdSelectModule,
    MdSidenavModule,
    MdSlideToggleModule,
    MdSliderModule,
    MdSnackBarModule,
    MdSortModule,
    MdTabsModule,
    MdToolbarModule,
    MdTooltipModule,
    MdNativeDateModule,
    // CdkTableModule,
    StyleModule,
    FlexLayoutModule,



    // pages module
    // FIXME: using lazy loading
    // HomeModule,
    // InputModule,
    // AccessModule,
    // AccountModule,
    // QueryModule,

    // routes
    RouterModule.forRoot(ROOT_ROUTES),
    MomentModule,
    Ng2GoogleChartsModule,


  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    BaseService,
    AuthService,
    AuthLoggedInGuard,
    SampleGuard,
    ProjectGuard,
    ImageAlyGuard,
    ErrorService,
    LoadingService,
    ConfirmService,
    AlertService,
    FileUploadService,
    DateTimeFormatService,

    // database service
    AnalysisService,
    ChartService,
    DiffusionService,
    EruptionService,
    ImageModelService,
    ImgRelService,
    ObservatoryService,
    ProjectService,
    PublicationService,
    SampleService,
    TraverseService,
    UserService,
    VolcanoService,
    WorkspaceService,
    LinkFileService,
    ReportService,
    ReferenceService,
    Globals
  ],

  entryComponents: [
    AppComponent,
    AuthComponent,
    ConfirmDialogComponent,
    AlertDialogComponent,
    ErrorDialogComponent,
    ReportComponent,


    // data specific component required from high level

    // ExcelUploaderTestComponent,
  ],
  bootstrap: [AppComponent],


})
export class AppModule {
}
