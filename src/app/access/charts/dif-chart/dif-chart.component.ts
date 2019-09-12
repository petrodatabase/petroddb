import {AfterContentInit, AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {Diffusion} from "../../../models/diffusion";
import {Analysis} from "../../../models/analysis";

interface ChartColor {
	// backgroundColor: 'rgba(148,159,177,0.2)',
	// borderColor: 'rgba(148,159,177,1)',
	// pointBackgroundColor: 'rgba(148,159,177,1)',
	// pointBorderColor: '#fff',
	// pointHoverBackgroundColor: '#fff',
	// pointHoverBorderColor: 'rgba(148,159,177,0.8)',
	//
	backgroundColor: string;
	borderColor: string;
	pointBackgroundColor: string;
	pointBorderColor: string;
	pointHoverBackgroundColor: string;
	pointHoverBorderColor: string;

}

interface ChartConfig {
	data: any[];
	labels: any[];
	options: any;
	legend: boolean;
	type: string;
	// colors: any[];
	click: any;
	hover: any;

}

@Component({
	selector: 'app-dif-chart',
	templateUrl: './dif-chart.component.html',
	styleUrls: ['./dif-chart.component.css']
})
export class DifChartComponent implements OnInit, AfterViewInit {

	_diffusion: Diffusion;

	@Input() set diffusion(diffusion: Diffusion) {
		this._diffusion = diffusion;
		if (diffusion && diffusion.data_list.length > 0) {
			console.log(diffusion);
			this.initData();
		}
	}

	chartConfig: ChartConfig = {
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
		}};

	constructor() {
	}

	ngOnInit() {
	}

	ngAfterViewInit() {
	}

	// activate when diffusion comes
	initData() {
		this.chartConfig.options.title.text = `Traverse ${this._diffusion.dif_name}`;
		this.writeLabels();
		this.writeData();
		console.log(this.chartConfig);
	}

	writeLabels() {
		// calculate the distance from the first element
		let distances = [];
		// let colors = [];
		this._diffusion.data_list.forEach((v: Analysis, i: number) => {
			if (i == 0) {
				distances.push(0);
			}
			else {
				let firstPoint = this._diffusion.data_list[0];
				let dist = Math.sqrt((v.pos_x - firstPoint.pos_x) ** 2 + (v.pos_y - firstPoint.pos_y) ** 2);
				distances.push(dist.toFixed(2));
			}
			// colors.push({backgroundColor: 'rgba(148,159,177,0.0)',})
		});

		this.chartConfig.labels = JSON.parse(JSON.stringify(distances));
		// this.chartConfig.colors = JSON.parse(JSON.stringify(colors));
	}

	writeData() {
		let elements = Object.keys(this._diffusion.data_list[0].data);

		let data = [];
		elements.forEach(k => {
			let vals = this._diffusion.data_list.map(v => v.data[k].ele_val);
			for (let i = 0; i < vals.length; i++) {
				if (vals[i] === -999) {
					if (i == 0) {
						vals[i] = 0;
					}
					// else if (i == vals.length - 1) {
					// 	vals[i] = vals[i - 1];
					// }
					else {
						vals[i] = vals[i - 1];
					// 	vals[i] = (vals[i - 1] + vals[i + 1]) / 2;
					}
				}
			}

			data.push({
				data: vals,
				label: `${k}`,
				backgroundColor: 'rgb(0,0,0,0)',
				fill: false
			})
		});

		console.log(data);
		this.chartConfig.data = JSON.parse(JSON.stringify(data));

	}
}
