import {BaseModel} from "./base-model";
import {Analysis} from "./analysis";
import {PointAlyChartConfig} from "../access/charts/point-aly-chart-dialog/point-aly-chart-dialog.component";


export interface ChartConfig {
  x_axis: string,
  data: any[];
  labels: any[];
  options: any;
  legend: boolean;
  type: string;
  otherParams: any; // only for pie, doughnut, polar area and other special type of charts
  // colors: any[];
  click: any;
  hover: any;
}


export class Chart extends BaseModel {
  $key: string;

  chart_name: string;

  img_id: string;

  options: any;
  type: string;

  x_axis: string;
  x_title: string;

  y_axis: string;
  y_title: string;
  other_axes: string[];

  // FIXME: with ids, load the data from analyses
  data_ids: string[];


  comment: string;

  r_x_axis: number;
  r_y_axis: number;

  public static schema = {
    // maybe not in schema
    $key: {type: 'string'},
    chart_name: {type: 'string', placeholder: 'Title',},
    img_id: {type: 'string', placeholder: 'Image ID',},

    options: {type: 'object', placeholder: 'Options',},
    type: {
      type: 'string',
      placeholder: 'Type',
      choices: ['line', 'doughnut', 'radar', 'bar', 'pie', 'polarArea', 'ternary','scatter']
    },

    x_axis: {type: 'string', placeholder: 'X axis',},
    x_title: {type: 'string', placeholder: 'X axis title',},
    y_axis: {type: 'string', placeholder: 'Y axis',},
    y_title: {type: 'string', placeholder: 'Y axis title',},

    other_axes: {type: 'array', placeholder: 'Other axes'},

    // FIXME: with ids, load the data from analyses
    data_ids: {type: 'array'},

    comment: {type: 'string', placeholder: 'Commnet'},

    r_x_axis: {type: 'number'},
    r_y_axis: {type: 'number'},

  };

  constructor(obj: any) {
    super(obj, Chart.schema);
  }

  exportAlyChartConfig(data: Analysis[], params: any = {}, click = null, hover = null): ChartConfig {
    let config = {
      x_axis: this.x_axis,
      data: [],
      labels: [],
      options: {
        title: {
          display: true,
          text: this.chart_name,
        },
        scaleShowVerticalLines: false,
        responsive: true,
        maintainAspectRatio: false,
      },
      otherParams: {},
      legend: true,
      type: this.type,
      click: ($event) => {
        console.log($event);
        if (click) {
          click($event);
        }
      },
      hover: ($event) => {
        console.log($event);
        if (hover) {
          hover($event);
        }
      }
    };


    // load the data and labels
    let alys = this.filterData(data);


    config = this.configResolveOption(config);
    config = this.configResolveData(config, alys);

    return config;
  }

  filterData(alys: Analysis[]): Analysis[] {
    return alys.filter(v => this.data_ids.includes(v.$key));
  }

  configResolveOption(config: ChartConfig) {
    return config;
  }

  configResolveData(config: ChartConfig, alys: Analysis[]) {
    // for type
    // type: {type: 'string', choices: ['line', 'doughnut', 'radar', 'bar', 'pie', 'polarArea', 'ternary']},

    switch (config.type) {
      case 'line':
        config = this.processLine(config, alys);
        break;
      case 'bar':
        config = this.processBar(config, alys);
        break;
      case 'radar':
        config = this.processRadar(config, alys);
        break;
      case 'doughnut':
        config = this.processDoughnut(config, alys);
        break;
      case 'pie':
        config = this.processPie(config, alys);
        break;
      case 'polarArea':
        config = this.processPolarArea(config, alys);
        break;
      case 'ternary': // special case
        config = this.processTernary(config, alys);
        break;
      case 'scatter':
        config = this.processScatter(config,alys);
        break;
      default:
        break;
    }

    return config;
  }

  // must be number
  resolveAccess(aly: any, accessor: string): any {
    // either "pos_x"... or "data.element.ele_val"
    let parts = accessor.split(".");
    if (parts.length == 1) {
      if (aly[parts[0]] && aly[parts[0]]['ele_val']) {

        return aly[parts[0]]['ele_val'];
      }
      else {
        return aly[parts[0]] || 0;
      }
    }
    else {
      return this.resolveAccess(aly[parts[0]], parts.splice(1, parts.length - 1).join("."));
    }
  }

  resolveSequence(alys: Analysis[], key): any[] {
    let values = alys.map(v => this.resolveAccess(v, key));
    for (let i = 0; i < values.length; i++) {
      if (!values[i] || values[i] == -999) {
        if (i == 0) {
          values[i] = 0;
        }
        else {
          values[i] = values[i - 1];
        }
      }
    }
    return values;
  }

  // TODO: line process multiple analyses with x-axis and other axes as y-axis
  processLine(config: ChartConfig, alys: Analysis[]): ChartConfig {
    let labels = this.resolveSequence(alys, this.x_axis).map(v => v.toFixed(2));
    console.log(labels);
    let data = [];

    this.other_axes.forEach(k => {
      data.push({
        data: this.resolveSequence(alys, k),
        label: k.split(".").slice(-1)[0],
        fill: false,
      });
    });

    config.labels = labels;
    config.data = data;

    return config;
  }

  // TODO: bar process each bar group as one analysis, each bar of a group represent "other axes"
  // x-axis represent point ref id
  processBar(config: ChartConfig, alys: Analysis[]): ChartConfig {
    let labels = this.resolveSequence(alys, 'ref_id');
    let data = [];

    this.other_axes.forEach(k => {
      data.push({
        data: this.resolveSequence(alys, k),
        label: k.split(".").slice(-1)[0],
        // fill: false,
      });
    });

    config.labels = labels;
    config.data = data;
    return config;
  }

  // TODO: each point represent 1 area containing all other-axes
  processRadar(config: ChartConfig, alys: Analysis[]): ChartConfig {
    let labels = this.other_axes.map(k => k.split(".").slice(-1)[0]);
    let data = [];
    alys.forEach(v => {
      data.push({
        data: this.other_axes.map(k => this.resolveAccess(v, k)),
        label: v.ref_id,
      });
    });
    config.labels = labels;
    config.data = data;
    return config;
  }

  // doughnut, polar area, pie form multiple charts base on the number of analysis
  processDoughnut(config: ChartConfig, alys: Analysis[]): ChartConfig {
    config = this.processCircularChart(config, alys);
    return config;
  }

  processPolarArea(config: ChartConfig, alys: Analysis[]): ChartConfig {
    config = this.processCircularChart(config, alys);
    return config;
  }

  processPie(config: ChartConfig, alys: Analysis[]): ChartConfig {
    config = this.processCircularChart(config, alys);
    return config;
  }

  processCircularChart(config: ChartConfig, alys: Analysis[]): ChartConfig {
    // data = [[value], [value]]
    // labels = [[string], [string]]
    // otherParams.titles = [string, string]
    let data = [];
    let labels = [];
    let options = [];

    alys.forEach(v => {
      // options.push(v.ref_id);
      options.push({
        title: {
          display: true,
          text: v.ref_id + v.ref_name,
        },
        responsive: true
      },);
      labels.push(this.other_axes.map(k => k.split(".").slice(-1)[0]));
      data.push(this.other_axes.map(k => Number(this.resolveAccess(v, k))));
    });

    config.data = data;
    config.labels = labels;
    config.otherParams = options;
    console.log(config.data);
    console.log(config.labels);

    return config;
  }


  processTernary(config: ChartConfig, alys: Analysis[]): ChartConfig {
    // only the first 3 elements of other_axes allow
    // data = [{values...}, {}]
    // labels = [[string], [string]]
    // otherParams.titles = [string, string]
    let data = [];
    let labelTargets = this.other_axes.slice(0, 3);
    let labels = this.other_axes.map(k => k.split(".").slice(-1)[0]).splice(0, 3);
    let options = [];

    alys.forEach(v => {
      let d = {};
      labelTargets.forEach((k, i) => {
        d[labels[i]] = this.resolveAccess(v, k);
      });
      d['ref_id'] = v.ref_id;
      data.push(d);
    });

    config.data = data;
    config.labels = labels;

    return config;
  }

  processScatter(config: ChartConfig, alys: Analysis[]): ChartConfig {
    let labels = this.resolveSequence(alys, this.x_axis).map(v => v.toFixed(6));
    console.log(labels);
    let data = [];

    this.other_axes.forEach(k => {
      data.push({
        data: this.resolveSequence(alys, k),
        label: k.split(".").slice(-1)[0],
        fill: false,
      });
    });

    config.labels = labels;
    config.data = data;

    return config;
  }

}
