import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Chart, ChartConfig} from "../../../models/chart";
import {Analysis} from "../../../models/analysis";
import {AlertService} from "../../../components/alert-dialog/alert.service";

declare var Plotly: any;
declare var google: any;

@Component({
	selector: 'app-point-aly-chart',
	templateUrl: './point-aly-chart.component.html',
	styleUrls: ['./point-aly-chart.component.css']
})
export class PointAlyChartComponent implements OnInit {
  _R:number[];
  @Input() set R(R: number[]){
    this._R = R;
    console.log(this._R);
  }

	_chart: Chart;
	@Input() set chart(chart: Chart) {
		this._chart = chart;
		this.exportChartConfig();
	}

	get chart() {
		return this._chart;
	}

	_pointAlys: Analysis[];
	@Input() set pointAlys(alys: Analysis[]) {
		this._pointAlys = alys;
		this.exportChartConfig();
	}

	get pointAlys() {
		return this._pointAlys;
	}

	_width: number = 900;
	_height: number = 200;
	@Input() set width(w: number) {
		this._width = w;
	}

	@Input() set height(h: number) {
		this._height = h - 15;
	}


	config: ChartConfig = null;

	@ViewChild('ternaryChart')
	ternaryChart: ElementRef;

	constructor(
	  private alertService: AlertService,
  ) {
	}

	ngOnInit() {
		this.exportChartConfig();
	}

	exportChartConfig() {
		if (this._chart && this._pointAlys) {
			this.config = this._chart.exportAlyChartConfig(this._pointAlys);
			console.log(this.config, this._R);

			// convert string to double
      for (var j=0;j<this.config.labels.length;j++) {
        this.config.labels[j]=+this.config.labels[j];
      }

			if (this.config.type == 'ternary') {
			  if (this.config.labels.length != 3) {
			    this.alertService.openAlert(`Ternary Graph requires exactly 3 axes, you have chosen ${this.config.labels.length}`, `Invalid configuration`);
			    return;
        }
        else {
          this.config.labels = Object.keys(this.config.data[0]);
          setTimeout(() => {
            this.plotTernaryChart(this.config);
          }, 500);
        }
			}

			if (this.config.type =='scatter') {
        var h_axis_title;
        [this.config.labels,h_axis_title] =
          this.processDataFormatBeforePlotScatter(
            this.config.x_axis,this.config.labels,(this._R === null || this._R === undefined)? 0 :this._R[0]);
        var v_axis_title;
        [this.config.data[0].data,v_axis_title]=
          this.processDataFormatBeforePlotScatter(
            this.config.data[0].label,this.config.data[0].data,(this._R === null || this._R === undefined)? 0 :this._R[1]);

       this.plotScatter(this.config,h_axis_title,v_axis_title);
      }


		}
	}


	// ---------------------- TERNARY chart -------------------------
	// plotTernaryChart() {
	//
	// }


	// updateDataPoint() {
	// 	const key = '-KrCQaF9eK1i4XcSXZUH'
	// 	const newData = {
	// 		analyst:   _.random(0, 100),
	// 		designer:  _.random(0, 100),
	// 		developer: _.random(0, 100)
	// 	}
	// 	this.chartService.updateRanking(key, newData)
	// }

	plotTernaryChart(config) {
		const element = this.ternaryChart.nativeElement;

		const formattedData = [{
			type: 'scatterternary',
			mode: 'markers',
			a: config.data.map(d => d[config.labels[0]] ),
			b: config.data.map(d => d[config.labels[1]]),
			c: config.data.map(d => d[config.labels[2]]),
			text: config.data.map(d => d['ref_id'] || '0'),
			marker: {
				symbol: 100,
				color: '#DB7365',
				size: 14,
				line: { width: 2 }
			},
		}];
		const style = {
			ternary: {
				sum: 100,
				aaxis: this.makeAxis(config.labels[0], 0),
				baxis: this.makeAxis(config.labels[1], 45),
				caxis: this.makeAxis(config.labels[2], -45),
				bgcolor: '#fff1e0'
			}
		};
		Plotly.plot(element, formattedData, style);
	}

	private makeAxis(title, tickangle) {
		return {
			title: title,
			titlefont: { size: 20 },
			tickangle: tickangle,
			tickfont: { size: 15 },
			tickcolor: 'rgba(0,0,0,0)',
			ticklen: 5,
			showline: true,
			showgrid: true
		};
	}

  processDataFormatBeforePlotScatter(target, data: any, R: number){
    // *1000 for 87Sr/86Sr
    // use formula for 143Nd/144Nd and 176Hf/177Hf
    // keep for rest

    var title;
    switch (target){
      case 'data.87Sr_86Sr':
      case '87Sr_86Sr':
        for( var i=0; i< data.length;i++){
          data[i] = data[i]*1000;

        }
        title = '87Sr_86Sr * 1000';
        break;
      case 'data.143Nd_144Nd':
      case '143Nd_144Nd':
        if(R==0 || !R) {
          // R= 0.511854;
          for( var i=0; i< data.length;i++){
            data[i] = data[i]*1000;
          }
          title = '143Nd_144Nd * 1000';

        }
        else{
          for( var i=0; i< data.length;i++){
            data[i] = ((data[i]/R)-1)*10000;
          }
          title = 'Epsilon Nd with R = '+ R;
        }

        break;
      case 'data.176Hf_177Hf':
      case '176Hf_177Hf':
        if(R==0 || !R) {
          // R= 0.282161;
          for( var i=0; i< data.length;i++){
            data[i] = data[i]*1000;
          }
          title = '176Hf_177Hf * 1000';

        }
        else{
          for( var i=0; i< data.length;i++){
            data[i] = ((data[i]/R)-1)*10000;
          }
          title = 'Epsilon Hf with R = '+ R;
        }
        break;
      default:
        title = target;
        break;
    }

    return [data,title] ;

  }


  public scatterChartData:any = {
    chartType: 'ScatterChart',
    dataTable: [],
    options: {},
    formatters :[],
  };

	plotScatter(config,h_axis_title,v_axis_title){
    console.log("This is SCATTER");

    var data_for_scatter=[];
    data_for_scatter.push([config.x_axis,config.data[0].label]);





    for (var i=0;i<config.labels.length;i++){
      data_for_scatter.push([config.labels[i],config.data[0].data[i]]);
    }
    console.log(data_for_scatter);
    this.scatterChartData.dataTable = data_for_scatter;
    this.scatterChartData.formatters =[

      {
        columns: [0, 1],
        type: 'NumberFormat',
        options: {
          pattern:'###.#####',
        }
      }

    ];

    this.scatterChartData.options=   {
      title: config.x_axis + ' vs. '+ config.data[0].label+ ' comparison',
      hAxis: {title: h_axis_title,format:'###.###',viewWindowMode:'pretty'},
      vAxis: {title: v_axis_title, format:'###.###',viewWindowMode:'pretty'},
      chartArea:{width:"80%"},
      height: 500,
      width: 1350,
      explorer: { actions: ['dragToZoom', 'rightClickToReset'] },

    };
    console.log(this.scatterChartData);

  }
}
