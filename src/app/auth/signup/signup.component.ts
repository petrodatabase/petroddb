import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../models/user";
import {AuthService} from "../auth.service";
import {PlainUser} from "../../models/plain-user";
import {AlertService} from "../../components/alert-dialog/alert.service";
import {UserService} from "../../services/database-services/user.service";

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

	signupForm: FormGroup;
	signupLoading: boolean = false;

	@Output()
  onConfirm = new EventEmitter<User>();

	constructor(
	  private authService: AuthService,
    private userService: UserService,
    private alertService: AlertService,
	) {
	}

	ngOnInit() {
	  this.signupLoading = false;
		this.signupForm = new FormGroup({
			us_first: new FormControl({value: '', disabled: this.signupLoading}, Validators.required),
			us_family: new FormControl({value: '', disabled: this.signupLoading}, Validators.required),
			us_name: new FormControl({value: '', disabled: this.signupLoading}, Validators.required),
			email: new FormControl({value: '', disabled: this.signupLoading}, [Validators.required, Validators.email]),
			us_password: new FormControl({value: '', disabled: this.signupLoading}, [
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6),
        Validators.maxLength(25),
        Validators.required
      ]),
			// us_is_pi, us_is_co.....
		});

	}

	onSubmit() {
		// console.log(this.signupForm);
		let user = new User(this.signupForm.value);
		let plainUser = new PlainUser({
      email: user.email,
      password: this.signupForm.value.us_password
    });
		console.log(user);
		console.log(plainUser);
		this.signupLoading = true;
		this.authService.signUpWithEmailAndPassword(user, plainUser,
      (credential) => {
		      user.$key = credential.uid;
          this.signupForm.reset();
          this.signupLoading = false;
          this.onConfirm.emit(user);
      },
      (error) => {
          this.signupForm.reset();
          this.signupLoading = false;
          this.alertService.openAlert(`Error: ${error}`, `ERROR on login`);
      }
    );
		// this.authService.signup(user)
		// 	.subscribe(
		// 		data => {
		// 			console.log(data);
		// 		},
		// 		err => {
		// 			console.log(err);
		// 		}
		// 	);
		// this.signupForm.reset();
	}

}
