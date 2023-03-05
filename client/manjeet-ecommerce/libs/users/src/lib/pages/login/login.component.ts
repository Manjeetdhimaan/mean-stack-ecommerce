import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService, LoginResponse } from '../../services/auth/auth.service';

@Component({
  selector: 'user-login',
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  isSubmitted = false;
  errMsg: string;

  constructor( private authService: AuthService, private router: Router ) {}

  ngOnInit(): void {
      this._initForm();
  }

  get f() {
    return this.loginForm.controls;
  }

  private _initForm() {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(4)]),
    })
  }

  onSubmitForm() {
    this.isSubmitted = true;
    this.errMsg = '';
    if(!this.loginForm.valid) return;

    this.authService.login(this.loginForm.value.email, this.loginForm.value.password)
    .subscribe((res: LoginResponse) => {
      if(res.success) {
        this.authService.setToken(res['token']);
        this.router.navigate(['/']);
      }
    }, err => {
      this._errorHandler(err);
    });
  }

  private _errorHandler(err: HttpErrorResponse) {
    if (err.error['message']) {
      this.errMsg = err.error['message'];
    } else {
      this.errMsg = 'An error occured. Please try again!';
    }
  }
}
