import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../models/user";
import {PlainUser} from "../../models/plain-user";
import {AuthService} from "../auth.service";
import {AlertService} from "../../components/alert-dialog/alert.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  @Output()
  onConfirm = new EventEmitter<PlainUser>();

  loginLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private alertService: AlertService,
  ) {
  }

  ngOnInit() {
    this.loginLoading = false;
    this.loginForm = new FormGroup({
      email: new FormControl({value: '', disabled: this.loginLoading}, [
        Validators.required,
        Validators.email
      ], ),
      password: new FormControl({value: '', disabled: this.loginLoading}, [
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6),
        Validators.maxLength(25),
        Validators.required
      ]),
    });
  }

  onSubmit() {
    console.log(this.loginForm);
    // let user = new User(this.loginForm.value);

    // signup man and close the form!
    let plainUser = new PlainUser(this.loginForm.value);
    this.loginLoading = true;
    this.authService.logInWithEmailAndPassword(plainUser,
      (credential) => {
          this.loginForm.reset();
          this.loginLoading = false;
          this.onConfirm.emit(plainUser);
      },
      (error) => {
          this.loginForm.reset();
          this.loginLoading = false;

          this.alertService.openAlert(`Error: ${error}`, `ERROR on login`);
      });
  }

}
