import {Component, Inject, OnInit} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from "@angular/material";
import {ConfirmConfig} from "../confirm-dialog/confirm-dialog.component";

export interface AlertConfig {
  content: string;
  title: string;
}

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.css']
})
export class AlertDialogComponent implements OnInit {

  constructor(public dialogRef: MdDialogRef<AlertDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: AlertConfig,) {
  }

  ngOnInit() {
  }

  onCloseCancel() {
    this.dialogRef.close({
      data: false,
    });
  }

}
