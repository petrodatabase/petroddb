import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from "@angular/material";
import {Analysis} from "../../../models/analysis";
import {Chart} from "../../../models/chart";

export interface PointAlyChartConfig {
  chart: Chart;
  width: number;
  height: number;
  savable: boolean;
  pointAlys: Analysis[];
}

export interface PointAlyChartOnClose {
  data: any;
}

@Component({
  selector: 'app-point-aly-chart-dialog',
  templateUrl: './point-aly-chart-dialog.component.html',
  styleUrls: ['./point-aly-chart-dialog.component.css']
})
export class PointAlyChartDialogComponent implements OnInit, AfterViewInit {

  // testing
  chartConfig = {
    data: [],
    labels: [],
    // colors: [],
    options: {
      title: {
        display: true,
        text: ``,
      },
      scaleShowVerticalLines: false,
      responsive: true,
      maintainAspectRatio: false,
    },
    legend: true,
    type: 'line',
    // colors: [],
    click: ($event) => {
      console.log($event);
    },
    hover: ($event) => {
      console.log($event);
    }
  };

  filterAlys: Analysis[];

  width: number = 900;
  height: number = 635;


  @ViewChild('dialogContent')
  dialogContent: any;

  savable: boolean = false;

  constructor(public dialogRef: MdDialogRef<PointAlyChartDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: PointAlyChartConfig,) {
    this.filterAlys = data.chart.filterData(data.pointAlys);
    console.log(data);
    this.width = data.width - 90;
    this.height = data.height - 220;
    this.savable = data.savable;
    console.log(this.dialogRef.componentInstance);
    // console.log(this.dialogRef.componentInstance.nativeElement);
    // console.log(this.dialogRef.componentInstance.nativeElement.offsetWidth);


  }

  ngOnInit() {
    // this.testLineChart();
    // this.height = window.innerHeight - 470;
    // this.width = window.innerWidth - 350;
    // this.height = this.dialogContent.nativeElement.offsetHeight - 200;
    // this.width = this.dialogContent.nativeElement.offsetWidth - 50;
    console.log(`width height: ${this.width} ${this.height}`);
  }

  ngAfterViewInit() {
  }

  onCloseCancel() {
    this.dialogRef.close({
      data: null
    })
  }

  onCloseConfirm() {
    this.dialogRef.close({
      data: this.data.chart,
    })
  }

  onCloseSave() {
    this.dialogRef.close({
      data: this.data.chart,
    })
  }

  testLineChart() {
    this.chartConfig.options.title.text = 'Test chart'
    let xaxis = this.data.pointAlys.map(v => v.pos_x);

    this.chartConfig.labels = xaxis;

    let fields = ['H2O', 'C2O', 'CAO'];

    let data = [];
    fields.forEach(k => {
      data.push({
        data: this.data.pointAlys.map((v, i) => {
          // let value = v.data[k] || 0;
          // if (value == -999) {
          // 	if (i == 0) {
          // 		return 0;
          // 	}
          // 	else {
          // 		return
          // 	}
          // }
          return v.data[k].ele_val;
        }),
        label: k,
        fill: false
      })
    });
    console.log(data);
    this.chartConfig.data = JSON.parse(JSON.stringify(data));
  }

}
