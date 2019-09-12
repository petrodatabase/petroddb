import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewChildren, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {LoadingService} from "../../services/loading.service";
import {Sample} from "../../models/sample";
import {ImageModel} from "../../models/image-model";
import {Eruption} from "../../models/eruption";
import {User} from "../../models/user";
import {Volcano} from "../../models/volcano";
import {Project} from "../../models/project";
import {PointAlyCanvas} from "../fabric-classes/point-aly-canvas";
import {DiffusionCanvas} from "../fabric-classes/diffusion-canvas";
import {CanvasModel} from "../fabric-classes/canvas-model";
import {Analysis} from "../../models/analysis";
import {AlyElement} from "../../models/aly-element";
import {Diffusion} from "../../models/diffusion";

import {BehaviorSubject} from 'rxjs';
import {UploadResult} from "../../components/excel-uploader-test/excel-uploader-test.component";
import {ExcelReaderService} from "../../services/excel-reader.service";
import {PointAlyExcelReaderService} from "../../services/point-aly-excel-reader.service";
import {DiffusionExcelReaderService} from "../../services/diffusion-excel-reader.service";
import {AlyTableComponent} from "./aly-table/aly-table.component";
import {DifTableComponent} from "./tables/dif-table/dif-table.component";
import {MdDialog} from "@angular/material";
import {
  PointAlyChartDialogComponent,
  PointAlyChartOnClose
} from "../charts/point-aly-chart-dialog/point-aly-chart-dialog.component";
import {Chart} from "../../models/chart";
import {AlertService} from "../../components/alert-dialog/alert.service";
import {ConfirmService} from "../../components/confirm-dialog/confirm.service";
import {SampleService} from "../../services/database-services/sample.service";
import {ImageModelService} from "../../services/database-services/image-model.service";
import {ProjectService} from "../../services/database-services/project.service";
import {VolcanoService} from "../../services/database-services/volcano.service";
import {UserService} from "../../services/database-services/user.service";
import {AnalysisService} from "../../services/database-services/analysis.service";
import {DiffusionService} from "../../services/database-services/diffusion.service";
import {ChartService} from "../../services/database-services/chart.service";
import {AuthService} from "../../auth/auth.service";
import {ModelPermission} from "../../models/base-model";
import {Ng2GoogleChartsModule} from "ng2-google-charts";
import {Title} from "@angular/platform-browser";

declare var SimpleImage: any;


export interface PlagioclaseChart {
  data: any[];
  labels: any[];
  options: any;
  legend: boolean;
  type: string;
  click: any;
  hover: any;

}

export interface PlagLinearParams {
  // y = a x + b
  a: number
  b: number
}

@Component({
  selector: 'app-image-aly',
  templateUrl: './image-aly.component.html',
  styleUrls: ['./image-aly.component.css'],
  providers: [ExcelReaderService, PointAlyExcelReaderService, DiffusionExcelReaderService],
  encapsulation: ViewEncapsulation.None,
})
export class ImageAlyComponent implements OnInit, OnDestroy, AfterViewInit {

  r_for_x_axis:number ;
  r_for_y_axis: number ;
  subscriber: any;
  id: string;
  sample: Sample;

  permission: ModelPermission;
  modelPermission = ModelPermission;

  isInfoEdit: boolean = false;
  infoLoading: boolean = false;
  image: ImageModel;
  imageSchema = ImageModel.schema;

  selectedTabIndex: number;
  pointAlyCanvas: CanvasModel;
  difCanvas: CanvasModel;

  greyscales: number[];
  plagioclaseSet: any;
  plagioclaseLinearParams: PlagLinearParams = {a: 1, b: 0};
  plagioclaseChart: PlagioclaseChart = {
    data: [],
    labels: [],
    options: {
      scaleShowVerticalLines: false,
      responsive: true,
      maintainAspectRatio: false,
    },
    legend: true,
    type: 'bar',
    click: (e) => {
      console.log(e);
    },
    hover: (e) => {

    },
  };

  public uploaderContent: BehaviorSubject<string> = new BehaviorSubject('please drop file in');

  @ViewChild(AlyTableComponent)
  alyTableComponent: AlyTableComponent;

  pointAlyChartDialogConfig = {
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

  pointAlyChartConfig: any = null;

  newChart: Chart;
  newChartConfig: any;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private loadingService: LoadingService,
              private excelReader: ExcelReaderService,
              private pointAlyReader: PointAlyExcelReaderService,
              private difReader: DiffusionExcelReaderService,
              public pointAlyChartDialog: MdDialog,
              public alertService: AlertService,
              public confirmService: ConfirmService,
              private authService: AuthService,
              private titleService: Title,
              // DB service
              private sampleService: SampleService,
              private imageModelService: ImageModelService,
              private projectService: ProjectService,
              private volcanoService: VolcanoService,
              private userService: UserService,
              private analysisService: AnalysisService,
              private diffusionService: DiffusionService,
              private chartService: ChartService,) {
    this.loadingService.handleLoading(true);
    this.selectedTabIndex = 0;

  }

  get authenticated(): boolean {
    return this.authService.authenticatedWithSample(this.sample);
  }

  onPointAlyCreated(alys: Analysis[]) {
    console.log(`Point aly created`);
    console.log(this.image.point_alys);
    this.image.point_alys = alys;
    this.alyTableComponent.database.loadDB(this.image.point_alys);
  }

  onPointAlyEditted(alys: Analysis[]) {
    console.log(`Point aly editted`);
    console.log(alys);
    console.log(this.image.point_alys);
    this.image.point_alys = alys;
    this.alyTableComponent.database.loadDB(this.image.point_alys);
  }

  onPointAlyDeleted(alys: Analysis[]) {
    console.log(`Point aly DELETEted`);
    this.image.point_alys = alys;
    this.alyTableComponent.database.loadDB(this.image.point_alys);
  }

  onDifCreated(difs: Diffusion[]) {
    this.image.diffusions = difs;
    // this.difTableComponent.database.loadDB(this.image.diffusions);
  }

  onDifEditted(difs: Diffusion[]) {
    this.image.diffusions = difs;
    // this.difTableComponent.database.loadDB(this.image.diffusions);

  }

  onDifDeleted(difs: Diffusion[]) {
    this.image.diffusions = difs;
    // this.difTableComponent.database.loadDB(this.image.diffusions);

  }


  onInfoEditConfirm() {
    // validate the inputs....
    this.infoLoading = true;
    if (this.imageModelService.validateInput(this.image)) {
      this.confirmService.openConfirm(`Are you sure to update the Image information?`, `Update Image`,
        () => {
          // yesy
          this.imageModelService.updateImage(this.image.$key, this.image.toFirebaseJsonObject(), (ref) => {

            this.infoLoading = false;
            this.isInfoEdit = false;
          });

        }
      );
    }
  }

  public setTitle( newTitle: string) {
    this.titleService.setTitle( newTitle );
  }
  ngAfterViewInit() {

  }

  ngOnInit() {
    this.subscriber = this.activatedRoute.params.subscribe(params => {
      // this.id = +params['id']; // (+) converts string 'id' to a number
      this.id = params['id']; // (+) converts string 'id' to a number
      this.retrieveData();
    });
  }


  retrieveData() {
    /** Load the Image
     *  Image sub-data need to be loaded sequentially to ensure this.image is fully instantiated
     *  In order to sub-component correct parse data
     * */
    this.imageModelService.getImageMongo(this.id)
      .subscribe(
        (img: ImageModel) => {
          if ("$value" in img && img['$value'] == null) {
            // not found!
            this.alertService.openAlert(`404 Data not found`, `Retrieval Error`,
              () => {
                // return to access
                this.router.navigate(['/access']);
              }
            );
            return;
          }
          this.setTitle(img.img_name);
          this.retrieveSampleData(img.sp_id);
          // subsequent processing
          // retrieve point analysis
          /** analysis */
          this.analysisService.getAnalysesListMongo({
            img_id: [img.$key]
          })
            .subscribe(
              (alys: any) => {
                // get the latest analyses
                console.log('alys', alys);
                img.point_alys_id = (alys.length>0)?(alys.slice(-1)[0]["_id"]):null;
                img.point_alys = (alys.length>0)
                  ?(alys.slice(-1)[0].points.map(v =>
                    {
                      v.$key= v._id;
                      return new Analysis(v);})
                  )
                  :[];
                // console.log(img.point_alys);
                /** diffusion */
                this.diffusionService.getDiffusionListMongo({
                  img_id: [img.$key]
                })
                  .subscribe(
                    (difs: Diffusion[]) => {
                      console.log("dif", difs);
                      // img.diffusions = difs.map(v => new Diffusion(v));
                      img.point_diff_id = (difs.length>0)?(difs.slice(-1)[0]["_id"]):null;
                      img.diffusions = (difs.length>0)
                        ?(difs)
                        :[];
                      /** charts */
                      // this.chartService.getChartsList(img.$key)
                      this.chartService.getChartsListMongo({
                        img_id: [img.$key]
                      })
                        .subscribe(
                          (charts: Chart[]) => {
                            img.charts = charts.map(v => new Chart(v));

                            this.image = new ImageModel(img);

                            // other initialization
                            this.initNewChart();
                            this.pointAlyReader.imgObj = this.image;
                            // console.log('starting herer');
                            // this.calculateGreyScale();
                            this.loadingService.handleLoading(false);
                          }
                        );

                    }
                  );

              }
            );

          // retrieve diffusion


          // retrieve chart


        }
      );

  }

  validateAuth(sample: Sample) {
    this.projectService.getProjectMongo(sample.proj.$key)
      .subscribe(
        (proj: Project) => {
          this.sample.proj = new Project(proj);
          this.permission = this.sample.proj.authenticatePermission(this.authService.currentUserId);
        }
      );


    if (this.permission == 1) {
      this.alertService.openAlert(`You are not authorized to access this page`, 'Permission Denied', () => {
          this.router.navigate(['/access']);
        }
      );
    }

    // if (!this.authService.authenticatedWithSample(sample)) {
    //   this.alertService.openAlert(`You are not authorized to access this page`, 'Permission Denied', () => {
    //       this.router.navigate(['/access']);
    //     }
    //   );
    // }
    // else {
    //   this.permission = ModelPermission.WRITE;
    // }

  }

  // TODO: to be called when image is fully loaded
  retrieveSampleData(sp_id: string) {
    this.sampleService.getSampleMongo(sp_id)
      .subscribe(
        (sp: Sample) => {
          this.sample = new Sample(sp);
          this.validateAuth(this.sample);

          // this.imageModelService.getImagesList({
          //   orderByChild: 'sp_id',
          //   equalTo: this.sample.$key,
          // }).subscribe(
          //   (imgs: ImageModel[]) => {
          //     this.sample.img = imgs.map(v => new ImageModel(v));
          //     console.log('Complete load Sample');
          //     console.log(this.sample);
          //   }
          // );

          this.imageModelService.getImagesListMongo({
            sp_id:[this.sample.$key]
          }).subscribe(
            (imgs: ImageModel[]) => {
              this.sample.img = imgs.map(v => new ImageModel(v));
              console.log('Complete load Sample');
              console.log(this.sample);
            }
          );

          this.projectService.getProjectMongo(this.sample.proj.$key)
            .subscribe(
              (proj: Project) => {
                this.sample.proj = new Project(proj);
              }
            );

          this.volcanoService.getVolcano(this.sample.vd.$key)
            .subscribe(
              (vd: Volcano) => {
                this.sample.vd = new Volcano(vd);
              }
            );
        }
      );
  }


  initNewChart() {
    this.newChart = new Chart({
      // $key: '308jtioajoiasf' + this.image.charts.length,
      $key: this.chartService.getItemId(this.image.$key),
      // img_id: this.image._id,
      chart_name: '',
      comment: '',
      type: '',
    });

    // mainly for dimension
    // let otherDims = (this.image.point_alys.length > 0) ? Object.keys(this.image.point_alys[0]['data'] || {}) : [];
    const sortedElements = ['SiO2','TiO2','Al2O3','Fe2O3','FeO*','MnO','MgO','CaO','Na2O','K2O','P2O5','LoI','Cs','Rb',
      'Ba','Th','U','Pb','Ta','Nb','Sr','Hf','Zr','Y','La','Ce','Pr','Nd','Sm','Eu','Gd','Tb','Dy','Ho','Er','Tm','Yb',
      'Lu','Cu','Zn','Sc','V','Cr','Co','Ni','H2O','CO2','Cl','S','_18O','87Sr_86Sr','87Rb_86Sr','143Nd_144Nd','147Sm_144Nd',
      '206Pb_204Pb','207Pb_204Pb','208Pb_204Pb','176Hf_177Hf','238U_232Th','238U_230Th','230Th_238U','230Th_232Th','234U_238U',
      '231Pa_235U','226Ra_230Th','226Ra','226Ra_210Po','210Po','10Be_9Be'];
    let otherDims = (this.image.point_alys.length > 0) ? sortedElements : [];

    let allDims = ['pos_x', 'pos_y'].concat(otherDims);
    let allAccessDims = ['pos_x', 'pos_y'].concat(otherDims.map(k => `data.${k}`));
    let selectiveDims = {};
    allAccessDims.forEach(k => {
      selectiveDims[k] = false;
    });

    this.newChartConfig = {
      allDims: allDims,
      allAccessDims: allAccessDims,
      x_axis: '',
      y_axis: '',
      otherDims: [],
      selectiveDims: selectiveDims
    };
  }

  openNewChart() {
    console.log(this.newChart);
    console.log(this.newChartConfig);
    if (this.newChart.chart_name == '') {
      this.alertService.openAlert('Chart name must not be empty', 'New Chart');
      return;
    }
    let data_ids = Object.keys(this.alyTableComponent.selected)
      .filter(k => this.alyTableComponent.selected[k]);
    if (data_ids.length == 0) {
      this.alertService.openAlert('Must select at least 1 point analysis', 'New Chart');
      return;
    }

    switch (this.newChart.type) {
      case 'line':
        if (this.newChartConfig.x_axis == '') {
          this.alertService.openAlert('X axis must be present', 'New Chart');
          return;
        }
        if (Object.keys(this.newChartConfig.selectiveDims).filter(k => this.newChartConfig.selectiveDims[k]).length == 0) {
          this.alertService.openAlert('Must select at least 1 dimension from checkbox', 'New Chart');
          return;
        }
        // set dimension
        this.newChart.x_axis = this.newChartConfig.x_axis;
        this.newChart.other_axes = Object.keys(this.newChartConfig.selectiveDims).filter(k => this.newChartConfig.selectiveDims[k]);
        // data ids
        this.newChart.data_ids = data_ids;

        this.openChart(new Chart(this.newChart), true);

        break;
      case 'bar':
      case 'pie':
      case 'doughnut':
      case 'polarArea':
      case 'ternary':

        if (Object.keys(this.newChartConfig.selectiveDims).filter(k => this.newChartConfig.selectiveDims[k]).length == 0) {
          this.alertService.openAlert('Must select at least 1 dimension from checkbox', 'New Chart');
          return;
        }
        // set dimension
        // this.newChart.x_axis = this.newChartConfig.x_axis;
        this.newChart.other_axes = Object.keys(this.newChartConfig.selectiveDims).filter(k => this.newChartConfig.selectiveDims[k]);
        // data ids
        this.newChart.data_ids = data_ids;
        this.openChart(new Chart(this.newChart), true);

        break;
      case 'scatter':

        if (this.newChartConfig.x_axis == '') {
          this.alertService.openAlert('X axis must be present', 'New Chart');
          return;
        }
        if (Object.keys(this.newChartConfig.selectiveDims).filter(k => this.newChartConfig.selectiveDims[k]).length == 0) {
          this.alertService.openAlert('Must select 1 dimension from checkbox', 'New Chart');
          return;
        }
        if (Object.keys(this.newChartConfig.selectiveDims).filter(k => this.newChartConfig.selectiveDims[k]).length > 1) {
          this.alertService.openAlert('Please only select 1 dimension from checkbox', 'New Chart');
          return;
        }
        // set dimension
        console.log(this.newChartConfig.selectiveDims);
        this.newChart.x_axis = this.newChartConfig.x_axis;
        this.newChart.other_axes = Object.keys(this.newChartConfig.selectiveDims).filter(k => this.newChartConfig.selectiveDims[k]);
        // data ids
        this.newChart.data_ids = data_ids;

        // set R
        this.newChart.r_x_axis =
          (this.r_for_x_axis !== 0 || this.r_for_x_axis !== null || this.r_for_x_axis !== undefined) ? this.r_for_x_axis : 0;
        this.newChart.r_y_axis =
          (this.r_for_y_axis !== 0 || this.r_for_y_axis !== null || this.r_for_y_axis !== undefined) ? this.r_for_y_axis : 0;
        this.openChart(new Chart(this.newChart), true);

        break;
      default:
        this.alertService.openAlert(`Type of chart cannot be ${this.newChart.type}`, 'New Chart');
        return;
    }
    this.initNewChart();
  }

  onNewChartXChange() {
    console.log(this.newChartConfig.x_axis);
    this.newChartConfig.selectiveDims[this.newChartConfig.x_axis] = false;
  }

  openChart(chart: Chart, savable: boolean = false) {
    // open dialog!
    console.log("height and width");
    console.log(`${window.innerHeight} - ${window.innerWidth}`);
    this.pointAlyChartDialogConfig.width = `${window.innerWidth * 0.8}px`;
    this.pointAlyChartDialogConfig.height = `${window.innerHeight - 100}px`;
    this.pointAlyChartDialogConfig.data = {
      chart: chart,
      width: window.innerWidth * 0.8,
      height: window.innerHeight - 100,
      pointAlys: this.image.point_alys,
      savable: savable
    };

    this.pointAlyChartConfig = this.pointAlyChartDialogConfig;

    // let dialogRef = this.pointAlyChartDialog.open(PointAlyChartDialogComponent, this.pointAlyChartDialogConfig);
    //
    // dialogRef.afterClosed().subscribe(
    // 	(result: PointAlyChartOnClose ) => {
    // 		console.log(result);
    // 		if (result.data) {
    // 			// save it
    // 			console.log('Save it');
    // 			this.image.charts.push(result.data);
    // 		}
    // 	}
    // );
  }

  resetChart() {
    this.pointAlyChartConfig = null;
  }

  saveChart() {
    if (!this.pointAlyChartConfig) return;
    this.confirmService.openConfirm(`Are you sure to create this chart?`, `Creating Chart`,
      () => {
        // yes
        this.chartService.createChartMongo(this.image.$key, this.pointAlyChartConfig.data.chart,
          (ref) => {
            //callback
            // reload component after create chart
            this.retrieveData();
            this.resetChart();
          }
        );
      },
      () => {

      }
    );
  }

  deleteChart(chart: Chart) {
    this.confirmService.openConfirm(`Are you sure to delete this chart?`, `Delete Chart`,
      () => {
        // yes
        console.log("Deleted");
        this.chartService.deleteChartMongo(this.image.$key, chart.$key);
        // reload component after create chart
        this.retrieveData();
      },
      () => {

      }
    );
  }


  ngOnDestroy() {
    this.subscriber.unsubscribe();
    this.setTitle("Volcano Petrology");
  }

  tabSelectChange($event) {
    console.log($event);
  }


  difInfoUpdate(dif: Diffusion, index: number) {
    this.image.diffusions[index] = dif;
  }

  onImageLoaded() {
    setTimeout(() => {
      // this.calculateGreyScale();
    }, 0);
  }

  calculateGreyScale() {
    this.greyscales = [];
    this.plagioclaseSet = {};
    for (let i = 0; i <= 255; i++) {
      this.plagioclaseSet[i] = 0;
    }
    // let image = new SimpleImage(document.getElementById(`image-info`));
    let img = new Image();
    img.crossOrigin = 'anonymous';
    // img.src = this.image.img_url + '&test=jkasdlkjasjdlka';
    img.src = this.image.img_url;
    img.setAttribute('crossOrigin', '');
    img.onload = () => {
      // console.log(image);
      // console.log(image.values());
      let image = new SimpleImage(img);
      // img.
      // for (let pixel of img.values()) {
      for (let pixel of image.values()) {
        let avg = (pixel.getRed() + pixel.getGreen() + pixel.getBlue()) / 3;
        // pixel.setRed(avg);
        // pixel.setGreen(avg);
        // pixel.setBlue(avg);
        // console.log(avg);
        // this.greyscales.push(+avg.toFixed(0));
        avg = +avg.toFixed(0);
        if (!this.plagioclaseSet[avg]) {
          this.plagioclaseSet[avg] = 1;
        }
        else {
          this.plagioclaseSet[avg]++;
        }
      }
      // this.greyscales.sort();
      // console.log(this.greyscales);

      // this.greyscales.forEach(v => {
      // 	if (!this.plagioclaseSet[v]) {
      // 		this.plagioclaseSet[v] = 1;
      // 	}
      // 	else {
      // 		this.plagioclaseSet[v]++;
      // 	}
      // });
      this.plotPlagioclase();

    };


    // console.log(Object.keys(this.plagioclaseSet).length);

  }

  plotPlagioclase() {
    // console.log(this.plagioclaseLinearParams);
    let keys = Object.keys(this.plagioclaseSet).map(v => Number(v)).sort((a: number, b: number) => a - b);
    let labels = keys.map(v => this.inferenceAnnotation(v));
    // let data = keys.map(k => this.plagioclaseSet[k]);
    this.plagioclaseChart.labels = JSON.parse(JSON.stringify(labels));

    // this.plagioclaseChart.labels.sort();

    // console.log(this.plagioclaseChart.labels);
    if (!this.plagioclaseChart['data'] || this.plagioclaseChart.data.length == 0) {
      this.plagioclaseChart.data = [{
        data: keys.map(k => this.plagioclaseSet[k]),
        label: 'Grey Scale'
      }];
    }
  }

  inferenceAnnotation(v: number) {
    return v * this.plagioclaseLinearParams.a + this.plagioclaseLinearParams.b;
  }


  testOpenPointAlyChart() {
    this.pointAlyChartDialogConfig.data = {
      chartConfig: {},
      pointAlys: this.image.point_alys
    };


    let dialogRef = this.pointAlyChartDialog.open(PointAlyChartDialogComponent, this.pointAlyChartDialogConfig);

    dialogRef.afterClosed().subscribe(
      (result: PointAlyChartOnClose) => {
        console.log(result);
      }
    );
  }



}
