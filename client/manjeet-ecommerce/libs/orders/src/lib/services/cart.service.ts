import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@env/environment';
import { ServerResponse } from '@manjeet-ecommerce/products';
import { HttpClient } from '@angular/common/http';
import { CartItem, Cart } from '../models/cart.model';

export const CART_KEY = 'cart'

@Injectable({
  providedIn: 'root'
})
export class CartService {

  productBaseUrl = `${environment.apiBaseUrl}/users`;

  constructor( private http: HttpClient ) { }

  postCart(cartObject: CartItem):Observable<ServerResponse> {
    return this.http.post<ServerResponse>(`${this.productBaseUrl}/post-user-cart`, {productId: cartObject.productId, quantity: cartObject.quantity, userId: '63f24bde043f5acaf6b8bb27'});
  }

  initCartLocalStorage() {
    const itemCart = {
      items: []
    }
    const initialCartJson = JSON.stringify(itemCart);
    localStorage.setItem('cart', initialCartJson);
  }

  // setCartToLocalStorage(cartItem: CartItem): Cart {
  //   const fetchedCart = localStorage.getItem(CART_KEY);
  //   if(fetchedCart) {
  //     const cart: Cart = JSON.parse(fetchedCart);
  //     cart.items.push(cartItem);
  //   }
  //   else {
  //     localStorage.setItem(CART_KEY, )
  //   }
  // }
}
