import {CanvasModel, ContainerScroll} from "./canvas-model";
import {ImageModel} from "../../models/image-model";
import {Observable} from "rxjs/Observable";

declare var $: any;
declare var fabric: any;

declare var SimpleImage: any;

export interface PlagPlotData {
  labels: number[],
  data: any[],
}

/**
 * Plagioclase Canvas implement the same way MakeLinkCanvas did to get the 4 points regions
 * It get another input is the image, get the image data from URL and store the 2D grayscale data
 * calculation of greyscale moved to here
 */
export class PlagioclaseCanvas extends CanvasModel {
  onSet = false; // already set the place, if false, allow drag, disable confirming
  position = [0, 0, 0, 0, 0, 0, 0, 0]; // store in pixel, W1, H1, W2 H2, W3, H3, W4, H4 (topleft, topright, bottom left, bottom right)
  img: ImageModel;
  containerScroll: ContainerScroll = {top: 0, left: 0};

  rectangleMap: any;

  constructor(canvasId: string, width: number, height: number) {
    super(canvasId, width, height);
  }

  importCanvas(img: ImageModel): any {
    super.importCanvas(img);
    this.img = img;
    // this.calculateAllGreyScale();
    this.loadImageSrc();

    this.canvas.renderAll();
  }

  getMouseTopLeftPos(options): any | { top; left } {
    // return super.getMouseTopLeftPos(options);
    // let left = options.e.clientX - this.canvas._offset.left ;
    // var top = options.e.clientY - _thisCanvas.canvas._offset.top + $("div.imgLink-img").scrollTop();
    // let top = options.e.clientY - this.canvas._offset.top ;
    // let scrollTop = $(this.canvasId).viewportOffset.top;
    // let scrollLeft = $(this.canvasId).viewportOffset.left;
    let bound = document.getElementById(this.canvasId).getBoundingClientRect();
    // let scrollTop = $(`div#point-aly-wrapper canvas`).viewportOffset.top;
    // let scrollLeft = $(`div#point-aly-wrapper canvas`).viewportOffset.left;
    let scrollTop = bound.top;
    let scrollLeft = bound.left;

    let left = options.e.clientX - scrollLeft;
    let top = options.e.clientY - scrollTop;

    console.log(`mouse: ${options.e.clientX} - ${options.e.clientX}`);
    console.log(`canvas offset: ${this.canvas._offset.left} - this.canvas._offset.top`);
    console.log(`scroll: ${scrollLeft} - ${scrollTop}`);
    console.log(`pos: ${left} - ${top}`);

    // handle scrolling
    left += this.containerScroll.left;
    top += this.containerScroll.top;

    left /= this.currentZoomRatio;
    top /= this.currentZoomRatio;

    return {
      left: left,
      top: top,
    }
  }

  createCanvas(): any {
    super.createCanvas();
    // let _this = this;
    // this.canvas.set({
    // 	backgroundColor: 'rgba(0,0,0,0)',
    // });
    // this.canvas.setWidth($scope.imgMakeLink.img1.img_pix_w);
    // this.canvas.setHeight($scope.imgMakeLink.img1.img_pix_h);
    console.log("make link canvas created");

    this.setCanvasMouseDown((options) => {
      // console.log("make link mousedown: " + options.e.clientX + " - " + options.e.clientY);
      // console.log("canvas offset: " + $scope.imgMakeLink.canvasManip.canvas._offset.left + " - " + $scope.imgMakeLink.canvasManip.canvas._offset.top);
      // console.log("window scroll: " + $("div.imgLink-img").scrollLeft() + " - " + $("div.imgLink-img").scrollTop());
      //
      // var left = options.e.clientX - $scope.imgMakeLink.canvasManip.canvas._offset.left + $("div.imgLink-img").scrollLeft();
      // var top = options.e.clientY - $scope.imgMakeLink.canvasManip.canvas._offset.top + $("div.imgLink-img").scrollTop();
      //
      // left /= $scope.imgMakeLink.currentZoomRatio;
      // top /= $scope.imgMakeLink.currentZoomRatio;
      // // if onset false: set the first topleft coord
      // if (!$scope.imgMakeLink.onSet) {
      // 	console.log("Making link: top-left create: " + top + " " + left);
      // 	$scope.imgMakeLink.position[0] = left;
      // 	$scope.imgMakeLink.position[1] = top;
      // }

      console.log("plagioclase mousedown: " + options.e.clientX + " - " + options.e.clientY);
      console.log("canvas offset: " + this.canvas._offset.left + " - " + this.canvas._offset.top);
      // console.log("window scroll: " + $("div.imgLink-img").scrollLeft() + " - " + $("div.imgLink-img").scrollTop());

      // var left = options.e.clientX - this.canvas._offset.left + $("div.imgLink-img").scrollLeft();
      var left = options.e.clientX - this.canvas._offset.left;
      // var top = options.e.clientY - this.canvas._offset.top + $("div.imgLink-img").scrollTop();
      var top = options.e.clientY - this.canvas._offset.top;

      left /= this.currentZoomRatio;
      top /= this.currentZoomRatio;

      let pos = this.getMouseTopLeftPos(options);
      left = pos.left;
      top = pos.top;
      // if onset false: set the first topleft coord
      if (!this.onSet) {
        console.log("Making link: top-left create: " + top + " " + left);
        this.position[0] = left;
        this.position[1] = top;
      }
    });

    this.setCanvasMouseUp((options) => {
      console.log("plagioclase mouse up: " + options.e.clientX + " - " + options.e.clientY);
      console.log("canvas offset: " + this.canvas._offset.left + " - " + this.canvas._offset.top);
      // console.log("window scroll: " + $("div.imgLink-img").scrollLeft() + " - " + $("div.imgLink-img").scrollTop());

      // MUST be deprecated
      // var left = options.e.clientX - this.canvas._offset.left + $("div.imgLink-img").scrollLeft();
      var left = options.e.clientX - this.canvas._offset.left;
      // var top = options.e.clientY - this.canvas._offset.top + $("div.imgLink-img").scrollTop();
      var top = options.e.clientY - this.canvas._offset.top;
      left /= this.currentZoomRatio;
      top /= this.currentZoomRatio;

      let pos = this.getMouseTopLeftPos(options);
      left = pos.left;
      top = pos.top;
      console.log(pos);

      if (!this.onSet) {
        console.log("Making link: bottom-right: " + top + " " + left);

        if (this.position[0] == 0 && this.position[1] == 0) {
          console.log("ERROR: top-left yet to set, 0 - 0");
        }
        else {
          // the rest of the position
          this.position[6] = left;
          this.position[7] = top;

          this.position[2] = left;
          this.position[3] = this.position[1];
          this.position[4] = this.position[0];
          this.position[5] = top;

          var width = this.position[6] - this.position[0];
          var height = this.position[7] - this.position[1];
          if (width < 0 || height < 0) {
            console.log("CANNOT drag backward!");
            alert("You must drag from top-left to bottom-right!!");
            this.position = [0, 0, 0, 0, 0, 0, 0, 0];
            return;
          }

          // make the image
          // FIXME: since the return image thumbnail is not here, so cannot retrieve it and set scaleX, scaleY
          this.rectangleMap = this.createRectangle(this.position, 'blue', {
            // left: this.position[0],
            // top: this.position[1],
            // lockRotation: true,
            // lockScalingFlip: true,
            // scaleX: width / fabricImg.getWidth(),
            // scaleX: 0,
            // scaleY: height / fabricImg.getHeight(),
            lockMovementX: false, lockMovementY: false,
            lockScalingX: false, lockScalingY: false,
            // selectable: true,
            // scaleY: 0,
            opacity: 0.6
          }, (obj) => {
            // modified
            this.onMapModified(obj)
          }, (obj) => {
            // moving
          }, (obj) => {
            // select
          });


          this.onSet = true;

          this.canvas.renderAll();

        }
      }
    })
  }

  createRectangle(position: number[], color, otherParams, onmodified, onselected, onmoving): any {
    // FIXME: assuming correct order of position
    if (position.length != 8) {
      console.log(`Position for rectangle != 8 = ${position.length}`);
      return;
    }
    let obj = new fabric.Rect();
    let width = Math.abs(position[2] - position[0]);
    let height = Math.abs(position[5] - position[3]);

    obj.set({
      width: width,
      height: height,
      left: position[0],
      top: position[1],
      fill: (color) ? color : 'blue',
      lockRotation: true, lockScalingFlip: true,
      lockUniScaling: true,
      lockMovementX: true, lockMovementY: true,
      lockScalingX: true, lockScalingY: true,
      // originX: 'center', originY: 'center'
    });

    obj.set(otherParams);
    this.pointPositionControl(obj);
    obj.on('selected', () => {
      (onselected) ? onselected(obj) : null;
      this.canvas.renderAll();
      //window.setTimeout(function() {window.scope.$apply();}, 0);

    });
    obj.on('modified', () => {
      this.pointPositionControl(obj);
      (onmodified) ? onmodified(obj) : null;
      this.canvas.renderAll();
      //window.setTimeout(function() {window.scope.$apply();}, 0);

    });
    obj.on('moving', () => {
      this.pointPositionControl(obj);
      (onmoving) ? onmoving(obj) : null;
      this.canvas.renderAll();
      //window.setTimeout(function() {window.scope.$apply();}, 0);

    });
    this.canvas.add(obj);
    this.canvas.renderAll();
    return obj;
  }


  pointPositionControl(obj): any {
    let rangeOffset = 2;

    if (obj.left - rangeOffset < 0) {
      // obj.setLeft(0);
      obj.set({
        left: rangeOffset
      });
    }
    if (obj.left + obj.width + rangeOffset > this.canvas.getWidth()) {
      obj.set({
        left: this.canvas.getWidth() - (obj.width + rangeOffset)
      });
    }
    if (obj.top - rangeOffset < 0) {
      // obj.setTop(0);
      obj.set({
        top: rangeOffset
      });

    }
    if (obj.top + obj.height + rangeOffset > this.canvas.getHeight()) {
      // obj.setTop(this.canvas.getHeight());
      obj.set({
        top: this.canvas.getHeight() - (obj.height + rangeOffset)
      });
    }
  }

  onMapModified(obj: any) {
    // top-left
    this.position[0] = obj.left;
    this.position[1] = obj.top;
    // top-right
    this.position[2] = obj.left + obj.width;
    this.position[3] = obj.top;
    // bottom-left
    this.position[4] = obj.left;
    this.position[5] = obj.top + obj.height;
    // bottom-right
    this.position[6] = obj.left + obj.width;
    this.position[7] = obj.top + obj.height;
    console.log('Position change');
    console.log(this.position);
  }

  clearCanvas(): any {
    super.clearCanvas();
    this.position = [0, 0, 0, 0, 0, 0, 0, 0];

    // FIXME: notify user....
  }

  invalidatePosition() {
    if (this.position[0] == 0 && this.position[1] == 0) {
      return 'top-left yet to set, 0 - 0';
    }
    if (this.position[0] == this.position[2]) {
      return 'width must > 0'
    }
    if (this.position[1] == this.position[5]) {
      return 'height must > 0'
    }

    return '';
  }

  reset() {
    this.position = [0, 0, 0, 0, 0, 0, 0, 0]; // store in pixel, W1, H1, W2 H2, W3, H3, W4, H4 (topleft, topright, bottom left, bottom right)
    // this.onShow = false;
    this.onSet = false; // already set the place, if false, allow drag, disable confirming
    // this.imgaly = {};
    if (this.rectangleMap) {
      this.canvas.remove(this.rectangleMap);
      this.rectangleMap = null;
    }
    // this.clearCanvas();
  }

  greyscale2DMap: number[][];
  greyscales: number[];
  greyscaleCalculated: boolean = false;
  plagioclaseSet: any;
  imgSrc: any;
  imageData: any;

  loadImageSrc(): any {
    this.imgSrc = new Image();
    this.imgSrc.crossOrigin = 'anonymous';
    // img.src = this.image.img_url + '&test=jkasdlkjasjdlka';
    this.imgSrc.src = this.img.img_url;
    this.imgSrc.setAttribute('crossOrigin', '');
    this.imgSrc.onload = () => {
      this.imageData = new SimpleImage(this.imgSrc);
    }
  }

  // Calculate the entire 2D grey scale map
  calculateAllGreyScale(): any {
    if (this.greyscaleCalculated) {
      console.log(`Grescale already calculated`);
      // subscriber.next()
      return;
    }
    if (!this.img || !this.imageData) {
      console.log(`Wrong! image not available in plagioclase canvase`);
      return;
      // subscriber.error()
    }
    this.greyscale2DMap = [];
    let i = 0;
    let j = 0;
    for (let pixel of this.imageData.values()) {
      let avg = (pixel.getRed() + pixel.getGreen() + pixel.getBlue()) / 3;
      avg = +avg.toFixed(0);

      if (j == 0) {
        // starting of row
        this.greyscale2DMap.push([]);
        this.greyscale2DMap[this.greyscale2DMap.length - 1].push(avg);
        j++;
      }
      else if (j >= this.imageData.width - 1) {
        // end of row
        // this.greyscale2DMap[i].push(avg);
        this.greyscale2DMap[this.greyscale2DMap.length - 1].push(avg);
        i++;
        j = 0;
      }
      else {
        this.greyscale2DMap[this.greyscale2DMap.length - 1].push(avg);
        j++;
      }

    }
    this.greyscaleCalculated = true;
  }

  // FIXME: there are potential bugs when zoom is trigger
  regionalGreyscaleHistogram(): number[] {
    // caculate from positions
    // this.greyscales = [];
    // this.plagioclaseSet = {};
    this.calculateAllGreyScale();
    let plagSet = [];
    for (let i = 0; i < 256; i++) {
      plagSet[i] = 0;
    }
    let width = Math.floor(this.position[2] - this.position[0]);
    let height = Math.floor(this.position[5] - this.position[1]);
    let left = Math.floor(this.position[0]);
    let top = Math.floor(this.position[1]);
    let val;
    console.log(this.position);

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        val = this.greyscale2DMap[i + top][j + left];

        if (!plagSet[val]) {
          plagSet[val] = 1;
        }
        else {
          plagSet[val]++;
        }
      }
    }
    return plagSet;
  }

  // FIXME: deprecated
  calculateGreyScale() {
    this.greyscales = [];
    this.plagioclaseSet = {};
    for (let i = 0; i <= 255; i++) {
      this.plagioclaseSet[i] = 0;
    }
    // let image = new SimpleImage(document.getElementById(`image-info`));
    // let img = new Image();
    // img.crossOrigin = 'anonymous';
    // // img.src = this.image.img_url + '&test=jkasdlkjasjdlka';
    // img.src = this.image.img_url;
    // img.setAttribute('crossOrigin', '');
    // img.onload = () => {
    // 	// console.log(image);
    // 	// console.log(image.values());
    // 	let image = new SimpleImage(img);
    // 	// img.
    // 	// for (let pixel of img.values()) {
    // 	for (let pixel of image.values()) {
    // 		let avg = (pixel.getRed() + pixel.getGreen() + pixel.getBlue()) / 3;
    // 		// pixel.setRed(avg);
    // 		// pixel.setGreen(avg);
    // 		// pixel.setBlue(avg);
    // 		// console.log(avg);
    // 		// this.greyscales.push(+avg.toFixed(0));
    // 		avg = +avg.toFixed(0);
    // 		if (!this.plagioclaseSet[avg]) {
    // 			this.plagioclaseSet[avg] = 1;
    // 		}
    // 		else {
    // 			this.plagioclaseSet[avg]++;
    // 		}
    // 	}
    // 	// this.greyscales.sort();
    // 	// console.log(this.greyscales);
    //
    // 	// this.greyscales.forEach(v => {
    // 	// 	if (!this.plagioclaseSet[v]) {
    // 	// 		this.plagioclaseSet[v] = 1;
    // 	// 	}
    // 	// 	else {
    // 	// 		this.plagioclaseSet[v]++;
    // 	// 	}
    // 	// });
    // 	this.plotPlagioclase();
    // };


    // console.log(Object.keys(this.plagioclaseSet).length);

  }

  retrievePlagPlotData(coeff, bias): PlagPlotData {
    let plagSet = this.regionalGreyscaleHistogram();
    let labels = [];
    // let data = [];
    for (let i = 0; i < 256; i++) {
      labels.push(+(i * coeff + bias).toFixed(2));
      // data.push
    }
    return {
      labels: labels,
      data: plagSet
    };
  }

  inferenceAnnotation(v: number) {
    // return v * this.plagioclaseLinearParams.a + this.plagioclaseLinearParams.b;
  }

}
