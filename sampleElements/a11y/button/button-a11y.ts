import {Component} from '@angular/core';


@Component({
  moduleId: module.id,
  selector: 'button-a11y',
  templateUrl: 'sampleElements/a11y/button/button-a11y.html',
  styleUrls: ['button-a11y.css'],
})
export class ButtonAccessibilityDemo {
  counter: number = 0;

  increase() {
    this.counter++;
  }
}
