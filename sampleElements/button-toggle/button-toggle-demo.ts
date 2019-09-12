import {Component} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'button-toggle-demo',
  templateUrl: 'sampleElements/button-toggle/button-toggle-demo.html'
})
export class ButtonToggleDemo {
  isVertical = false;
  isDisabled = false;
  favoritePie = 'Apple';
  pieOptions = [
    'Apple',
    'Cherry',
    'Pecan',
    'Lemon',
  ];
}
