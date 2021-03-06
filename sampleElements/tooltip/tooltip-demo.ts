import {Component, ViewEncapsulation} from '@angular/core';
import {TooltipPosition} from '@angular/material';


@Component({
  moduleId: module.id,
  selector: 'tooltip-demo',
  templateUrl: 'sampleElements/tooltip/tooltip-demo.html',
  styleUrls: ['tooltip-demo.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TooltipDemo {
  position: TooltipPosition = 'below';
  message: string = 'Here is the tooltip';
  disabled = false;
  showDelay = 0;
  hideDelay = 1000;
  showExtraClass = false;
}
