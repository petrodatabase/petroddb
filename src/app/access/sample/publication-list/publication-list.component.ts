import {Component, Input, OnInit} from '@angular/core';
import {Sample} from "../../../models/sample";
import {AlertService} from "../../../components/alert-dialog/alert.service";
import {ConfirmService} from "../../../components/confirm-dialog/confirm.service";
import {PublicationService} from "../../../services/database-services/publication.service";
import {ReferenceService} from "../../../services/database-services/reference.service";
import {Publication} from "../../../models/publication";

@Component({
  selector: 'app-publication-list',
  templateUrl: './publication-list.component.html',
  styleUrls: ['./publication-list.component.css']
})
export class PublicationListComponent implements OnInit {
  
  _sample: Sample;
  @Input()
  set sample(sp: Sample) {
    this._sample = sp;
    this.loadReferences();
    // this.loadAllPubs();
  }
  
  loaded: boolean = false;
  pubList: Publication[];
  // only be retrieved when adding new publications
  
  allPubList: Publication[];

  constructor(
    private alertService: AlertService,
    private confirmService: ConfirmService,
    private pubService: PublicationService,
    private refService: ReferenceService,
  ) {
    this.pubList = null;
    this.allPubList = null;
  }

  ngOnInit() {
  }
  
  referenceKeys: any[];
  
  loadReferences() {
    
    this.loaded = false;
    this.refService.getPubKeysList(this._sample.$key)
      .subscribe(
        (objs: any[]) => {
          // console.log(objs);
          if (!objs || objs.length == 0) {
            this.loaded = true;
          }
          this.referenceKeys = objs;
          this.pubList = [
            // new Publication({$key: '12412421', cb_auth: 'dasfwasgsa'})
          ];
          objs.map(v => v.key).forEach((k, i) => {
            this.pubService.getPublication(k)
              .subscribe(
                (pub: Publication) => {
                  this.pubList.push(new Publication(pub));
                  if (i >= objs.length - 1) {
                    this.loaded = true;
                  }
                  // console.log(this.pubList);
                }
              );
          })
        }
      );
  }
  
  loadAllPubs() {
    this.pubService.getPublicationsList()
      .subscribe(
        (pubs: Publication[]) => {
          this.allPubList = pubs.map(v => new Publication(v));
        }
      );
  }
  
  onAllSelected(keys: string[]) {
    console.log(keys);
    keys.filter(k => !this.pubList.map(v => v.$key).includes(k)).forEach(k => {
      this.refService.createPubKey(this._sample.$key, k);
    })
  }
  
  onDeletedSelected(keys: string[]) {
    console.log(keys);
    keys.map(k => this.referenceKeys.find(v => v.key == k)['$key']).forEach(k => {
      this.refService.deletePubKey(this._sample.$key, k);
    })
  }
}
