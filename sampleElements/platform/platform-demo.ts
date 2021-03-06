import {Component} from '@angular/core';
import {Platform, getSupportedInputTypes} from '@angular/material';


@Component({
  moduleId: module.id,
  selector: 'platform-demo',
  templateUrl: 'sampleElements/platform/platform-demo.html',
})
export class PlatformDemo {
  supportedInputTypes = getSupportedInputTypes();

  constructor(public platform: Platform) {}
}
