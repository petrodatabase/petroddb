import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LinkFile} from "../../../models/link-file";
import {FileUploadService} from "../../../services/file-upload.service";
import {Sample} from "../../../models/sample";

import * as firebase from 'firebase';
import {SampleService} from "../../../services/database-services/sample.service";
import {sample} from "rxjs/operator/sample";
import {BaseModel} from "../../../models/base-model";
import {ConfirmService} from "../../../components/confirm-dialog/confirm.service";
import {FileUploader, FileUploaderOptions} from 'ng2-file-upload/ng2-file-upload';
import {LinkFileService} from '../../../services/database-services/link-file.service';
import {Globals} from '../../../globals';

// const URL = 'http://localhost:4000/uploads/files';

@Component({
	selector: 'app-sample-file-list',
	templateUrl: './sample-file-list.component.html',
	styleUrls: ['./sample-file-list.component.css']
})
export class SampleFileListComponent implements OnInit {
  globals: Globals;
  URL: string;

	@Input()
	fileList: LinkFile[];

	@Input()
	sample: Sample;

	@Output()
	onFileUploaded = new EventEmitter<string>();

	isUploading: boolean = false;
	uploadingProgress: number = 0;
	currentUploadFile: LinkFile;

	selectedFile: FileList;
	isSelectedFile: boolean = false;

	constructor(
		private confirmService: ConfirmService,
		private fileUploadService: FileUploadService,
		private sampleService: SampleService,
    private linkFileService: LinkFileService
	) {
    this.globals = new Globals();
    this.URL = this.globals.serverHost +'uploads/files';
	}

  public uploader:FileUploader = new FileUploader({url: 'http://localhost:4000/uploads/files', itemAlias: 'file'});
  // public uploader:FileUploader = new FileUploader({url: 'https://petro.wovodat.org:4000/uploads/files', itemAlias: 'file'});

  ngOnInit() {
    this.uploader.onBeforeUploadItem = (file ) => {
      var uo: FileUploaderOptions = {};
      uo.headers = [
        { name: 'sp-id', value : this.sample.$key }] ;
      this.uploader.setOptions(uo);
    };
    this.uploader.onAfterAddingFile = (file)=> { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
      console.log("FileUpload:uploaded:", item, status, response);
    };
	}

	detectFile($event) {
	  if (!$event.target) return;
		this.selectedFile = $event.target.files;
	}

	upload() {
		// let file = this.selectedFile.item(0);
		// this.currentUploadFile = new LinkFile({
		// 	file: file,
		// 	linkItem_id: this.sample.$key,
		// 	linkItem_type: 'sample',
		// 	file_comment: 'test comment',
		// });
		//
		// this.fileUploadService.pushUpload(this.currentUploadFile, (ref: firebase.database.ThenableReference) => {
		// });
    this.isUploading=true;
    this.uploader.uploadAll();
    this.currentUploadFile = new LinkFile({
    	sp_id: this.sample.$key,
      stored_file_name: this.selectedFile[0].name
    });
    this.linkFileService.createLinkFileMongo(this.currentUploadFile, ()=>{
      this.isUploading=false;
      // clear input
      document.getElementById('sample-file-upload')["value"] = null;
    });
	}

	deleteFile(file: LinkFile) {
		console.log(file);
		this.confirmService.openConfirm(`Are you sure to delete ${file.file_name}? No recovery will be possible!`, 'Delete File',
			() => {
				// yes
				this.fileUploadService.deleteFile(file);
			}
		);
	}
}
