import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../models/user";
import {AuthService} from "../auth.service";
import {AlertService} from "../../components/alert-dialog/alert.service";

@Component({
	selector: 'app-forget-password',
	templateUrl: './forget-password.component.html',
	styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

	forgetForm: FormGroup;
	constructor(
	  private authService: AuthService,
    private alertService: AlertService,
  ) {
	}


	ngOnInit() {
		this.forgetForm = new FormGroup({
			// us_name: new FormControl(null, Validators.required),
			email: new FormControl(null, [Validators.required, Validators.email]),
			// us_is_pi, us_is_co.....
		});
	}

	onSubmit() {
		// console.log(this.signupForm);
		let user = new User(this.forgetForm.value);
		console.log(user);
		// this.authService.signup(user)
		// 	.subscribe(
		// 		data => {
		// 			console.log(data);
		// 		},
		// 		err => {
		// 			console.log(err);
		// 		}
		// 	);
    this.authService.resetPassword(this.forgetForm.value['email']);
		this.forgetForm.reset();
	}
}
