import {Injectable} from '@angular/core';
import {BaseService} from "./base.service";
import {ChangeDetectionStrategy, Output, EventEmitter, Component, OnDestroy, OnInit} from '@angular/core';
import {FileUploader} from "ng2-file-upload/ng2-file-upload";
// import {read, IWorkBook} from "ts-xlsx";
// import {IWorkSheet} from "xlsx";
import {Observable, Subject, Subscription} from "rxjs";

import * as XLSX from 'xlsx';
// declare var XLSX: any;
declare var $: any;

interface ExcelSheet {
	columns: string[],
	rows: any[],
}

@Injectable()
export class ExcelReaderService extends BaseService {

	rABS = true;
	data: ExcelSheet;
	file_input_id = '';
	form_div_id = '';
	form_form_id = '';
	formData = {};
	callbackOnData: any;
	constructor() {
		super();
		this.data = null;
		this.callbackOnData = null;
	}

	fixdata(data) {[]
		var o = "", l = 0, w = 10240;
		for(; l<data.byteLength/w; ++l) o+=String.fromCharCode.apply(null,new Uint8Array(data.slice(l*w,l*w+w)));
		o+=String.fromCharCode.apply(null, new Uint8Array(data.slice(l*w)));
		return o;
	}

	// to be overriden
	// TODO: change this
	// this will get the first worksheet and return the json values
	workbookHandle(wb) {
		var first_sheet_name = wb.SheetNames[0];
		var address_cell = 'A1';
		var ws = wb.Sheets[first_sheet_name];
		// let firstRowRange = ws['!ref'].split(':')[1];
		let firstRow = [];
		let range = XLSX.utils.decode_range(ws['!ref']);
		// for(let R = range.s.r; R <= range.e.r; ++R) {
		let R = 0;
		for(let C = range.s.c; C <= range.e.c; ++C) {
			let cell_address = {c:C, r:R};
			let cell = ws[XLSX.utils.encode_cell(cell_address)];
			// console.log(cell);
			if (cell) {
				let val = cell.v;
				// TODO: this should be done in concrete class instead of here :(

				firstRow.push(val);
			}
			else {
				break;
			}
		}
		// }

		//
		console.log(XLSX.utils.sheet_to_json(ws));
		// this.data = XLSX.utils.sheet_to_json(ws);
		let rows = XLSX.utils.sheet_to_json(ws);
		// this.data.unshift(firstRow);
		for (let i = 1; i < rows.length; i++) {
			firstRow.forEach(k => {
				// this.data[i][newKey] = this.data[i][k];
				if (!rows[i].hasOwnProperty(k)) {
					rows[i][k] = null;
				}
				else {
					if(!isNaN(rows[i][k])) {
						//	if is is num
						rows[i][k] = Number(rows[i][k]);
					}
				}

			});
		}
		this.data = {
			columns: firstRow,
			rows: rows,
		};
		console.log(this.data);

		// return this.data;
	}

	retrieveData() {
		return this.data;
	}

	dataHandle() {
		// to be overriden
	}

	// to be attach to onchange event of file input!
	// TODO: attach the loading panel here for onload
	handleFile(e, callback = null) {
		var files = e.target.files;
		var i,f;
		this.callbackOnData = callback;

		// FIXME loading things....
		// window.ngGlobalService.setAppLoading(true);

		for (i = 0; i != files.length; ++i) {
			f = files[i];
			var reader = new FileReader();
			var name = f.name;
			var parts = name.split('.');
			// console.log(parts);
			if (parts[parts.length - 1].toLowerCase() !== 'xls' && parts[parts.length - 1].toLowerCase() !== 'xlsx'){
				alert('Must select .xls or .xlsx file!');
				return;
			}
			reader.onload = (e: any) => {
				var data = e.target.result;
				// var data = null;

				var workbook;
				if(this.rABS) {
					/* if binary string, read with type 'binary' */
					workbook = XLSX.read(data, {type: 'binary'});
				} else {
					/* if array buffer, convert to base64 */
					var arr = this.fixdata(data);
					workbook = XLSX.read(btoa(arr), {type: 'base64'});
				}

				/* DO SOMETHING WITH workbook HERE */
				this.workbookHandle(workbook);
				// window.ngGlobalService.setAppLoading(false);

			};
			reader.readAsBinaryString(f);
		}
	}

	attachChangeEventHandler(file_input_id) {
		this.file_input_id = file_input_id;
		// document.getElementById(file_input_id).addEventListener('change', _this.handleFile, false);
		$(`#${file_input_id}`).on('change', (e) => {
			// console.log('test');
			this.handleFile(e);
		})
	}


	attachFormDivId(id) {
		this.form_div_id = id;
	}
	attachFormFormId(id) {
		this.form_form_id = id;
	}

	// SET OF FILE FORM INPUT CONTROLLER -- dialog controller
	dismiss() {
		$(`div#${this.form_div_id}`).modal("hide");
	}

	clearForm() {
		this.formData = {};
	}

	openForm() {
		this.clearForm();
		$(`div#${this.form_div_id}`).modal("show");
	}

	// TO BE OVERRIDE
	confirmForm() {
		if ($(`#${this.file_input_id}`).prop('value') == "") {
			alert('You must select an excel file!');
			return;
		}
	}
}
