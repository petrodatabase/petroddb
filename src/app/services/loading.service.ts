import {EventEmitter, Injectable} from '@angular/core';
import {BaseService} from "./base.service";

@Injectable()
export class LoadingService extends BaseService {

	isLoading = new EventEmitter<boolean>();
	constructor() {
		super();
	}

	handleLoading(isLoading: boolean) {
		// console.log(error);
		// let errorData = new Error(error);
		this.isLoading.emit(isLoading);
	}
}
