import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';

import { ProductService } from '@manjeet-ecommerce/products';
import { CartProduct } from '../../models/cart.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'orders-cart',
  templateUrl: './cart.component.html',
  styles: [],
})
export class CartComponent implements OnInit {

  cartItems: CartProduct[] = [];
  serverErrMsg: string;
  isLoading: boolean = false;

  constructor(private cartService: CartService, private productService: ProductService) {
  }

  ngOnInit(): void {
    this._getCart();
      // this.loadingSubs$ = this.cartService.isLoading.subscribe((event: boolean) => {
      //   this.isLoading = event;
      // })
  }

  private _getCart() {
    //  if user is not logged in;
    this.cartService.cart$.pipe(take(1)).subscribe(respCart => {
      if (respCart && respCart.items.length > 0) {
        // this.isLoading = true;
        respCart.items.forEach(cartItem => {
          this.productService.getProduct(cartItem.productId).subscribe(res => {
            this.cartItems.push({
              product: res['product'],
              quantity: cartItem['quantity']
            });
            // this.isLoading = false;
          }, err => {
            // this.isLoading = false;
            this._errorHandler(err);
          });
        })
      }
    });
  }

  onLoading (event: boolean) {
    this.isLoading = event;
  }

  onUpdateQuantity(event: HTMLInputElement, productId: string) {
    this.cartService.setCartToLocalStorage({
      quantity: +event.value,
      productId: productId
    }, true);
  }

  onDeleteItemFromCart() { }

  private _errorHandler(err: HttpErrorResponse) {
    if (err.error['message']) {
      this.serverErrMsg = err.error['message'];
    } else {
      this.serverErrMsg = 'An error occured. Please try again!';
    }
  }

}
