
import {CanvasModelAlready} from "./canvas-model-already";
import {ImgRel} from "../../models/img-rel";
import {Workspace} from "../../models/workspace";

declare var $: any;

interface MakeLinkImportReceiver {
  fromImgRel: ImgRel,
  toImgRel: ImgRel,
  workspace: Workspace,
  targetImgRel: ImgRel,

}

export class MakeLinkCanvasAlready extends CanvasModelAlready {

  onSet = false; // already set the place, if false, allow drag, disable confirming
  position = [0, 0, 0, 0, 0, 0, 0, 0]; // store in pixel, W1, H1, W2 H2, W3, H3, W4, H4 (topleft, topright, bottom left, bottom right)
  fromImgRel: ImgRel; // must be imported from import
  toImgRel: ImgRel;
  workspace: Workspace;

  parentImage: any;
  childImage: any;
  targetImgrel: ImgRel;
  constructor(canvasId: string, width: number, height: number) {
    super(canvasId, width, height);
  }


  importCanvas(objs: MakeLinkImportReceiver): any {
    super.importCanvas(objs);
    this.fromImgRel = objs.fromImgRel;
    this.toImgRel = objs.toImgRel;
    this.workspace = objs.workspace;
    this.targetImgrel = objs.targetImgRel;

    // let the hold parent image as background

    this.parentImage = this.createImgThumbnail(`makelink-from-image`, {
      top: 0, left: 0,

      selectable: false,
    }, (imgObj) => {

    }, (imgObj) => {

    }, (imgObj) => {

    });

    this.childImage = this.createImgThumbnail(`makelink-to-image`, {
      top: this.targetImgrel.link_pos[1], left: this.targetImgrel.link_pos[0],

      selectable: false,
    }, (imgObj) => {

    }, (imgObj) => {

    }, (imgObj) => {

    });

    var width = this.targetImgrel.link_pos[6] - this.targetImgrel.link_pos[0];
    var height = this.targetImgrel.link_pos[7] - this.targetImgrel.link_pos[1];
    this.childImage.set({
      scaleX: width / this.childImage.width,
      scaleY: height / this.childImage.height,
    });
    this.canvas.setBackgroundColor('rgba(0,0,0,0.5)');
    this.parentImage.set({opacity: 0.5});
    this.onSet = true;

    this.canvas.setWidth(this.parentImage.width);
    this.canvas.setHeight(this.parentImage.height);
    this.canvas.renderAll();
  }

  // createCanvas(): any {
  //   super.createCanvas();
  //
  //   this.canvas.set({
  //     backgroundColor: 'rgba(0,0,0,0)',
  //   });
  //   console.log("make link canvas created");
  //
  //
  //
  //
  //
  //
  //   this.position[0]= this.position[4] =58;
  //   this.position[1] = this.position[3] = 60;
  //   this.position[6] = this.position[2]= 171;
  //   this.position[7] = this.position[5]= 139;
  //   // this.targetImgrel.link_pos = this.position;
  //
  //
  //
  //
  //
  //
  //   var width = this.position[6] - this.position[0];
  //   var height = this.position[7] - this.position[1];
  //
  //
  //   // make the image
  //   // FIXME: since the return image thumbnail is not here, so cannot retrieve it and set scaleX, scaleY
  //   this.childImage = this.createImgThumbnail(`makelink-to-image`, {
  //     left: this.position[0],
  //     top: this.position[1],
  //
  //     lockMovementX: false, lockMovementY: false,
  //     lockScalingX: false, lockScalingY: false,
  //           // selectable: true,
  //           // scaleY: 0,
  //   }, (imgObj) => {
  //     // modified
  //     this.onChildImageModified(imgObj)
  //   }, (imgObj) => {
  //     // moving
  //   }, (imgObj) => {
  //     // select
  //   });
  //
  //   this.childImage.set({
  //     scaleX: width / this.childImage.width,
  //     scaleY: height / this.childImage.height,
  //   });
  //   // this.canvas.setBackgroundColor('rgba(0,0,0,0.5)');
  //   // this.parentImage.set({opacity: 0.5});
  //   this.onSet = true;
  //
  //   this.canvas.renderAll();
  //
  // }


  onChildImageModified(imgObj: any) {

    this.position[0] = imgObj.left;
    this.position[1] = imgObj.top;
    // top-right
    this.position[2] = imgObj.left + imgObj.width;
    this.position[3] = imgObj.top;
    // bottom-left
    this.position[4] = imgObj.left;
    this.position[5] = imgObj.top + imgObj.height;
    // bottom-right
    this.position[6] = imgObj.left + imgObj.width;
    this.position[7] = imgObj.top + imgObj.height;


    console.log('Position change');
    console.log(this.position);
  }


  clearCanvas(): any {
    super.clearCanvas();
    this.position = [0, 0, 0, 0, 0, 0 ,0 ,0];
    // FIXME: notify user....
  }


  confirm(): ImgRel {
    if (!this.invalidatePosition()) {

      this.targetImgrel.link_pos = this.position;
      return this.targetImgrel;
    }
    else {
      return null;
    }
  }

  invalidatePosition() {
    if (this.position[0] == 0 && this.position[1] == 0) {
      return 'top-left yet to set, 0 - 0';
    }
    if (this.position[0] == this.position[2]){
      return 'width must > 0'
    }
    if (this.position[1] == this.position[5]){
      return 'height must > 0'
    }

    return '';
  }

  reset() {
    this.position = [0, 0, 0, 0, 0, 0, 0, 0]; // store in pixel, W1, H1, W2 H2, W3, H3, W4, H4 (topleft, topright, bottom left, bottom right)
    // this.onShow = false;
    this.onSet = false; // already set the place, if false, allow drag, disable confirming
    // this.imgaly = {};
    if (this.childImage) {
      this.canvas.remove(this.childImage);
      this.childImage = null;
    }
    // this.clearCanvas();
  }
}
