// import 'fabric';

declare var fabric: any;
declare var $: any;

export interface ContainerScroll {
  top: number;
  left: number;
}

export class CanvasModelAlready {
  canvas: any;

  width: number;
  height: number;
  canvasId: string;
  pointHovering: any;
  lineHovering: any;
  thumbnailHovering: any;
  zoomFactor: number;
  currentZoomRatio;

  constructor(canvasId, width, height, public getPosMouse = null) {
    // var _this = this;
    this.clearCanvas();
    this.width = width;
    this.height = height;
    this.canvasId = canvasId;
    // this.canvas = new fabric.Canvas(canvasId);
    // if (!(isNaN(width) || isNaN(height))) {
    // 	this.canvas.setW 	idth(width);
    // 	this.canvas.setHeight(height);
    // }

    //TODO: these function must pass to fabric object or the whole information object in subclass
    this.pointHovering = null;
    this.lineHovering = null;
    this.thumbnailHovering = null;
    this.zoomFactor = 1.1;
    this.currentZoomRatio = 1;
  }
  clearCanvas() {
    if (this.canvas) {
      this.canvas.clear();
      this.canvas = null;
      $(`#${this.canvasId}`).parent().parent().html(`<canvas id="${this.canvasId}" class="fabric-canvas" ></canvas>`);
    }
    //	TODO: must be override to remove other data
  }

  createCanvas() {
    // this.width = width;
    // this.height = height;
    // console.log(fabric);
    this.clearCanvas();
    this.canvas = new fabric.Canvas(this.canvasId);
    if (!(isNaN(this.width) || isNaN(this.height))) {
      this.canvas.setWidth(this.width);
      this.canvas.setHeight(this.height);
    }
  }


  // ------- image thumbnail manipulate -----
  // BY default, all movement and rotation is locked!
  createImgThumbnail(id, params, onmodified, onselected, onmoving) {

    console.log(id);
    let obj = new fabric.Image();
    obj.setElement(document.getElementById(id));
    // let _this = this;
    // obj.setElement(document.getElementById(id));
    obj.set({
      lockRotation: true, lockScalingFlip: true,
      lockMovementX: true, lockMovementY: true,
      lockScalingX: true, lockScalingY: true,
    });
    obj.set(params);

    obj.on('modified', () => {
      this.thumbnailPositionControl(obj);

      if (onmodified) {
        onmodified(obj);
      }
      this.canvas.renderAll();
    });
    obj.on('selected', () => {
      if (onselected) {
        onselected(obj);
      }
      this.canvas.renderAll();

    });
    obj.on('moving', () => {
      // console.log('moving');
      // console.log(`canvaswidth ${this.canvas.getWidth()} obj width: ${obj.width}`);
      // console.log(`canvash ${this.canvas.getHeight()} obj h: ${obj.height}`);
      this.thumbnailPositionControl(obj);

      if (onmoving) {
        onmoving(obj);
      }
      this.canvas.renderAll();

    });


    this.canvas.add(obj);
    this.canvas.renderAll();

    return obj;
  }
  removeImgThumbnail(obj) {
    this.canvas.remove(obj);
    this.canvas.renderAll();
    //	TODO: must follow by removing from data object
  }

  thumbnailPositionControl(obj: any) {
    // padding of canvas
    // FIXME: to be global parameters
    let rangeOffset = 20;
    let objCanvasWidth = obj.width * obj.scaleX;
    let objCanvasHeight = obj.height * obj.scaleY;

    if (obj.left - rangeOffset < 0) {
      // obj.setLeft(0);
      obj.set({
        left: rangeOffset
      });
    }
    if (obj.left + objCanvasWidth + rangeOffset > this.canvas.getWidth()) {
      obj.set({
        left: this.canvas.getWidth() - (objCanvasWidth + rangeOffset)
      });
    }
    if (obj.top - rangeOffset < 0) {
      // obj.setTop(0);
      obj.set({
        top: rangeOffset
      });

    }
    if (obj.top + objCanvasHeight + rangeOffset > this.canvas.getHeight()) {
      // obj.setTop(this.canvas.getHeight());
      obj.set({
        top: this.canvas.getHeight() - (objCanvasHeight + rangeOffset)
      });
    }

  }

  // ---- creation and deletion of points--------------
  // default point radius is 7, color = blue
  createPoint(clientX, clientY, color, otherParams = {}, onmodified, onselected, onmoving) {
    // let _this = this;
    let obj = new fabric.Circle();
    obj.set({
      radius: 7,
      left: clientX,
      top: clientY,
      fill: (color)?color:'blue',
      lockRotation: true, lockScalingFlip: true,
      lockUniScaling: true,
      lockMovementX: true, lockMovementY: true,
      lockScalingX: true, lockScalingY: true,
      originX: 'center', originY: 'center'
    });
    obj.set(otherParams);
    obj.on('selected', () => {
      (onselected)?onselected(obj):null;
      this.canvas.renderAll();
      //window.setTimeout(function() {window.scope.$apply();}, 0);

    });
    obj.on('modified', () => {
      this.pointPositionControl(obj);
      (onmodified)?onmodified(obj):null;
      this.canvas.renderAll();
      //window.setTimeout(function() {window.scope.$apply();}, 0);

    });
    obj.on('moving', () => {
      this.pointPositionControl(obj);
      (onmoving)?onmoving(obj):null;
      this.canvas.renderAll();
      //window.setTimeout(function() {window.scope.$apply();}, 0);

    });
    this.canvas.add(obj);
    this.canvas.renderAll();
    return obj;
  }
  removePoint(obj) {
    this.canvas.remove(obj);
    this.canvas.renderAll();
  }

  createRectangle(clientX, clientY, color, otherParams, onmodified, onselected, onmoving) {
    let obj = new fabric.Rect();
    obj.set({
      width: 12,
      height: 12,
      left: clientX,
      top: clientY,
      fill: (color)?color:'blue',
      lockRotation: true, lockScalingFlip: true,
      lockUniScaling: true,
      lockMovementX: true, lockMovementY: true,
      lockScalingX: true, lockScalingY: true,
      originX: 'center', originY: 'center'
    });
    obj.set(otherParams);
    obj.on('selected', () => {
      (onselected)?onselected(obj):null;
      this.canvas.renderAll();
      //window.setTimeout(function() {window.scope.$apply();}, 0);

    });
    obj.on('modified', () => {
      this.pointPositionControl(obj);
      (onmodified)?onmodified(obj):null;
      this.canvas.renderAll();
      //window.setTimeout(function() {window.scope.$apply();}, 0);

    });
    obj.on('moving', () => {
      this.pointPositionControl(obj);
      (onmoving)?onmoving(obj):null;
      this.canvas.renderAll();
      //window.setTimeout(function() {window.scope.$apply();}, 0);

    });
    this.canvas.add(obj);
    this.canvas.renderAll();
    return obj;
  }
  removeRectangle(obj) {
    this.canvas.remove(obj);
    this.canvas.renderAll();
  }


  pointPositionControl(obj) {
    // padding of canvas
    // FIXME: to be global parameters
    let rangeOffset = 5;
    // let objCanvasWidth = obj.width * obj.scaleX;
    // let objCanvasHeight = obj.height * obj.scaleY;

    if (obj.left - obj.radius - rangeOffset < 0) {
      // obj.setLeft(0);
      obj.set({
        left: obj.radius + rangeOffset
      });
    }
    if (obj.left + obj.radius + rangeOffset > this.canvas.getWidth()) {
      obj.set({
        left: this.canvas.getWidth() - (obj.radius + rangeOffset)
      });
    }
    if (obj.top - obj.radius - rangeOffset < 0) {
      // obj.setTop(0);
      obj.set({
        top: obj.radius + rangeOffset
      });

    }
    if (obj.top + obj.radius + rangeOffset > this.canvas.getHeight()) {
      // obj.setTop(this.canvas.getHeight());
      obj.set({
        top: this.canvas.getHeight() - (obj.radius + rangeOffset)
      });
    }
  }


  // -------------creation and deletion of lines ---------
  createLine(x1, y1, x2, y2, stroke = null, otherParams = {}, onmodified= null, onselected = null, onmoving = null) {
    // let _this = this;
    let obj = new fabric.Line();
    obj.set({
      x1: x1, x2: x2, y1: y1, y2: y2,
      strokeWidth: 4, stroke: (stroke)?stroke:'rgba(100, 200, 200, 1)',
      lockMovementX: true, lockMovementY: true,
      lockRotation: true, lockScalingFlip: true,
      lockScalingX: true, lockScalingY: true,
      selectable: false,
      lockUniScaling: true,
    });
    obj.set(otherParams);
    obj.setCoords();

    obj.on('modified', () => {
      if (obj.left < 0) {
        obj.setLeft(0);
      }
      if (obj.left > this.canvas.getWidth()) {
        obj.setLeft(this.canvas.getWidth());
      }
      if (obj.top < 0) {
        obj.setTop(0);
      }
      if (obj.top > this.canvas.getHeight()) {
        obj.setTop(this.canvas.getHeight());
      }
      (onmodified)?onmodified(obj):null;
      this.canvas.renderAll();
      //window.setTimeout(function() {window.scope.$apply();}, 0);

    });

    obj.on('moving', () => {
      if (obj.left < 0) {
        obj.setLeft(0);
      }
      if (obj.left > this.canvas.getWidth()) {
        obj.setLeft(this.canvas.getWidth());
      }
      if (obj.top < 0) {
        obj.setTop(0);
      }
      if (obj.top > this.canvas.getHeight()) {
        obj.setTop(this.canvas.getHeight());
      }
      (onmoving)?onmoving(obj):null;
      this.canvas.renderAll();
      //window.setTimeout(function() {window.scope.$apply();}, 0);

    });
    obj.on('selected', () => {
      (onselected)?onselected(obj):null;
      this.canvas.renderAll();
      //window.setTimeout(function() {window.scope.$apply();}, 0);

    });

    this.canvas.add(obj);
    this.canvas.renderAll();

    return obj;
  }
  removeLine(obj) {
    this.canvas.remove(obj);
    this.canvas.renderAll();
  }


  importCanvas(objs) {
    //	must be override to import data
    this.createCanvas();
  }

  zoomIn() {
    // let _this = this;
    this.canvas.setZoom(this.canvas.getZoom() * this.zoomFactor);
    // this.canvas.setZoom(this.canvas.getZoom() * this.zoomFactor);
    this.currentZoomRatio *= this.zoomFactor;
    this.canvas.renderAll();
  }

  zoomOut() {
    // let _this = this;

    this.canvas.setZoom(this.canvas.getZoom() / this.zoomFactor);
    this.currentZoomRatio /= this.zoomFactor;
    this.canvas.renderAll();
  }
  zoomReset() {
    // var _this = this;

    this.canvas.setZoom(this.canvas.getZoom() / this.currentZoomRatio);
    this.currentZoomRatio /= this.currentZoomRatio;
    this.canvas.renderAll();
  }

  getZoom() {
    return this.currentZoomRatio;
  }

  // TODO: return the pixel - real height of canvas, combination of height and zoom scale
  getRealCanvasHeight() {
    return this.canvas.height * this.currentZoomRatio;
  }

  getRealCanvasWidth() {
    return this.canvas.width * this.currentZoomRatio;
  }

  zoomHardSet(ratio) {
    // var _this = this;
    this.canvas.setZoom(ratio);
    this.currentZoomRatio = ratio;
    this.canvas.renderAll();
  }
}
