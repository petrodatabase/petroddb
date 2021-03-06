import {Component} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'datepicker-a11y',
  templateUrl: 'sampleElements/a11y/datepicker/datepicker-a11y.html',
  styleUrls: ['datepicker-a11y.css'],
})
export class DatepickerAccessibilityDemo {
  birthday: Date;
  maxBirthday = new Date();

  paymentDate = new Date(Date.now() + 48 * 60 * 60 * 1000);
  minPaymentDate = new Date(Date.now() + 48 * 60 * 60 * 1000);

  departDate: Date;
  returnDate: Date;
  minTripDate = new Date();
  maxTripDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
  startTripDate = new Date(Date.now() + 31 * 24 * 60 * 60 * 1000);

  appointmentDate: Date;
  minAppointmentDate = new Date();
  maxAppointmentDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
  weekdaysOnly = (d: Date) => d.getDay() != 0 && d.getDay() != 6;
}
