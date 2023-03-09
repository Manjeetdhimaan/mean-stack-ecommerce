import { Component, OnDestroy, OnInit } from '@angular/core';
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

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    if (this.cartService.getCartItems()) {
      this.cartService.getCartItems().items.map((item: CartItem) => {
        this.cartCount += item.quantity;
      });
    }

    this.subs$ = this.cartService.cart$.subscribe((cart: Cart) => {
      this.cartCount = 0;
      cart.items.map((item: CartItem) => {
        this.cartCount += item.quantity;
      });
    })
  }

  ngOnDestroy(): void {
    if (this.subs$) {
      this.subs$.unsubscribe();
    }
  }
}
