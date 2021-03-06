import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MdDatepickerInputEvent} from '@angular/material';


@Component({
  moduleId: module.id,
  selector: 'datepicker-demo',
  templateUrl: 'sampleElements/datepicker/datepicker-demo.html',
  styleUrls: ['datepicker-demo.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatepickerDemo {
  touch: boolean;
  filterOdd: boolean;
  yearView: boolean;
  inputDisabled: boolean;
  datepickerDisabled: boolean;
  minDate: Date;
  maxDate: Date;
  startAt: Date;
  date: Date;
  lastDateInput: Date | null;
  lastDateChange: Date | null;

  dateFilter = (date: Date) => date.getMonth() % 2 == 1 && date.getDate() % 2 == 0;

  onDateInput = (e: MdDatepickerInputEvent<Date>) => this.lastDateInput = e.value;
  onDateChange = (e: MdDatepickerInputEvent<Date>) => this.lastDateChange = e.value;
}
