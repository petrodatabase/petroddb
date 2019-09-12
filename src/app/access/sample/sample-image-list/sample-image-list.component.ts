import {Component, Input, OnInit} from '@angular/core';
import {ImageModel} from "../../../models/image-model";
import {environment} from "../../../../environments/environment";
import {MdDialog} from "@angular/material";
import {ImageDialogComponent} from "./image-dialog/image-dialog.component";
import {Sample} from "../../../models/sample";
import {LinkFile} from "../../../models/link-file";
import { Globals} from '../../../globals';

import * as firebase from 'firebase';
import {SampleService} from "../../../services/database-services/sample.service";
import {sample} from "rxjs/operator/sample";
import {BaseModel} from "../../../models/base-model";
import {ConfirmService} from "../../../components/confirm-dialog/confirm.service";
import {FileUploadService} from "../../../services/file-upload.service";
import {LinkFileService} from "../../../services/database-services/link-file.service";
import {AnalysisService} from "../../../services/database-services/analysis.service";
import {ChartService} from "../../../services/database-services/chart.service";
import {DiffusionService} from "../../../services/database-services/diffusion.service";

@Component({
	selector: 'app-sample-image-list',
	templateUrl: './sample-image-list.component.html',
	styleUrls: ['./sample-image-list.component.css']
})
export class SampleImageListComponent implements OnInit {

	@Input()
	imgList: ImageModel[];

	@Input()
	authenticated: boolean;

	globals : Globals ;
	constructor(
    // private globals: Globals,
	  private confirmService: ConfirmService,
		private fileUploadService: FileUploadService,
		private linkFileService: LinkFileService,
		private analysisService: AnalysisService,
		private chartService: ChartService,
		private diffusionService: DiffusionService,
		private mdDialog: MdDialog,
	) {
	  this.globals = new Globals();
	}

	ngOnInit() {
	}

	openImage(img: ImageModel) {
		let config = environment.defaultDialogConfig;
		config.data = {
			img: img,
			authenticated: this.authenticated
		};
		let dialogRef = this.mdDialog.open(ImageDialogComponent, config);
		dialogRef.afterClosed().subscribe((result) => {
		});
	}

	deleteThisImage(img: ImageModel){
    this.confirmService.openConfirm(`Are you sure to delete ${img.img_name}? No recovery will be possible!`, 'Delete File',
      () => {
        // yes

        //Find metadata and delete first
        this.linkFileService.getLinkFilesList({
          orderByChild: 'img_id',
          equalTo: img.$key,
        }).subscribe(
          (metadata: LinkFile[]) => {
            img.metadata = metadata.map(v => BaseModel.toObject(v, LinkFile) );
          }
        );
        var i=0;
        for (i=0;i<img.metadata.length;i++){
          this.fileUploadService.deleteFile(img.metadata[i]);
        }
        // Delete analysis point,traverse points and charts
        this.analysisService.deleteAll(img.$key);
        this.chartService.deleteAll(img.$key);
        this.diffusionService.deleteAll(img.$key);
        //Delete image
        this.fileUploadService.imageDeleteFile(img);
      }
    );
  }
  deleteOneImageWOAsking(img: ImageModel){
    // yes

    //Find metadata and delete first
    this.linkFileService.getLinkFilesList({
      orderByChild: 'img_id',
      equalTo: img.$key,
    }).subscribe(
      (metadata: LinkFile[]) => {
        img.metadata = metadata.map(v => BaseModel.toObject(v, LinkFile) );
      }
    );
    var i=0;
    for (i=0;i<img.metadata.length;i++){
      this.fileUploadService.deleteFile(img.metadata[i]);
    }
    // Delete analysis point and charts
    this.analysisService.deleteAll(img.$key);
    this.chartService.deleteAll(img.$key);
    //Delete image
    this.fileUploadService.imageDeleteFile(img);
  }


  deleteAllImage(imgList: ImageModel[]){
    this.confirmService.openConfirm(`Are you sure to delete all images? No recovery will be possible!`, 'Delete File',
      () => {
      for(var i =0; i<imgList.length;i++){
        this.deleteOneImageWOAsking(imgList[i]);
      }
    });
	}
}
