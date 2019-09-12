import {Component, OnInit, Inject, AfterViewInit, OnDestroy} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from "@angular/material";
import {ImgRel} from "../../../models/img-rel";
import {Workspace} from "../../../models/workspace";
import {MakeLinkCanvasAlready} from "../../fabric-classes/make-link-canvas-already";

interface LinkSet
{
  workspace: Workspace,
  from: ImgRel,
  to: ImgRel,
  target: ImgRel
}

@Component({
  selector: 'app-makelink-dialog-already',
  templateUrl: './makelink-dialog-already.component.html',
  styleUrls: ['./makelink-dialog.component.css']
})
export class MakelinkDialogAlreadyComponent implements OnInit, AfterViewInit, OnDestroy {

  targetImgRel: ImgRel;
  workspace: Workspace;
  fromImgRel: ImgRel;
  toImgRel: ImgRel;

  makeLinkCanvas: MakeLinkCanvasAlready;
  canvasId: string =  `makelink-canvas`;
  fromImgId: string = `makelink-from-image`;
  toImgId: string = `makelink-to-image`;

  initialWidth: number = 500;
  initialHeight: number = 500;
  maxWidth: number = 1000;
  maxHeight: number = 500;
  containerScroll: any;

  constructor(public dialogRef: MdDialogRef<MakelinkDialogAlreadyComponent>,
              @Inject(MD_DIALOG_DATA) public data: LinkSet,) {
    console.log(data);
    this.workspace = data.workspace;
    this.fromImgRel = data.from;
    this.toImgRel = data.to;
    this.targetImgRel = data.target;
    this.containerScroll = {top: 0, left: 0};
  }

  initLink(top: number, left: number ){

  }

  ngOnInit() {
    this.ngOnInitMakeLinkCanvas();
  }

  ngOnDestroy() {
    this.makeLinkCanvas.clearCanvas();
    this.makeLinkCanvas = null;
  }

  ngAfterViewInit() {
    let _thisDialog = this;
    setTimeout(function () {
      _thisDialog.makeLinkCanvas.importCanvas({
        fromImgRel: _thisDialog.fromImgRel,
        toImgRel: _thisDialog.toImgRel,
        workspace: _thisDialog.workspace,
        targetImgRel: _thisDialog.targetImgRel,
      });

    }, 500);
  }

  ngOnInitMakeLinkCanvas() {
    this.makeLinkCanvas = new MakeLinkCanvasAlready(this.canvasId, this.initialWidth, this.initialHeight);

  }

  updateContainerScroll($event) {
    console.log('scroll')
    console.log($event.srcElement.scrollLeft);
    console.log($event.srcElement.scrollTop);
    this.containerScroll.left = $event.srcElement.scrollLeft;
    this.containerScroll.top = $event.srcElement.scrollTop;
  }

  reset() {
    this.makeLinkCanvas.reset();
  }

  onCloseConfirm() {
    this.targetImgRel = this.makeLinkCanvas.confirm();
    console.log(this.targetImgRel);
    this.dialogRef.close(this.targetImgRel);
  }

  onCloseCancel() {
    this.dialogRef.close(null);
  }

  getCanvasHeight() {
    try {
      let canvasHeight = this.makeLinkCanvas.getRealCanvasHeight();
      return (canvasHeight <= this.maxHeight) ? canvasHeight : this.maxHeight ;
    }
    catch (exp) {
      return this.initialHeight;
    }
  }

  getCanvasWidth() {
    try {
      let canvasWidth =  this.makeLinkCanvas.getRealCanvasWidth();
      return (canvasWidth <= this.maxWidth) ? canvasWidth : this.maxWidth;
    }
    catch (exp) {
      return this.initialWidth;
    }
  }


}
