import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {Globals} from '../globals';

@Injectable()
export class BaseService {
  globals: Globals;
  public globalUrl: string = environment.serverHost;

  constructor() {
    this.globals = new Globals();

  }

  handleError(error: any) {
    console.log(error);
  }

  validateInput(val?: any): any {
    return true
  }

}

