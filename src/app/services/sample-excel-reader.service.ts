import {Injectable} from '@angular/core';
import {ExcelReaderService} from "./excel-reader.service";
import {Sample} from "../models/sample";

@Injectable()
export class SampleExcelReaderService extends ExcelReaderService {
	rejectCol = ['ref_id', 'aly_comment', "color", 'pos_x', 'pos_y', 'pos_z', "reference id", "analysis comment", "marker color" ];

	constructor() {
		super();
	}

	workbookHandle(wb): any {
		super.workbookHandle(wb);
		let rejectCol_pos = ['pos_x', 'pos_y', 'pos_z'];

		this.data.columns.forEach(k => {
			// convert field name into variable name
			let newKey = k;
			switch (newKey) {
				case "Sample Name":
					newKey = "sp_name";
					break;
				case "Date of Collection":
					newKey = "sp_coldate";
					break;
				case "Latitude":
					newKey = "sp_lat";
					break;
				case "Longitude":
					newKey = "sp_lon";
					break;
				case "Elevation":
					newKey = "sp_alt";
					break;
				case "Sample Type":
					newKey = "sp_type";
					break;
				case "Rock Type":
        case "Rock Name":
					newKey = "sp_rocktype";
					break;
				case "Rock Composition":
        case "Type of Volcanic rocks/deposits":
					newKey = "sp_rockcomp";
					break;
				case "Material Amount":
					newKey = "sp_amount";
					break;
				case "Room":
					newKey = "sp_sloc_room";
					break;
				case "Description":
					newKey = "sp_sloc";
					break;
				case "Structural Data":
					newKey = "sp_sdata";
					break;
				case "Funding Source":
					newKey = "sp_fsrc";
					break;
				case "Field Observations":
					newKey = "sp_obs";
					break;
				case "Datum":
					newKey = "datum";
					break;
				case "Reference Frame":
					newKey = "ref_frame";
					break;
				case "Projection":
					newKey = "projection";
					break;
				case "Remarks & Comments":
					newKey = "sp_remark";
					break;

			}

			if (!(k in this.rejectCol) && this.data.rows[1].hasOwnProperty(k)) {
				//index 1 is unit declare
				if (this.data.rows[0][k] == null) {
					this.data.rows[0][k] = "";
				}
				if (newKey != k) {
					this.data.rows[0][newKey] = this.data.rows[0][k];
					delete this.data.rows[0][k];
				}

				// from index 2 is data
				for (let i = 1; i < this.data.rows.length; i++) {
					if (newKey != k) {
						this.data.rows[i][newKey] = this.data.rows[i][k];
						delete this.data.rows[i][k];
					}

					if (this.data.rows[i][newKey] == null) {
						// FIXME: re-implement this to fill in null value
						// current set to ""

						this.data.rows[i][newKey] = "";
						// if (rejectCol_pos.indexOf(newKey) > -1) {
						// 	this.data.rows[i][newKey] = 0;
						// }
						// else if (this.rejectCol.indexOf(k) > -1) {
						// }
						// else {
						// 	this.data.rows[i][newKey] = -999;
						// }
					}
					// if (['sp_type', 'sp_rocktype', 'sp_rockcomp'].includes(newKey)) {
					//   let other_key = `${newKey}_other`;
					//   let in_eles = this.data.rows[i][newKey].
          // }
				}
			}
		});

		this.dataHandle();
		// return this.data;
		if (this.callbackOnData) {
			this.callbackOnData(this.data);
		}
	}

	dataHandle() {
		// trucate the first row which is the guide row
		this.data.rows.splice(0, 1);
		// console.log()

    let odds, ins;
		for (let i = 0; i < this.data.rows.length ; i++) {

			this.data.rows[i]['sp_type'] = this.data.rows[i]['sp_type'].toString()
        .split(',')
        .map(v => this.typeNumberToText('sp_type', v.trim()))
        .filter(v => v != '');
			// this.data.rows[i]['sp_rocktype'] = this.data.rows[i]['sp_rocktype'].toString()
        // .split(',')
        // .map(v => this.typeNumberToText('sp_rocktype', v.trim()))
        // .filter(v => v != '');
			// this.data.rows[i]['sp_rockcomp'] = this.data.rows[i]['sp_rockcomp'].toString()
        // .split(',')
        // .map(v => this.typeNumberToText('sp_rockcomp', v.trim()))
        // .filter(v => v != '');

      this.data.rows[i]['sp_rocktype'] = this.data.rows[i]['sp_rocktype'].toString()
      .split(',');

      this.data.rows[i]['sp_rockcomp'] = this.data.rows[i]['sp_rockcomp'].toString()
      .split(',');

			['sp_type'].forEach(k => {
			  odds = this.data.rows[i][k].filter(v => !Sample.schema[k]['checkboxes'].includes(v));
			  ins = this.data.rows[i][k].filter(v => Sample.schema[k]['checkboxes'].includes(v));
			  this.data.rows[i][k] = ins;
			  this.data.rows[i][`${k}_other`] = odds.join(',');
      });
      ['sp_rocktype', 'sp_rockcomp'].forEach(k => {
        odds = this.data.rows[i][k].filter(v => !(Sample.schema[k]['checkboxes'][0].concat(Sample.schema[k]['checkboxes'][1]).concat(Sample.schema[k]['checkboxes'][2])).includes(v));
        ins = this.data.rows[i][k].filter(v => (Sample.schema[k]['checkboxes'][0].concat(Sample.schema[k]['checkboxes'][1]).concat(Sample.schema[k]['checkboxes'][2])).includes(v));
        this.data.rows[i][k] = ins;
        this.data.rows[i][`${k}_other`] = odds.join(',');
      });
			this.data.rows[i] = new Sample(this.data.rows[i]);

		}
	}

	typeNumberToText(type, input): string {
	  if (!['sp_type', 'sp_rocktype', 'sp_rockcomp'].includes(type)) {
	    // error type not found
      console.log(`error ${type} not found`);
      return '';
    }
    else {
	    if (isNaN(input)) {console.log('there');return input;
      }
	    else {
	      console.log(Sample.schema[type]['checkboxes'][+input - 1]);
	      return Sample.schema[type]['checkboxes'][+input - 1];
      }
    }
  }
}
