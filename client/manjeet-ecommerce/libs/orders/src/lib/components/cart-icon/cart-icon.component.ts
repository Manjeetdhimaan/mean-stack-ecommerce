import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@manjeet-ecommerce/users';

import { Subscription } from 'rxjs';
import { Cart, CartItem } from '../../models/cart.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'orders-cart-icon',
  templateUrl: './cart-icon.component.html',
  styles: [],
})
export class CartIconComponent implements OnInit, OnDestroy {

  cartCount = 0;
  subs$: Subscription;
  serversubs$: Subscription;
  serverErrMsg: string;

  constructor(private cartService: CartService, private authService: AuthService) { }

  ngOnInit(): void {
    this.serversubs$ = this.cartService.serverCart$.subscribe((cart: {totalPrice: number, quantity: number}) => {
      this.cartCount = 0;
      this.cartCount = cart.quantity;
    });

    this.subs$ = this.cartService.cart$.subscribe((cart: Cart) => {
      this.cartCount = 0;
      if (cart) {
        cart.items.map((item: CartItem) => {
          this.cartCount += item.quantity;
        });
      }
    })

    this._getCart();
  }

  private _getCart() {
    if (this.cartService.getCartItemsFromLocalStorage() && !this.authService.isUserLoggedIn()) {
      this.cartCount = 0;
      this.cartService.getCartItemsFromLocalStorage().items.map((item: CartItem) => {
        this.cartCount += item.quantity;
      });
    }
    else {
      this.cartService.getCartFromServer().subscribe(res => {
        this.cartCount= 0;
        res.products.map(product => {
          this.cartCount += +product.quantity;
        })
      }, err => {
        this._errorHandler(err);
      });
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
    if (this.subs$) {
      this.subs$.unsubscribe();
    }
    if (this.serversubs$){
      this.serversubs$.unsubscribe();
    }
  }
}
