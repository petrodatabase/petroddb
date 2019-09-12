import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as firebase from "firebase";
import {LinkFile} from "../../../../models/link-file";
import {ConfirmService} from "../../../../components/confirm-dialog/confirm.service";
import {FileUploadService} from "../../../../services/file-upload.service";
import {Sample} from "../../../../models/sample";
import {ImageModel} from "../../../../models/image-model";
import {BaseModel} from "../../../../models/base-model";
import {LinkFileService} from "../../../../services/database-services/link-file.service";
import {Globals} from '../../../../globals';
import {FileUploader, FileUploaderOptions} from 'ng2-file-upload/ng2-file-upload';

// const URL = 'http://localhost:4000/uploads/files';

@Component({
  selector: 'app-attach-metada',
  templateUrl: './attach-metada.component.html',
  styleUrls: ['./attach-metada.component.css']
})
export class AttachMetadaComponent implements OnInit {
  globals: Globals;
  URL : string;

  @Input()
  fileList: LinkFile[];

  @Input()
  image: ImageModel;

  @Output()
  onFileUploaded = new EventEmitter<string>();

  currentUploadFile: LinkFile;

  selectedFile: FileList;
  isSelectedFile: boolean = false;
  constructor(
    private confirmService: ConfirmService,
    private fileUploadService: FileUploadService,
    private linkFileService: LinkFileService,
  ) {
    this.globals = new Globals();
    this.URL = this.globals.serverHost +'/uploads/files'
  }

  public uploader:FileUploader = new FileUploader({url: 'http://localhost:4000/uploads/files', itemAlias: 'file'});
  // public uploader:FileUploader = new FileUploader({url: 'https://petro.wovodat.org:4000/uploads/files', itemAlias: 'file'});

  ngOnInit() {
    this.uploader.onBeforeUploadItem = (file ) => {
      var uo: FileUploaderOptions = {};
      uo.headers = [
        { name: 'sp-id', value : this.image.sp_id},
        { name: 'img-id', value: this.image.$key}] ;
      this.uploader.setOptions(uo);
    };
    this.uploader.onAfterAddingFile = (file)=> { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
      console.log("FileUpload:uploaded:", item, status, response);
    };
    this.getMetadataList();
  }



  detectMetadata($event) {
    if (!$event.target) return;
    this.selectedFile = $event.target.files;
  }

  uploadMetadata() {
    let file = this.selectedFile.item(0);
    // this.currentUploadFile = new LinkFile({
    //   file: file,
    //   img_id: this.image.$key,
    // });
	//
    // this.fileUploadService.pushUpload(this.currentUploadFile, (ref: firebase.database.ThenableReference) => {
    // });
    this.uploader.uploadAll();
    this.currentUploadFile = new LinkFile({
      sp_id: this.image.sp_id,
      img_id: this.image.$key,
      stored_file_name: file.name
    });
    this.linkFileService.createLinkFileMongo(this.currentUploadFile, ()=>{
      // clear input
      document.getElementById('metadata-upload')["value"] = null;

    });
  }

  getMetadataList(){
    // this.linkFileService.getLinkFilesList({
    //   orderByChild: 'img_id',
    //   equalTo: this.image.$key,
    // }).subscribe(
    //   (metadata: LinkFile[]) => {
    //     this.image.metadata = metadata.map(v => BaseModel.toObject(v, LinkFile) );
    //   }
    // );
    this.linkFileService.getLinkFilesListMongo({
      img_id: [this.image.$key]
    }).subscribe(
      (metadata: LinkFile[]) => {
        this.image.metadata = metadata.map(v => BaseModel.toObject(v, LinkFile) );
      }
    );
  }

  deleteMetadata(metadata: LinkFile) {
    this.confirmService.openConfirm(`Are you sure to delete ${metadata.file_name}? No recovery will be possible!`, 'Delete File',
      () => {
        // yes
        // this.fileUploadService.deleteFile(metadata);
        this.linkFileService.deleteLinkFilesMongo(metadata.sp_id,metadata.img_id,metadata.stored_file_name,metadata.$key);
        this.linkFileService.getLinkFilesListMongo({
          sp_id: [metadata.sp_id]
        }).subscribe(
          (linkf_files: LinkFile[]) => {
            console.log(linkf_files);
          }
        );
      }
    );
  }

}
