import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '@manjeet-ecommerce/users';
import { ORDER_STATUS } from 'libs/orders/src/order.constants';
import { OrderItem } from '../../models/order-item.model';
import { Order } from '../../models/order.model';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'orders-checkout',
  templateUrl: './checkout.component.html',
  styles: [],
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup: FormGroup;
  isSubmitted = false;
  orderItems: OrderItem[] = [];
  userId = '63f24d93adada1a56d71dc2b';
  countries:{_id: string, name: string}[] = [];
  serverErrMsg: string;

  constructor(
    private router: Router,
    private usersService: UserService,
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private ordersService: OrderService
  ) {}

  ngOnInit(): void {
    this._initCheckoutForm();
    this._getCartItems();
    this._getCountries();
  }

  private _initCheckoutForm() {
    this.checkoutFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      phone: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      zip: ['', Validators.required],
      apartment: ['', Validators.required],
      street: ['', Validators.required]
    });
  }

  private _getCartItems() {
    const cart = this.cartService.getCartItems();
    this.orderItems = cart.items
  }

  private _getCountries() {
    this.countries = this.usersService.getCountries();
  }

  backToCart() {
    this.router.navigate(['/cart']);
  }

  placeOrder() {
    this.isSubmitted = true;
    if (this.checkoutFormGroup.invalid) {
      return;
    }
    const order: Order = {
      orderItems: this.orderItems,
      address: {
        shippingAddress1: this.f['street'].value,
        shippingAddress2: this.f['apartment'].value,
        city: this.f['city'].value,
        zip: this.f['zip'].value,
        country: this.f['country'].value,
        phone: this.f['phone'].value
      },
      status: Object.keys(ORDER_STATUS)[0],
      userId: this.userId,
      _id: 'userIdwillautomaticallycreatedonserver',
      dateOrdered: `${Date.now()}`
    };
    this.ordersService.postOrder(order).subscribe(
      (res) => {
        //redirect to thank you page // payment
        this.cartService.emptyCart();
        this.router.navigate(['/success']);
      },
      (err) => {
        //display some message to user
        this._errorHandler(err);
      }
    );
  }

  get f() {
    return this.checkoutFormGroup.controls;
  }

  private _errorHandler(err: HttpErrorResponse) {
    if (err.error['message']) {
      this.serverErrMsg = err.error['message'];
    } else {
      this.serverErrMsg = 'An error occured. Please try again!';
    }
  }
}
