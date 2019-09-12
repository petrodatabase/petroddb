import {Component} from '@angular/core';
import {MdSnackBar} from '@angular/material';

@Component({
  moduleId: module.id,
  selector: 'card-a11y',
  templateUrl: 'sampleElements/a11y/card/card-a11y.html',
  styleUrls: ['card-a11y.css'],
})
export class CardAccessibilityDemo {
  showProgress: boolean = false;

  constructor(private snackBar: MdSnackBar) {}

  openSnackbar(message: string) {
    this.snackBar.open(message, '', {duration: 2000});
  }
}
