import {Component, Inject, OnInit} from '@angular/core';
import {MdDialogRef, MD_DIALOG_DATA} from "@angular/material";
import {ImageModel} from "../../../../models/image-model";
import {SampleFileListComponent} from "../../sample-file-list/sample-file-list.component";
import {Globals} from '../../../../globals';

@Component({
  selector: 'app-image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.css']
})
export class ImageDialogComponent implements OnInit {
  globals: Globals;
  img: ImageModel;
  authenticated: boolean;
  constructor(
    public dialogRef: MdDialogRef<ImageDialogComponent>,
    @Inject(MD_DIALOG_DATA) public data: any,
  ) {
    this.img = data.img;
    this.authenticated = data.authenticated;
    this.globals = new Globals();

  }

  ngOnInit() {
  }

  onCloseCancel() {
    this.dialogRef.close();
  }

}
