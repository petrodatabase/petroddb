import {Observable} from 'rxjs/Observable';
import "rxjs/add/observable/of";
import { FirebaseListObservable } from 'angularfire2/database';
import {observable} from 'rxjs/symbol/observable';

/* Because Firebase and Mongo use different key standard so we merge them */
export function normalizeGetObjectList(res){
  return res.map((obj) => {
    obj['$key'] = obj['_id'];
    return obj;
  });
}

export function normalizeGetObject(res){
    res['$key'] = res['_id'];
    return res;
}

export function filterObjects(array, singleQuery) {
  if (singleQuery)
  { const QueryKey = Object.keys(singleQuery)[0];
    return array.filter((input) => (input[QueryKey]===singleQuery[QueryKey]));
  }
  return array;
}

export function isFirebase(key:string){
  if (key.startsWith("-")){
    return true;
  }
  return false;
}


export function filterObjectsMultipleQuery(array, Queries) {
  // if object is empty
  if (Object.keys(Queries).length === 0 && Queries.constructor === Object){
    return array;
  }
  else
  { const QueryKey = Object.keys(Queries)[0];
    return array.filter((input) => {
      let finalFlag = false ;
      for ( let item of Queries[QueryKey]){
      finalFlag = finalFlag || (input[QueryKey]===item)
      }
      return finalFlag;
    });
  }
}
