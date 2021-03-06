import {Component} from '@angular/core';


@Component({
  moduleId: module.id,
  selector: 'progress-spinner-demo',
  templateUrl: 'sampleElements/progress-spinner/progress-spinner-demo.html',
  styleUrls: ['progress-spinner-demo.css'],
})
export class ProgressSpinnerDemo {
  progressValue = 60;
  color = 'primary';
  isDeterminate = true;

  step(val: number) {
    this.progressValue = Math.max(0, Math.min(100, val + this.progressValue));
  }

}
