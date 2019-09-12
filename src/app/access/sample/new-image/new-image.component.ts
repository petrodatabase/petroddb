import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ImageModel} from "../../../models/image-model";
import {Sample} from "../../../models/sample";
import {MdExpansionPanel} from "@angular/material";
import {ImageModelService} from "../../../services/database-services/image-model.service";
import {SampleService} from "../../../services/database-services/sample.service";
import {FileUploadService} from "../../../services/file-upload.service";
import {ConfirmService} from "../../../components/confirm-dialog/confirm.service";
import {AlertService} from "../../../components/alert-dialog/alert.service";
import {LinkFile} from "../../../models/link-file";
import * as firebase from "firebase";
import {FileUploader, FileUploaderOptions} from 'ng2-file-upload/ng2-file-upload';
import { Globals} from '../../../globals';

// const URL = 'http://localhost:4000/uploads/images';

@Component({
  selector: 'app-new-image',
  templateUrl: './new-image.component.html',
  styleUrls: ['./new-image.component.css']
})

export class NewImageComponent implements OnInit {
  schema = ImageModel.schema;
  newImage: ImageModel;
  globals: Globals;
  URL: string;
  allowedWidth: number = 1500;
  allowedHeight: number = 1500;
  allowedPixels: number = 2000000; // 2 Megapixels
  allowedExtension: string[] = ['png', 'jpg', 'gif'];
  allowedByteSize: number = 10 * 2 ** 20;


  // @ViewChild('imageFile')
  // file: any;

  @ViewChild(MdExpansionPanel)
  mdExpansionPanel: any;

  panelExtended: boolean = false;

  loading: boolean = false;

  _sample: Sample;
  @Input()
  set sample(sp: Sample) {
    this._sample = sp;
    this.initNewImage();
  }


  initNewImage() {
    this.newImage = new ImageModel({
      vd_id: this._sample.vd.$key,
      ed_id: this._sample.ed.$key,
      sp_id: this._sample.$key,
      img_cat_other: null
    });

  }

  constructor(private sampleService: SampleService,
              private imageService: ImageModelService,
              private fileUploadService: FileUploadService,
              private confirmService: ConfirmService,
              private alertService: AlertService,) {
    this.newImage = new ImageModel({});
    this.globals = new Globals();
    this.URL = this.globals.serverHost + '/uploads/images';

  }

  public uploader:FileUploader = new FileUploader({url: 'http://localhost:4000/uploads/images', itemAlias: 'photo'});
  // public uploader:FileUploader = new FileUploader({url: 'https://petro.wovodat.org:4000/uploads/images', itemAlias: 'photo'});

  ngOnInit() {
    this.uploader.onAfterAddingFile = (file)=> { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
      console.log("ImageUpload:uploaded:", item, status, response);
    };
  }

  setHeaderForImageUpload(img_id = null){
    this.uploader.onBeforeUploadItem = (file ) => {
      var uo: FileUploaderOptions = {};
      uo.headers = [
        { name: 'sp-id', value : this._sample.$key },
        { name: 'img-id', value : img_id }] ;
      this.uploader.setOptions(uo);
    };
  }
  onFileChange($event) {
    if ($event.target) {
      let file = $event.target.files[0];
      this.newImage.stored_file_name = file.name;
      if (this.validateFile(file)) {
        this.attachImageSize(this.newImage, file);
        console.log('File attached');
        console.log(this.newImage);
      }
      else {
        this.newImage.file = null;
      }
    }
    else {
      this.newImage.file = null;
    }
  }

  attachImageSize(image: ImageModel, file: File): any {
    let img = new Image();
    img.onload = () => {
      if (this.validateImageSize(img.width, img.height)) {
        image.file = file;
        image.img_pix_w = img.width;
        image.img_pix_h = img.height;
        console.log(image);
      }
      // else {
      //   this.file.nativeElement.value = '';
      // }
    };
    // img.src = (window.URL || window.webkitURL).createObjectURL(file);
    img.src = (window.URL || window['webkitURL']).createObjectURL(file);
  }

  validateFile(file: File): boolean {
    // let name = file.name;
    // let extension = file.name.split(".").pop().toLowerCase();
    // if (file.size > this.allowedByteSize) {
    //   this.alertService.openAlert(`File exceed maximum allowed of ${this.allowedByteSize / 1024 / 1024} Mb`, 'Upload Image');
    //   this.file.nativeElement.value = '';
    //   return false;
    // }
    // if (!this.allowedExtension.includes(extension)) {
    //   this.alertService.openAlert(`File extension must be one of ${this.allowedExtension}`, 'Upload Image');
    //   this.file.nativeElement.value = '';
    //   return false;
    // }
    // return true;

    // Note : Hack
    return true;
  }

  validateImageSize(width: number, height: number): boolean {
    // if (width > this.allowedWidth) {
    //   this.alertService.openAlert(`Image width of ${width} pixels larger the allowed`)
    // }
    // console.log(width * height);
    // console.log(width * height > this.allowedPixels);
    // if (width * height > this.allowedPixels) {
    //   console.log(width * height > this.allowedPixels);
    //   this.alertService.openAlert(`Image of size ${width}x${height} = ${width * height / 1000000}
    //    MegaPixels exceed allowed limit of ${this.allowedPixels / 1000000} MegaPixels. This will cause application performance reduction.<br>
    //    Please resize the image to lower resolution on <a href="http://www.picresize.com/">picresize</a><br>
    //    You may want to upload the original image as file instead.`, `Image exceed size limit`);
    //   return false;
    // }
    // else {
    //   return true;
    // }

    // NOTE : HACK
    return true;
  }

  validateInput(): boolean {
    if (this.newImage.img_name == '') {
      this.alertService.openAlert('Image Name must not be empty', 'Upload Image');
      return false;
    }
    return true;
  }

  clearForm() {
    this.initNewImage();
    // this.file.nativeElement.value = '';
    this.mdExpansionPanel.toggle();
  }

  uploadImage() {
    if(this.newImage.img_cat_other){
      this.newImage.img_cat = this.newImage.img_cat_other;
    }

    if(this.newImage.img_instr_other){
      this.newImage.img_instr = this.newImage.img_instr_other;
    }

    if (this.imageService.validateInput(this.newImage)) {
      this.confirmService.openConfirm(`Are you sure to upload this image?`, 'Upload Image',
        () => {
          // yes
          this.loading = true;
          this.newImage.createdAt = this.getCurrentTimeStamp();
          this.fileUploadService.imagePushUpload(this.newImage, (ref) => {
            // do something on image confirm !
            this.loading = false;
            this.clearForm();
          });
        },
        () => {
        },
      );
    }
  }

  uploadImageNg2(){
    if(this.newImage.img_cat_other){
      this.newImage.img_cat = this.newImage.img_cat_other;
    }

    if(this.newImage.img_instr_other){
      this.newImage.img_instr = this.newImage.img_instr_other;
    }

    if (this.imageService.validateInput(this.newImage)) {
      this.confirmService.openConfirm(`Are you sure to upload this image?`, 'Upload Image',
        () => {
          // yes
          this.loading = true;
          this.newImage.createdAt = this.getCurrentTimeStamp();
          this.fileUploadService.imageSaveDataMongo(this.newImage, (ref) => {
          }).then((resolve) => {
            console.log("reach", resolve);
            this.setHeaderForImageUpload(resolve);
            this.uploader.uploadAll();
          }).then(()=>{
            this.loading = false;
            this.clearForm();
          });
        },
        () => {
        },
      );
    }
  }

  getCurrentTimeStamp(): string {
    let date = new Date();
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  }






}
