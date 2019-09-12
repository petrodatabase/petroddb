import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ImageModel} from "../../../models/image-model";
import {Sample} from "../../../models/sample";
import {Analysis} from "../../../models/analysis";
import {Diffusion} from "../../../models/diffusion";
import {PointAlyCanvas} from "../../fabric-classes/point-aly-canvas";
import {DiffusionCanvas} from "../../fabric-classes/diffusion-canvas";
import {ExcelReaderService} from "../../../services/excel-reader.service";
import {
  AutoInterpolatorFromStageCentral,
  PointAlyExcelReaderService
} from "../../../services/point-aly-excel-reader.service";
import {environment} from "../../../../environments/environment";
import {DiffusionExcelReaderService} from "../../../services/diffusion-excel-reader.service";
import {ConfirmService} from "../../../components/confirm-dialog/confirm.service";
import {AlertService} from "../../../components/alert-dialog/alert.service";
import {AnalysisService} from "../../../services/database-services/analysis.service";
import {DiffusionService} from "../../../services/database-services/diffusion.service";
import {SampleService} from "../../../services/database-services/sample.service";
import {FileUploadService} from "../../../services/file-upload.service";
import {LinkFile} from "../../../models/link-file";
import {PlagioclaseCanvas} from "../../fabric-classes/plagioclase-canvas";
import {PlagioclaseChart} from "../image-aly.component";
import {ChartService} from "../../../services/database-services/chart.service";
import {Globals} from '../../../globals';
import {FileUploader, FileUploaderOptions} from 'ng2-file-upload/ng2-file-upload';

declare var SimpleImage: any;
// const URL = 'http://localhost:4000/uploads/analyses';
// const URLDIFF = 'http://localhost:4000/uploads/diffusion';

@Component({
  selector: 'app-image-panel-canvas',
  templateUrl: './image-panel-canvas.component.html',
  styleUrls: ['./image-panel-canvas.component.css'],
  providers: [
    ExcelReaderService,
    PointAlyExcelReaderService,
    DiffusionExcelReaderService,
  ]
})
export class ImagePanelCanvasComponent implements OnInit, AfterViewInit {
  globals: Globals;
  URL: string;
  URLDIFF: string;


  @Input()
  authenticated: boolean;

  @Input()
  sample: Sample;

  analysisSchema = Analysis.schema;
  difSchema = Diffusion.schema;

  @Output()
  onPointAlyCreated = new EventEmitter<Analysis[]>();

  @Output()
  onPointAlyEditted = new EventEmitter<Analysis[]>();

  @Output()
  onPointAlyDeleted = new EventEmitter<Analysis[]>();

  @Output()
  onDifCreated = new EventEmitter<Diffusion[]>();

  @Output()
  onDifEditted = new EventEmitter<Diffusion[]>();

  @Output()
  onDifDeleted = new EventEmitter<Diffusion[]>();

  @Output()
  onImageLoadedEvent = new EventEmitter<boolean>();
  imageLoaded: boolean = false;

  selectedTabIndex: number;

  pointAlyTabIndex: number;
  pointAlys: Analysis[];
  newPointAlys: Analysis[];
  alys_stored_name: string;
  newPointAlyType: string;
  pointAlyLoading: boolean = false;
  autoInterpolator = new AutoInterpolatorFromStageCentral();
  pointAlyCanvas: PointAlyCanvas;
  pointAlyVisible: boolean;
  pointAlyCreate: boolean;
  pointAlyEdit: boolean;
  pointAlyRemove: boolean;
  requiredParam = ["cm_stage_x", "cm_stage_y", "sm_micron_bar", "sm_micron_marker", "cm_fullsize_w", "cm_fullsize_h"];
  pointAlyFile: File;

  @ViewChild('newPointAlyFile')
  pointAlyFileInput: any;

  difTabIndex: number;
  diffusions: Diffusion[];
  newDiffusion: Diffusion;
  difLoading: boolean = false;
  difCanvas: DiffusionCanvas;
  difVisible: boolean;
  difEdit: boolean = false;
  difCreate: boolean = false;
  difRemove: boolean = false;
  difFile: File;

  @ViewChild('newDifFile')
  difFileInput: any;


  plagCanvas: PlagioclaseCanvas;
  plagVisible: boolean;
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
  plagCoeff: number = 1;
  plagBias: number = 0;
  plagEdit: boolean = false;

  image: ImageModel;

  @Input()
  set setImage(img: ImageModel) {
    this.image = img;
    this.pointAlys = this.image.point_alys;
    this.diffusions = this.image.diffusions;
    console.log(`Image loaded to panel canvas`);
    this.newDiffusion = new Diffusion({_id: `dif_${this.diffusions.length}`});
    this.difExcelReader.newDiffusion = this.newDiffusion;

    // this.pointAlyCanvas.getMouseTopLeftPos = this.getMouseTopLeftPosPointAly;
    this.pointAlyExcelReader.imgObj = this.image;


    // this.difCanvas.getMouseTopLeftPos = this.getMouseTopLeftPosDif;
    // console.log(this.difCanvas);
    //

    // FIXME: maybe this is the cause of the wrong behaviour on save new points or difs
    if (this.imageLoaded) {
      this.initPointAlyCanvas();
      this.initDifCanvas();
      this.initPlagCanvas();
    }
    // setTimeout(() => {
    // }, 1000);
  }

  constructor(public pointAlyExcelReader: PointAlyExcelReaderService,
              public difExcelReader: DiffusionExcelReaderService,
              public confirmService: ConfirmService,
              public alertService: AlertService,
              // db component
              private analysisService: AnalysisService,
              private chartService: ChartService,
              private diffusionService: DiffusionService,
              private sampleService: SampleService,
              private fileUploadService: FileUploadService,) {
    // this.selectedTabIndex = 0;
    this.pointAlyTabIndex = 0;

    this.pointAlyEdit = false;
    this.pointAlyRemove = false;
    this.pointAlyVisible = true;
    this.newPointAlyType = '';
    this.newPointAlys = [];

    this.difTabIndex = 0;
    this.difEdit = false;
    this.difRemove = false;
    this.difVisible = true;
    // this.newDiffusion;
    this.globals = new Globals();
    this.URL = this.globals.serverHost + 'uploads/analyses';
    this.URLDIFF = this.globals.serverHost + 'uploads/diffusion';

  }

  public uploader:FileUploader = new FileUploader({url: 'http://localhost:4000/uploads/analyses', itemAlias: 'analyses'});
  public uploaderDiff: FileUploader = new FileUploader({url: 'http://localhost:4000/uploads/diffusion', itemAlias: 'diffusion'});

  // public uploader:FileUploader = new FileUploader({url: 'https://petro.wovodat.org:4000/uploads/analyses', itemAlias: 'analyses'});
  // public uploaderDiff: FileUploader = new FileUploader({url: 'https://petro.wovodat.org:4000/uploads/diffusion', itemAlias: 'diffusion'});

  ngOnInit() {
    this.selectedTabIndex = 0;

    this.uploader.onBeforeUploadItem = (file ) => {
      var uo: FileUploaderOptions = {};
      uo.headers = [
        { name: 'sp-id', value : this.sample.$key },
        { name: 'img-id', value : this.image.$key }] ;
      this.uploader.setOptions(uo);
    };
    this.uploader.onAfterAddingFile = (file)=> { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
      console.log("AnalysesUploaded:uploaded:", item, status, response);
    };

    this.uploaderDiff.onBeforeUploadItem = (file ) => {
      var uo: FileUploaderOptions = {};
      uo.headers = [
        { name: 'sp-id', value : this.sample.$key },
        { name: 'img-id', value : this.image.$key }] ;
      this.uploaderDiff.setOptions(uo);
    };
    this.uploaderDiff.onAfterAddingFile = (file)=> { file.withCredentials = false; };
    this.uploaderDiff.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
      console.log("AnalysesUploaded:uploaded:", item, status, response);
    };


  }

  ngAfterViewInit() {

  }


  onImageLoaded() {
    // this.pointAlyCanvas.importCanvas(this.pointAlys);
    // this.difCanvas.importCanvas(this.diffusions);
    // this.plagCanvas.importCanvas(this.image);
    this.initPointAlyCanvas();
    this.initDifCanvas();
    this.initPlagCanvas();
    this.onImageLoadedEvent.emit(true);
    this.imageLoaded = true;
  }

  getMouseTopLeftPosPointAly(options) {
    console.log(this.pointAlyCanvas);
    let left = options.e.clientX - this.pointAlyCanvas.canvas._offset.left;
    // var top = options.e.clientY - _thisCanvas.canvas._offset.top + $("div.imgLink-img").scrollTop();
    let top = options.e.clientY - this.pointAlyCanvas.canvas._offset.top;
    // handle scrolling
    // left += this.containerScroll.left;
    // top += this.containerScroll.top;

    left /= this.pointAlyCanvas.currentZoomRatio;
    top /= this.pointAlyCanvas.currentZoomRatio;

    return {
      left: left,
      top: top,
    }
  }

  getMouseTopLeftPosDif(options) {
    console.log(this.difCanvas);
    let left = options.e.clientX - this.difCanvas.canvas._offset.left;
    // var top = options.e.clientY - _thisCanvas.canvas._offset.top + $("div.imgLink-img").scrollTop();
    let top = options.e.clientY - this.difCanvas.canvas._offset.top;
    // handle scrolling
    // left += this.containerScroll.left;
    // top += this.containerScroll.top;

    left /= this.difCanvas.currentZoomRatio;
    top /= this.difCanvas.currentZoomRatio;

    return {
      left: left,
      top: top,
    }
  }


  /** Point analysis control --------------------------------------------------------------------- */
  initPointAlyCanvas() {
    console.log(this.image,this.pointAlys,this.pointAlyCanvas);
    if (!this.image) {
      console.log('init point aly canvas: image not found');
      return;
    }
    if (!!this.pointAlyCanvas) {
      // destroy point aly canvas
      this.pointAlyCanvas.clearCache();
      this.pointAlyCanvas.clearCanvas();
      this.pointAlyCanvas = null;
    }
    console.log(`Initialize point aly canvas`);
    this.pointAlyCanvas = new PointAlyCanvas(`point-aly-canvas`, this.image.img_pix_w, this.image.img_pix_h);
    this.pointAlyCanvas.isAutoInterpolatable = this.verifyAutoInterpolatable;
    this.pointAlyCanvas.importCanvas(this.pointAlys);
  }

  onPointAlyCreate($event) {

    // other mode
    if (this.pointAlyEdit) {
      this.onPointAlyToggleEdit();
    }
    if (this.pointAlyRemove) {
      this.onPointAlyToggleRemove();
    }

    alert('feature coming soon');

    // open forms .... upload
    // automatic or manual interpolation?
    // re adjust...
    // done upload to DB

  }

  onNewPointAlyTypeChange() {
    this.newPointAlys.forEach(v => {
      v.aly_type = this.newPointAlyType;
    });
  }

  onPointAlyFileChange($event) {
    if ($event.target) {
      this.pointAlyFile = ($event.target.files.length > 0) ? $event.target.files[0] : null;
      // this.alys_stored_name = this.pointAlyFile.name;
      this.pointAlyExcelReader.handleFile($event, (data) => {
        console.log(data.rows);
        this.newPointAlys = data.rows.map((v: Analysis) => {
          v.aly_type = this.newPointAlyType;
          return v;
        });
        this.pointAlyCanvas.abortCreateMultiple();
        if (this.verifyAutoInterpolatable()) {

          // interpolate data
          // this.newPointAlys = this.newPointAlys.map(v => {
          // 	FIXME: this is fake
          // v.pos_pix_x = v.pos_x;
          // v.pos_pix_y = v.pos_y;
          // return v;
          // });
          this.newPointAlys = this.autoInterpolate(this.newPointAlys);

          console.log(this.newPointAlys);
          // import the data
          this.pointAlyCanvas.importCreatedPointAlys(this.newPointAlys);
        }
        else {
          this.pointAlyCanvas.createdPointAlys = this.newPointAlys;
          this.pointAlyCanvas.mode = 'create';
          // alert('now pick 2 points!');
          this.alertService.openAlert('Now pick 2 points if you know the positions (skip if you don\'t) \n' +
            'then Click Confirm button ', 'Upload Point Analysis');
        }

      });
    }
    else {
      // TODO: may need to abort the creation
    }
  }

  verifyAutoInterpolatable() {
    if (!this.image) {
      alert('ERROR: Point aly excel reader: img not undefined');
      return;
    }
    let valid = true;
    this.requiredParam.forEach(k => {
      if (!this.image[k] || this.image[k] == 0) {
        valid = false;
      }
    });
    return valid;
  }

  autoInterpolate(data: Analysis[]) {
    if (!this.autoInterpolator.importData(this.image, environment.interpolating_direction)) {
      alert("ERROR: unable to import autointerpolator parameters");
      return;
    }
    // let afterInterpol = [];
    let interpolated = null;
    for (let i = 0; i < data.length; i++) {
      interpolated = this.autoInterpolator.interpolate(data[i]['pos_x'], data[i]['pos_y']);
      data[i].pos_pix_x = interpolated.width;
      data[i].pos_pix_y = interpolated.height;
      // afterInterpol.push(this.processedData[i]);
    }
    return data;
  }

  onPointAlyToggleEdit() {
    if (this.pointAlyEdit) {
      // discard change if any
      // cancel / confirm

      if (confirm('Do you want to discard the changes you made?')) {
        // revert changes
        console.log('revert chagne');

      }
      this.pointAlyEdit = false;
      this.pointAlyCanvas.setMode('');

    }
    else {

      // discard change in remove button
      if (this.pointAlyRemove) {
        this.onPointAlyToggleRemove();
      }
      // turn it on
      this.pointAlyCanvas.setMode('edit');

      this.pointAlyEdit = true;
    }
  }

  onPointAlyToggleRemove() {
    if (this.pointAlyRemove) {
      // discard change if any?
      if (confirm('Do you want to discard the removals you made?')) {
        // revert changes
        console.log('revert removal');
        this.pointAlyCanvas.revertRemove();
      }
      this.pointAlyRemove = false;
      this.pointAlyCanvas.setMode('');

    }
    else {
      // discard change in edit button
      if (this.pointAlyEdit) {
        this.onPointAlyToggleEdit();
      }
      this.pointAlyCanvas.setMode('remove');


      this.pointAlyRemove = true;
    }
  }

  onPointAlyConfirm() {
    // upload all to save all the points alys
    // alert('feature coming soon');
    switch (this.pointAlyTabIndex) {
      case 0:
        break;
      case 1:
        if (this.newPointAlys.length > 0) {
          this.confirmService.openConfirm(`Are you sure to upload these ${this.newPointAlys.length} points?`, 'Create Point Analysis',
            () => {
              // yes
              // upload
              this.pointAlyLoading = true;
              /**
               * importCanvas is handle by automatic loading of firebase realtime database
               */
              console.log(this.image.$key);
              console.log(this.newPointAlys);
              this.analysisService.createAnalysesMongo(this.sample.$key, this.image.$key, this.newPointAlys, this.pointAlyFile.name)
                .then(()=>{
                  this.uploader.uploadAll();
                })
                .then(()=>{
                  this.pointAlyCanvas.clearCache();
                  this.pointAlyLoading = false;
                  this.onPointAlyCreated.emit(this.pointAlys);
                  this.newPointAlys = [];
                  this.pointAlyLoading = false;
                  console.log(`Upload finish`);
                  this.pointAlyTabIndex = 0;
                });

              // this.analysisService.createAnalysisList(this.image.$key, this.newPointAlys, (ref) => {
              //   // call back
              //   // this.pointAlys = this.pointAlys.concat(this.newPointAlys);
			  //
              //   // TODO: upload the excel files
              //   let file = new LinkFile({
              //     file: this.pointAlyFile,
              //     linkItem_id: this.sample.$key,
              //     linkItem_type: 'sample',
              //     file_comment: new Date(),
              //   });
              //   this.fileUploadService.pushUpload(file, (ref) => {
              //     this.pointAlyCanvas.clearCache();
              //     // this.pointAlyCanvas.importCanvas(this.pointAlys);
			  //
              //     this.pointAlyLoading = false;
              //     this.onPointAlyCreated.emit(this.pointAlys);
              //     this.newPointAlys = [];
              //     this.pointAlyLoading = false;
              //     console.log(`Upload finish`);
              //     this.pointAlyTabIndex = 0;
			  //
              //   });
			  //
              // })

            },
            () => {
              // no
            }
          );

        }
        else {
          // alert('You must select a valid excel for it!');
          this.alertService.openAlert(`You must select a valid excel for it!`, 'Create Point Analysis');

        }
        break;
      case 2:
        // if (this.pointAlyCanvas.edittedCanvasPointAlys.length > 0 && confirm(`Are you sure to update these ${this.pointAlyCanvas.edittedCanvasPointAlys.length} points?`)) {
        if (this.pointAlyCanvas.edittedCanvasPointAlys.length > 0) {
          // upload
          this.confirmService.openConfirm(`Are you sure to update these ${this.pointAlyCanvas.edittedCanvasPointAlys.length} points?`, 'Edit Point Analysis',
            () => {
              // yes
              this.pointAlyLoading = true;
              let updatedAlys = this.pointAlys;
              this.pointAlyCanvas.edittedCanvasPointAlys.forEach(k=>{
                updatedAlys.forEach(u=>{
                  if (u.$key == k.pointAly.$key){
                    u.pos_pix_x = k.pointAly.pos_pix_x;
                    u.pos_pix_y = k.pointAly.pos_pix_y;
                  }
                });
              });
              // this.analysisService.updateAnalysisList(this.image.$key,
              //   this.pointAlyCanvas.edittedCanvasPointAlys.map(v => v.pointAly));

              this.analysisService.updateAnalysesListMongo(this.image.point_alys_id,
                updatedAlys
                , (ref) => {
                  this.pointAlyCanvas.clearCache();
                  this.onPointAlyEditted.emit(this.pointAlys);
                  this.pointAlyTabIndex = 0;
                  this.pointAlyLoading = false;
                  this.newPointAlys = [];
                  console.log(`update finish`);
                });
            },
            () => {
              // no
            }
          );

        }
        else {
          // alert('You must change at least one of points!');
          this.alertService.openAlert(`You must change at least one of points`, 'Edit Point Analysis');
        }
        break;
      case 3:
        if (this.pointAlyCanvas.removedCanvasPointAlys.length > 0) {


          this.confirmService.openConfirm(`Are you sure to remove these ${this.pointAlyCanvas.removedCanvasPointAlys.length} points?`, 'Remove Point Analysis',
            () => {
              // yes
              // upload
              this.pointAlyLoading = true;
              let updatedAlys = this.pointAlys;

              this.pointAlyCanvas.removedCanvasPointAlys.forEach(e =>{
                updatedAlys = updatedAlys.filter(f => f.$key !== e.pointAly.$key)
              });
              this.analysisService.updateAnalysesListMongo(this.image.point_alys_id,
                updatedAlys);
              // this.analysisService.deleteAnalysisList(this.image.$key,
              //   this.pointAlyCanvas.removedCanvasPointAlys.map(v => v.pointAly.$key));
              this.pointAlyCanvas.clearCache();
              this.onPointAlyDeleted.emit(this.pointAlys);
              this.pointAlyTabIndex = 0;
              this.pointAlyLoading = false;
              this.newPointAlys = [];
              console.log(`delete finish`);

            },
            () => {
              // no
            }
          );
        }
        else {
          // alert('You must delete one of points!');
          this.alertService.openAlert(`You must delete one of points!`, 'Remove Point Analysis');

        }
        break;
      default:
        break;

    }
  }

  onPointAlyRevert() {

  }

  discardPointAlyChangeRemove() {
    if (this.pointAlyRemove) {
      // this.onPointAlyToggleRemove();
      // if (this.pointAlyCanvas.removedCanvasPointAlys.length > 0 && confirm('Do you want to discard the removals you made?')) {
      // revert changes
      console.log('revert removal');
      this.pointAlyCanvas.revertRemove();
      this.pointAlyRemove = false;
      // }
      // else {
      // }
    }
  }

  discardPointAlyChangeEdit() {
    if (this.pointAlyEdit) {
      // discard change if any
      // cancel / confirm
      // if (this.pointAlyCanvas.edittedCanvasPointAlys.length > 0 && confirm('Do you want to discard the changes you made, you need to save them first?')) {
      // revert changes
      console.log('revert chagne');

      this.pointAlyEdit = false;
      this.pointAlyCanvas.setMode('');
      // }
      // else {
      // }

    }
  }

  discardPointAlyChangeCreate() {
    if (this.pointAlyCreate) {
      // if (this.pointAlyCanvas.createdPointAlys.length > 0 && confirm('Do you want to discard all points created without saving them?')) {

      this.pointAlyCreate = false;
      this.pointAlyCanvas.abortCreateMultiple();
      // }
      // else {

      // }
      // FIXME: clear the form also!
    }
  }

  onPointAlyTabIndexChange() {
    switch (this.pointAlyTabIndex) {
      case 0:
        this.discardPointAlyChangeCreate();
        this.discardPointAlyChangeEdit();
        this.discardPointAlyChangeRemove();
        this.pointAlyCanvas.setMode('');

        break;
      case 1:
        this.discardPointAlyChangeEdit();
        this.discardPointAlyChangeRemove();
        this.pointAlyCreate = true;
        this.pointAlyFileInput.nativeElement.value = '';
        // no create mode in canvas, the file event handle it
        this.difVisible = false;
        this.plagVisible = false;
        break;
      case 2:
        this.discardPointAlyChangeCreate();
        this.discardPointAlyChangeRemove();
        this.pointAlyCanvas.setMode('edit');

        this.difVisible = false;
        this.plagVisible = false;

        this.pointAlyEdit = true;
        break;
      case 3:
        this.discardPointAlyChangeCreate();
        this.discardPointAlyChangeEdit();

        this.difVisible = false;
        this.plagVisible = false;
        this.pointAlyCanvas.setMode('remove');
        this.pointAlyRemove = true;
      default:
        break;

    }
  }

  onClickDeleteAll(){
    this.confirmService.openConfirm(`Are you sure to remove all points and charts?`, 'Remove Point Analysis',
      () => {
        // yes
        // upload

        this.pointAlyLoading = true;
        this.analysisService.deleteAll(this.image.$key);
        this.chartService.deleteAll(this.image.$key);
        this.pointAlyLoading = false;
        console.log(`delete all finish`);

      },
      () => {
        // no
      }
    );

  }
  /** Point analysis control --------------------------------------------------------------------- */


  /** ----------------------------- Diffusion  -------------------------------------------------------------------- */
  initDifCanvas() {
    console.log(this.image);
    if (!this.image) {
      console.log('init dif canvas: image not found');
      return;
    }
    if (!!this.difCanvas) {
      // destroy point aly canvas
      this.difCanvas.clearCache();
      this.difCanvas.clearCanvas();
      this.difCanvas = null;
    }
    console.log(`Initialize dif canvas`);
    this.difCanvas = new DiffusionCanvas(`dif-canvas`, this.image.img_pix_w, this.image.img_pix_h);
    this.difCanvas.importCanvas(this.diffusions);
  }

  onDifCreate() {

  }

  // DIffusion controll
  onDifToggleEdit() {
    console.log();
  }

  onDifToggleRemove() {
    console.log();
  }

  onDifConfirm() {
    switch (this.difTabIndex) {
      case 0:
        break;
      case 1:
        if (this.newDiffusion.data_list.length > 0) {
          this.confirmService.openConfirm(`Are you sure to upload this traverse?`, 'Create traverse',
            () => {
              // yes
              // upload
              this.difLoading = true;
              /**
               * importCanvas is handle by automatic loading of firebase realtime database
               */
              console.log(this.newDiffusion);
			  //
              // this.diffusionService.createDiffusion(this.image.$key, this.newDiffusion, (ref) => {
              //   let file = new LinkFile({
              //     file: this.difFile,
              //     linkItem_id: this.sample.$key,
              //     linkItem_type: 'sample',
              //     file_comment: 'Traverse: ' + new Date(),
              //   });
                // this.fileUploadService.pushUpload(file, (ref) => {
				//
                //   this.difCanvas.clearCache();
                //   this.newDiffusion = new Diffusion({_id: `dif_${this.diffusions.length}`});
                //   this.difCanvas.newDiffusion = this.newDiffusion;
                //   this.difLoading = false;
                //   // this.onDifCreated.emit(this.diffusions);
                //   // this.newPointAlys = [];
                //   this.difTabIndex = 0;
                // });

              // })

              this.diffusionService.createDiffusionMongo(this.sample.$key, this.image.$key, this.newDiffusion, this.difFile.name)
                .then(()=>{
                  this.uploaderDiff.uploadAll();
                }).then(()=>{
                this.difCanvas.clearCache();
                this.newDiffusion = new Diffusion({_id: `dif_${this.diffusions.length}`});
                this.difCanvas.newDiffusion = this.newDiffusion;
                this.difLoading = false;
                this.difTabIndex = 0;
              })
            },
            () => {
              // no
            }
          );

        }
        else {
          // alert('You must select a valid excel for it!');
          this.alertService.openAlert('You must select a valid excel for it!', 'Create traverse');
        }
        break;
      case 2:

        if (this.difCanvas.edittedCanvasDifs.length > 0) {
          this.confirmService.openConfirm(`Are you sure to update these ${this.difCanvas.edittedCanvasDifs.length} traverses?`, 'Edit traverse',
            () => {
              // yes
              // upload
              this.difLoading = true;

              // this.diffusionService.updateInfoDiffusionList(this.image.$key,
              //   this.difCanvas.edittedCanvasDifs.map(v => v.dif));
              this.difCanvas.edittedCanvasDifs.forEach(edittedCanvasDifs=>{
                let updateDiffPosition = {};
                updateDiffPosition["$key"] = edittedCanvasDifs.dif.$key;
                updateDiffPosition["imgA_ratio_h"] = edittedCanvasDifs.dif.imgA_ratio_h;
                updateDiffPosition["imgA_ratio_w"] = edittedCanvasDifs.dif.imgA_ratio_w;
                updateDiffPosition["imgB_ratio_h"] = edittedCanvasDifs.dif.imgB_ratio_h;
                updateDiffPosition["imgB_ratio_w"] = edittedCanvasDifs.dif.imgB_ratio_w;

                this.diffusionService.updateDiffusionListMongo(updateDiffPosition["$key"],updateDiffPosition);
              });

              this.difLoading = false;
              // this.onDifEditted.emit(this.diffusions);
              this.difCanvas.clearCache();
              this.difTabIndex = 0;
            },
            () => {
              // no
            }
          );
        }
        else {
          // alert('You must change at least one of points!');
          this.alertService.openAlert('You must change at least one of points!', 'Edit traverse');

        }
        break;
      case 3:
        console.log(this.difCanvas.removedCanvasDifs);
        if (this.difCanvas.removedCanvasDifs.length > 0) {


          this.confirmService.openConfirm(`Are you sure to remove these ${this.difCanvas.removedCanvasDifs.length} traverses?`, 'Remove traverse',
            () => {
              // yes
              // upload
              this.difLoading = true;
              // setTimeout(() => {
              //
              // 	this.onDifDeleted.emit(this.diffusions);
              //
              // 	// this.pointAlys = this.pointAlys.concat(this.newPointAlys);
              // 	this.difCanvas.clearCache();
              // 	// this.pointAlyCanvas.importCanvas(this.pointAlys);
              //
              // 	this.difLoading = false;
              // 	this.difTabIndex = 0;
              // }, 1000);
              /**
               * Firebase serial deletion
               * */
              // this.diffusionService.deleteDiffusionList(this.image.$key,
              //   this.difCanvas.removedCanvasDifs.map(v => v.dif.$key));

              this.difCanvas.removedCanvasDifs.forEach(removedDif =>{
                this.diffusionService.deleteDiffusionListMongo(removedDif.dif.$key);
              });
              this.difCanvas.clearCache();
              // this.pointAlyCanvas.importCanvas(this.pointAlys);

              this.difLoading = false;
              this.difTabIndex = 0;
            },
            () => {
              // no
            }
          );
        }
        else {
          // alert('You must delete one of points!');
          this.alertService.openAlert('You must delete one of points!', 'Remove traverse');

        }
        break;
      default:
        break;

    }
  }

  discardDifChangeCreate() {
    if (this.difCreate) {
      this.difCreate = false;
      this.difCanvas.abortCreate();
      this.newDiffusion = new Diffusion({_id: `dif_${this.diffusions.length}`});
      this.difExcelReader.newDiffusion = this.newDiffusion;
    }
  }

  discardDifChangeEdit() {
    if (this.difEdit) {
      console.log('revert chagne');

      this.difEdit = false;
      this.difCanvas.setMode('');
    }
  }

  discardDifChangeRemove() {
    if (this.difRemove) {
      console.log('revert removal');
      this.difCanvas.revertRemoveCanvasDif();
      this.difRemove = false;
    }
  }

  onDifTabIndexChange() {
    switch (this.difTabIndex) {
      case 0:
        this.discardDifChangeCreate();
        this.discardDifChangeEdit();
        this.discardDifChangeRemove();
        this.difCanvas.setMode('');
        break;
      case 1:
        this.discardDifChangeEdit();
        this.discardDifChangeRemove();

        this.difFileInput.nativeElement.value = '';

        this.difCreate = true;
        // no create mode in canvas, the file event handle it

        // deactivate the rest
        this.pointAlyVisible = false;
        this.plagVisible = false;
        break;
      case 2:
        this.discardDifChangeCreate();
        this.discardDifChangeRemove();
        this.difCanvas.setMode('edit');

        this.difEdit = true;
        this.pointAlyVisible = false;
        this.plagVisible = false;

        break;
      case 3:
        this.discardDifChangeCreate();
        this.discardDifChangeEdit();
        this.difCanvas.setMode('remove');
        this.difRemove = true;

        this.pointAlyVisible = false;
        this.plagVisible = false;
      default:
        break;

    }
  }

  onDifFileChange($event) {
    // console.log($event);
    if ($event.target) {
      this.difFile = ($event.target.files.length > 0) ? $event.target.files[0] : null;
      this.difExcelReader.handleFile($event, (data) => {
        console.log(data);

        console.log(this.difCanvas);
        this.difCanvas.abortCreate();
        if (data) {
          this.difCanvas.newDiffusion = data;
          this.difCanvas.mode = 'create';
          // alert('Now select 2 points!');
          this.alertService.openAlert('Now select 2 points', 'Travese Upload');
          console.log(this.difCanvas);
          console.log(this.difCanvas.canvas);
        }
        else {
          // alert('No data avaliable');
          this.alertService.openAlert('No data available', 'Travese Upload');

        }
      })
    }
    else {
      this.difCanvas.abortCreate();
    }
  }

  //////////////////////////
  /** ----------------------------- Diffusion  -------------------------------------------------------------------- */


  /** ----------------------------- Plagioclase --------------------------------------- */
  initPlagCanvas() {
    if (!this.image) {
      console.log('plag: image not found');
      return;
    }
    if (!!this.plagCanvas) {
      this.plagCanvas.clearCanvas();
      this.plagCanvas = null;
    }
    this.plagCanvas = new PlagioclaseCanvas(`plag-canvas`, this.image.img_pix_w, this.image.img_pix_h);
    this.plagCanvas.importCanvas(this.image);
  }

  plotPlagioclase() {
    // console.log(this.plagioclaseLinearParams);
    // let keys = Object.keys(this.plagioclaseSet).map(v => Number(v)).sort((a: number,b: number) =>  a - b);
    // let labels = keys.map(v => this.inferenceAnnotation(v));
    // let data = keys.map(k => this.plagioclaseSet[k]);
    let plagPlotData = this.plagCanvas.retrievePlagPlotData(+this.plagCoeff, +this.plagBias);
    // this.plagioclaseChart.labels = JSON.parse(JSON.stringify(labels));
    this.plagioclaseChart.labels = plagPlotData.labels;
    this.plagioclaseChart.data = [{
      data: plagPlotData.data,
      label: 'Grey Scale'
    }];

    // this.plagioclaseChart.labels.sort();

    // console.log(this.plagioclaseChart.labels);
    // if (!this.plagioclaseChart['data'] || this.plagioclaseChart.data.length == 0) {
    // 	this.plagioclaseChart.data = [{
    // 		data: keys.map(k => this.plagioclaseSet[k]),
    // 		label: 'Grey Scale'
    // 	}];
    // }
  }

  resetPlag() {
    this.plagCanvas.reset();
    this.plagioclaseChart.labels = [];
    this.plagioclaseChart.data = [];
  }

  /**   ---------------------------------------------------------- */
  tabSelectChange($event) {
    switch (this.selectedTabIndex) {
      case 0:
        break;
      case 1:
        this.pointAlyVisible = true;
        break;
      case 2:
        this.difVisible = true;
        break;
      default:
        break;
    }
  }


  getCanvasWidth() {
    return this.image.img_pix_w;
  }

  getCanvasHeight() {
    return this.image.img_pix_h;
  }


}
