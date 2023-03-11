import { Injectable, EventEmitter, Output } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';

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
  cart$: BehaviorSubject<Cart> = new BehaviorSubject(this.getCartItems());
  @Output() isLoading: EventEmitter<boolean> = new EventEmitter(true);

  constructor(private http: HttpClient) { }

  postCart(cartObject: CartItem): Observable<ServerResponse> {
    return this.http.post<ServerResponse>(`${this.productBaseUrl}/post-user-cart`, { productId: cartObject.productId, quantity: cartObject.quantity, userId: '63f24bde043f5acaf6b8bb27' });
  }

  initCartLocalStorage() {
    const itemCart = {
      items: []
    }
    const initialCartJson = JSON.stringify(itemCart);
    localStorage.setItem(CART_KEY, initialCartJson);
  }

  setItemToCart(fetchedCart: string, cartItem: CartItem, updateQuantity?: boolean) {
    const cart: Cart = JSON.parse(fetchedCart);
    const catrItemExitsIndex = cart.items.findIndex(item => item.productId === cartItem.productId);
    if (catrItemExitsIndex >= 0) {
      if(updateQuantity) {
        cart.items[catrItemExitsIndex].quantity = cartItem.quantity;
      }
      else {
        let newQuantity = cartItem.quantity;
        newQuantity = cart.items[catrItemExitsIndex].quantity + newQuantity;
        cart.items[catrItemExitsIndex].quantity = newQuantity;
      }
    }
    else {
      cart.items.push(cartItem);
    }
    const cartJson = JSON.stringify(cart);
    this.cart$.next(cart);
    localStorage.setItem(CART_KEY, cartJson);
  }

  getCartItems() {
    const fetchedCart = localStorage.getItem(CART_KEY);
    if(fetchedCart) {
      // this.cart$.next(JSON.parse(fetchedCart));
      return JSON.parse(fetchedCart);
    }
  }

  setCartToLocalStorage(cartItem: CartItem, updateQuantity?: boolean) {
    const fetchedCart = localStorage.getItem(CART_KEY);
    if (fetchedCart) {
      this.setItemToCart(fetchedCart, cartItem, updateQuantity);
    }
    else {
      this.initCartLocalStorage();

      const fetchedCart2 = localStorage.getItem(CART_KEY);
      if (fetchedCart2) {
        this.setItemToCart(fetchedCart2, cartItem, updateQuantity);
      }
    }
  }

  emptyCart() {
    const intialCart = {
      items: []
    };
    const intialCartJson = JSON.stringify(intialCart);
    localStorage.setItem(CART_KEY, intialCartJson);
    this.cart$.next(intialCart);
  }
}
