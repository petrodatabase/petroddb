import {Component} from '@angular/core';


@Component({
  moduleId: module.id,
  selector: 'button-toggle-a11y',
  templateUrl: 'sampleElements/a11y/button-toggle/button-toggle-a11y.html',
  styleUrls: ['button-toggle-a11y.css'],
})
export class ButtonToggleAccessibilityDemo {
  favoritePie = 'Apple';
  pieOptions = [
    'Apple',
    'Cherry',
    'Pecan',
    'Lemon',
  ];
}
