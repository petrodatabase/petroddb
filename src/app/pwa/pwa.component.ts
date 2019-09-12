import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FileUploader} from 'ng2-file-upload';
import {FileSelectDirective, FileDropDirective, FileUploadModule} from 'ng2-file-upload';
import {HttpClient} from "@angular/common/http";
import {AlertService} from "../components/alert-dialog/alert.service";

declare var SimpleImage: any;

@Component({
  selector: 'app-pwa',
  templateUrl: './pwa.component.html',
  styleUrls: ['./pwa.component.css'],
})
export class PwaComponent implements OnInit, AfterViewInit {
  URL = 'http://localhost:8080/upload';
  public uploader: FileUploader = new FileUploader({url: this.URL});

  constructor(public http: HttpClient,
              public alertService: AlertService,) {

  }

  ngOnInit() {
  }

  // video =
  @ViewChild('video') video: any;
  video_native: any = null;

  @ViewChild('image') image: any;
  @ViewChild('canvas') canvas: any;

  canvasContext: any = null;
  localStream: any = null;
  imageSrc: any = '';


  handleVideo(stream) {
    this.video.src = window.URL.createObjectURL(stream);
  }

  // 640×360
  videoWidth = 640;
  videoHeight = 480;
  // videoWidth = 600;
  // videoHeight = 600;
  canvasWidth = 320;
  // canvasHeight = 240;
  canvasHeight = 320;
  // canvasRatio = 2;


  ngAfterViewInit() {
    // let _video = this.video.nativeElement;
    this.video_native = this.video.nativeElement;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // navigator.mediaDevices.getUserMedia({video: true, width: 1280, height: 720 })
      navigator.mediaDevices.getUserMedia({
        video: {
          width: {exact: 640},
          height: {exact: 480},
          facingMode: 'environment',
          // facingMode: 'user',
        }
      })
        .then(stream => {
          this.video_native.src = window.URL.createObjectURL(stream);
          this.video_native.play();
          this.localStream = stream;
          this.canvasContext = this.canvas.nativeElement.getContext('2d');
        })
    }
  }

  imgSrc: any = null;
  imageData: any = null;
  greyscale2DMap: any = null;


  snapShot() {
    if (this.localStream) {
      let offset = (this.videoWidth - this.videoHeight) / 2;
      this.canvasContext.drawImage(this.video_native,
        offset, 0, this.videoWidth - 2 * offset, this.videoHeight,
        0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
      this.imageSrc = this.canvas.nativeElement.toDataURL('image/webcam');

      this.imgSrc = new Image();
      this.imgSrc.crossOrigin = 'anonymous';
      // img.src = this.image.img_url + '&test=jkasdlkjasjdlka';
      this.imgSrc.src = this.imageSrc;
      this.imgSrc.setAttribute('crossOrigin', '');
      this.imgSrc.onload = () => {
        this.imageData = new SimpleImage(this.imgSrc);
        this.greyscale2DMap = [];
        let i = 0;
        let j = 0;

        let width = this.imageData.getWidth();
        let height = this.imageData.getHeight();

        let image_array = [];
        for (let pixel of this.imageData.values()) {
          if (j == 0) {
            // starting of row
            j++;
            image_array.push([]);
            image_array[image_array.length - 1].push([pixel.getRed(), pixel.getGreen(), pixel.getBlue()])

          }
          else if (j >= width - 1) {
            // end of row
            image_array[image_array.length - 1].push([pixel.getRed(), pixel.getGreen(), pixel.getBlue()])
            i++;
            j = 0;
          }
          else {
            image_array[image_array.length - 1].push([pixel.getRed(), pixel.getGreen(), pixel.getBlue()])
            j++;
          }

        }
        console.log(image_array);
        this.http.post(this.URL, {image: image_array})
          .subscribe(res => {
              console.log(res);
              this.alertService.openAlert('You have upload the image', 'Upload');
            },
            err => {
              console.log(err);
            })

      }
    }
  }

  upload() {

  }

  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }
}
