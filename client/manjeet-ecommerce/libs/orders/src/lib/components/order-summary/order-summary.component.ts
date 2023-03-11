import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';

import { ProductService } from '@manjeet-ecommerce/products';
import { AuthService } from '@manjeet-ecommerce/users';
import { Subscription, takeUntil, Subject } from 'rxjs';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'orders-order-summary',
  templateUrl: './order-summary.component.html',
  styles: [],
})
export class OrderSummaryComponent implements OnInit, OnDestroy {
  @Output() loadingEmitter = new EventEmitter(true);
  subscription: Subscription;
  subs$: Subject<any> = new Subject();
  @Input() totalPrice: number;
  isCheckout = false;
  currency: string = 'INR';
  serverErrMsg: String;
  isLoading = false;

  constructor(
    private router: Router,
    private cartService: CartService,
    private productService: ProductService,
    private authService: AuthService
  ) {
    this.router.url.includes('checkout') ? (this.isCheckout = true) : (this.isCheckout = false);
  }

  ngOnInit(): void {
    this._getOrderSummary();
  }

  _getOrderSummary() {
    // if user is not logged in
    if (!this.authService.isUserLoggedIn()) {
      this.subscription = this.cartService.cart$.pipe(takeUntil(this.subs$)).subscribe((cart) => {
        this.totalPrice = 0;
        if (cart && cart.items.length > 0 && this.totalPrice === 0) {
          this.isLoading = true;
          this.loadingEmitter.emit(this.isLoading);
          cart.items.map((item) => {
            this.productService.getProduct(item.productId).subscribe(res => {
              this.totalPrice += +res.product.price * item.quantity;
              this.currency = res.product.currency;
              this.isLoading = false;
              this.loadingEmitter.emit(this.isLoading);
            }, err => {
              this.isLoading = false;
              this._errorHandler(err);
              this.loadingEmitter.emit(this.isLoading);
            })

          });
        }
      });
    }
    else {
      this.subscription = this.cartService.serverCart$.pipe(takeUntil(this.subs$)).subscribe((cart: {totalPrice: number, quantity: number}) => {
        this.totalPrice = cart.totalPrice;
      })
    }
  }

  private _errorHandler(err: HttpErrorResponse) {
    if (err.error['message']) {
      this.serverErrMsg = err.error['message'];
    } else {
      this.serverErrMsg = 'An error occured. Please try again!';
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subs$.next(null);
    this.subs$.complete();
  }
}

