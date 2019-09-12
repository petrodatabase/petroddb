import {EventEmitter, Injectable} from '@angular/core';
import {BaseService} from "./base.service";
import {Error} from "../models/error";

@Injectable()
export class ErrorService extends BaseService {

	errorOccurred = new EventEmitter<Error>();
	constructor() {
		super();
	}

	handleError(error: any) {
		console.log(error);
		let errorData = new Error(error);
		this.errorOccurred.emit(errorData);
	}

}
