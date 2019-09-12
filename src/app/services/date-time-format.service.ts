import {Injectable} from '@angular/core';
import {isUndefined} from "util";

@Injectable()
export class DateTimeFormatService {

	ad_date_regex = /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/ ;

	bc_year_regex = /^-\d+$/;

	ad_date_alert = "Date time format must be DD/MM/YYYY";
	ad_bc_date_alert = "Date time format must be DD/MM/YYYY or a negative integer for BC year";
	constructor() {
	}

	validateBcYear(val: string): boolean {
		return this.bc_year_regex.test(val);
	}

	validate(val: string, allow_bc: boolean = true): boolean {
		// var date_regex = /^\d{2}\/\d{2}\/\d{4}$/ ;
		// var date_regex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/\d{4}$/ ;
		if (allow_bc && this.validateBcYear(val)) return true;

		return this.ad_date_regex.test(val);
	}

	//  later first <=> later is smaller
	// TODO: reason is to put the latest value on top
	sortOnDateTime(a: string, b: string, later_smaller: boolean = true, allow_bc: boolean = true): number {
		if (a == b) return 0;
		else {
			if (this.validateBcYear(a) && this.validateBcYear(b)) {
				return later_smaller ? +b - +a : +a - +b;
			}
			else if (this.validateBcYear(a) && !this.validateBcYear(b)) return later_smaller ? 1 : -1;
			else if (!this.validateBcYear(a) && this.validateBcYear(b)) return later_smaller ? -1 : 1;
			else {
				// both AD
				const as = a.split('/'); // assume dd/mm/YYYY
				const bs = b.split('/'); // assume dd/mm/YYYY
				if (+as[2] != +bs[2]) return later_smaller ? +bs[2] - +as[2] : +as[2] - +bs[2];
				else {
					if (+as[1] != +bs[1]) return later_smaller ? +bs[1] - +as[1] : +as[1] - +bs[1];
					else {
						return later_smaller ? +bs[0] - +as[0] : +as[0] - +bs[0];
					}
				}
			}
		}
	}

	pad (str, max) {
		if (typeof str === "undefined" || str == null || str == "null" || str == "") {
			str = "1";
		}
		return str.length < max ? this.pad("0" + str, max) : str;
	}


	transformDateFormat(dd, mm, yyyy): string {
		return `${this.pad(dd, 2)}/${this.pad(mm, 2)}/${this.pad(yyyy, 4)}`;
	}

	// only on transforming old data -> new
	convertDate(date, date_bc?) {
		// from YYYY-MM-DD HH:mm:ss or BC -> new form data
		if (date_bc == null || date_bc == "null" || date_bc == "") {
			date_bc = "0";
		}
		if (date == null || date == "null" || date == "") {
			date = "0000-00-00";
		}
		if (this.validate(date)) return date;

		if (+date_bc < 0) {
			return date_bc;
		}
		else {
			const parts = date.split(' ')[0].split('-');
			if (+parts[0] == 9999) {
				parts[0] = "0000";
				parts[1] = "01";
				parts[2] = "01";
			}
			if (+parts[1] == 0 || +parts[1] > 12) {
				parts[1] = "01";
			}
			if (+parts[2] == 0 || +parts[2] > 31) {
				parts[2] = "01";
			}
			return this.transformDateFormat(parts[2], parts[1], parts[0]);
		}
	}

}
