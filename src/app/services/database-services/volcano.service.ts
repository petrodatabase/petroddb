import {Injectable} from '@angular/core';
import {BaseService} from "../base.service";
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2/database";
import {AngularFireAuth} from "angularfire2/auth";
import {Volcano} from "../../models/volcano";
import {Observable} from "rxjs/Observable";
import {Observer} from "rxjs/Observer";
import {DateTimeFormatService} from "../date-time-format.service";
import {AlertService} from "../../components/alert-dialog/alert.service";
import {normalizeGetObjectList} from '../../../utils/dataConvertHelper';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class VolcanoService extends BaseService {

  // public basePath: '/volcanos';
  private basePath: string = '/volcanos';
  private timePath: string = '/volcano_time_update'; // store the timestamp whenever a the database is uploaded
  private storagePath: string = 'volcanoListAll';
  private storageTime: string = 'volcanoListAllTime';
  private localStorageObservable: Observable<Volcano[]>;

  // private localStorageObservable: Observable<Volcano[]>;

  constructor(private afDB: AngularFireDatabase,
              private afAuth: AngularFireAuth,
              private datetimeService: DateTimeFormatService,
              private alertService: AlertService,
              private http: HttpClient,) {
    super();
    this.volcanos = this.afDB.list(this.basePath);
    this.volcano = this.afDB.object(this.basePath);
    // this.localStorageObservable =
  }

  volcanos: FirebaseListObservable<Volcano[]> = null;
  volcano: FirebaseObjectObservable<Volcano> = null;

  // getVolcanosList(query: any = {}): FirebaseListObservable<Volcano[]> {
  getVolcanosList(query: any = {}): Observable<Volcano[]> {
    this.volcanos = this.afDB.list(this.basePath, {
      query: query
    });
    return this.volcanos;
  }

  getVolcanosListWithLocal(query: any = {}): Observable<Volcano[]> {
    if (!this.localStorageObservable) {
      this.localStorageObservable = new Observable(observer => {
        let localListTime = JSON.parse(localStorage.getItem(this.storageTime));
        let localList = localStorage.getItem(this.storagePath);

        if (!!localListTime && !!localList && JSON.stringify(query) === '{}') {
          // check for new time from DB
          this.afDB.object(`${this.timePath}`)
            .subscribe(
              (time: any) => {
                time = time.$value;
                // console.log(time);
                if (time && time > localListTime) {
                  // load new and store in local storage
                  console.log(`Volcano time out dated: ${time} - ${localListTime}. Loading new volcano DB`);
                  this.retrieveAllVolcanosFromDB(observer);
                }
                else {
                  // return the localList
                  console.log(`Get local volcanos with time ${time}`);
                  observer.next(JSON.parse(localList));
                  observer.complete();
                }
              },
            );
        }
        else {
          // subscribe to db, next when return
          console.log('No local storage');
          this.retrieveAllVolcanosFromDB(observer);
        }
      });
    }
    return this.localStorageObservable;
  }

  retrieveAllVolcanosFromDB(observer: Observer<Volcano[]>, time?: number): void {
    this.afDB.list(this.basePath, {})
      .take(1)
      .subscribe(
        (vols) => {
          console.log(`Vol from database`);
          vols.sort((a, b) => {
            if (a.vd_name.toLowerCase() > b.vd_name.toLowerCase()) return 1;
            if (a.vd_name.toLowerCase() < b.vd_name.toLowerCase()) return -1;
            else return 0;
          });
          if (!!time) {
            // write straight away
            this.writeToLocalStorage(vols, time);
          }
          else {
            this.afDB.object(this.timePath)
              .subscribe(
                time => {
                  this.writeToLocalStorage(vols, time.$value);
                }
              );
          }
          observer.next(vols);
        },
        error => {
          observer.error(error);
        },
        () => {
          observer.complete();
        }
      );
  }

  updateTime() {
    this.afDB.object(this.timePath).set((new Date()).getTime());
  }

  writeToLocalStorage(vols: Volcano[], time: number) {
    console.log('Write to local storage');
    // console.log(vols);
    // TODO: workaround to to append enumerable $key to json
    // console.log(JSON.stringify(vols[0]));
    let k;
    vols.map(v => {
      k = v['$key'];
      delete v['$key'];
      v['$key'] = k;
    });
    // console.log(JSON.stringify(vols[0]));

    localStorage.setItem(this.storagePath, JSON.stringify(vols));
    localStorage.setItem(this.storageTime, JSON.stringify(time));
  }

  getVolcano(key: string): FirebaseObjectObservable<Volcano> {
    const itemPath = `${this.basePath}/${key}`;
    this.volcano = this.afDB.object(itemPath);
    return this.volcano;
  }

  createVolcano(vol: Volcano, callback: any = null): firebase.database.ThenableReference {
    return this.volcanos.push(vol.toFirebaseJsonObject(vol, Volcano.schema))
      .then((ref: firebase.database.ThenableReference) => {
        this.updateTime();
        if (callback) {
          callback(ref);
        }
      })
      .catch(error => this.handleError(error));
  }

  createVolcanoList(vols: Volcano[], callback: any = null): firebase.Promise<any> {
    let updates = {};
    let id = '';
    vols.forEach(vol => {
      id = this.afDB.database.ref(`${this.basePath}`).push().key;
      updates[id] = vol.toFirebaseJsonObject();
      vol.$key = id;
    });
    return this.afDB.database.ref(`${this.basePath}`).update(updates)
      .then((ref) => {
        this.updateTime();
        if (callback) {
          callback(ref);
        }
      })
      .catch(error => this.handleError(error));
  }

  updateVolcano(key: string, value: any): firebase.Promise<any> {
    return this.volcanos.update(key, value)
      .then((_) => {
        this.updateTime();

      })
      .catch(error => this.handleError(error));
  }

  // update volcano with the entire volcano
  // updatevolcano(sp: volcano): void {
  //
  // }

  deleteVolcano(key: string): void {
    this.volcanos.remove(key)
      .then(_ => {
        this.updateTime();
      })
      .catch(error => this.handleError(error));
  }

  deleteAll(): void {
    this.volcanos.remove()
      .then(_ => {
        this.updateTime();
      })
      .catch(error => this.handleError(error));
  }



  // NOTE: THIS CODE BELOW IS FOR MONGODB VERSION -MAY NOT USE BECAUSE WILL LET FIREBASE DO THE LOGIC
  getVolcanoListMongo() {
    const uri = this.globals.serverHost +'/volcanos';
    if (localStorage.getItem('volcanos')){
      return Observable.of(JSON.parse(localStorage.getItem('volcanos')));
    }
    else{
      return this
        .http
        .get(uri)
        .map(res => {
          localStorage.setItem('volcanos', JSON.stringify(normalizeGetObjectList(res)));
          return normalizeGetObjectList(res);
        });
    }
  }

  validateInput(vol: Volcano): boolean {
    if (!this.validateDateTime(vol, 'vd_inf_stime')) return false;
    if (!this.validateDateTime(vol, 'vd_inf_etime')) return false;
    if (!this.validateDateTime(vol, 'vd_pubdate')) return false;
    if (!this.validateDateTime(vol, 'vd_loaddate')) return false;

    if (vol.vd_name == '' || !vol.vd_name || vol.vd_name == 'null') {
      this.alertService.openAlert(`Project name must not be empty`, `Invalid Input`);
      return false;
    }

    else return true;
  }

  validateDateTime(vol: Volcano, key: string): boolean {
    if (vol[key] != '' && !this.datetimeService.validate(vol[key])) {
      try {
        vol[key] = this.datetimeService.convertDate(vol[key]);
      }
      catch (e) {
        this.alertService.openAlert(`Date time format of ${Volcano.schema[key]['placeholder']} must be DD/MM/YYYY`, `Invalid Input`);
        return false;
      }

    }
    return true;
  }

}
