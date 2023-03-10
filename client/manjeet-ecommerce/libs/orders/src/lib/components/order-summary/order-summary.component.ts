import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { ProductService } from '@manjeet-ecommerce/products';
import { Subscription, takeUntil, Subject } from 'rxjs';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'orders-order-summary',
  templateUrl: './order-summary.component.html',
  styles: [],
})
export class OrderSummaryComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  subs$: Subject<any> = new Subject();
  totalPrice: number;
  isCheckout = false;
  currency: string = 'INR'
  constructor(
    private router: Router,
    private cartService: CartService,
    private productService: ProductService
  ) {
    this.router.url.includes('checkout') ? (this.isCheckout = true) : (this.isCheckout = false);
  }

  ngOnInit(): void {
    this._getOrderSummary();
  }

  _getOrderSummary() {
    // if user is not logged in
    this.subscription = this.cartService.cart$.pipe(takeUntil(this.subs$)).subscribe((cart) => {
      this.totalPrice = 0;
      if (cart) {
        cart.items.map((item) => {
          this.productService.getProduct(item.productId).subscribe(res => {
            this.totalPrice += +res.product.price * item.quantity;
          })
        });
        // console.log(this.quantity)
        // this.productService.getProducts(undefined, this.productIds).subscribe(res => {
        //   res.products.map(product => {
        //     this.totalPrice += +product.price;
        //     this.currency = product.currency;
        //   });
        //   console.log(this.totalPrice)
        // })
      }
    });


  }

  navigateToCheckout() {
    this.router.navigate(['/checkout']);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subs$.next(null);
    this.subs$.complete();
  }
}

