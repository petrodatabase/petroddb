import { Component, OnInit,Inject,OnDestroy } from '@angular/core';
import {LoadingService} from "../services/loading.service";
import {Title} from "@angular/platform-browser";
@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.css']
})
export class TutorialComponent implements OnInit,OnDestroy {

  constructor(private loadingService: LoadingService,
              private titleService: Title,
              ) {
  }

  ngOnInit() {
    this.setTitle("Tutorials");
    this.loadingService.handleLoading(false);
  }

  ngOnDestroy(){
    this.setTitle("Volcano Petrology");
  }


  public setTitle( newTitle: string) {
    this.titleService.setTitle( newTitle );
  }

  toggleVideo(event){
    var targetId = event.currentTarget.id;
    console.log(targetId);
    let getObjectByClass = document.getElementsByClassName(targetId) as HTMLCollectionOf<HTMLElement>;
    let getAllObjectByClass = document.getElementsByClassName("videoTut") as HTMLCollectionOf<HTMLElement>;
    var i =0;
    for (i=0; i<getAllObjectByClass.length; i++){
      getAllObjectByClass[i].style.display = "none";
    }

    getObjectByClass[0].style.display = "block"

  }


}
