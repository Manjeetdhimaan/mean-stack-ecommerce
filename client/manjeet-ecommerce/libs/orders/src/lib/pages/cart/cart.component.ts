import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';

import { ProductService, ServerResponse } from '@manjeet-ecommerce/products';
import { CartProduct } from '../../models/cart.model';
import { CartService, CART_KEY, PostCartResponse } from '../../services/cart.service';
import { AuthService } from '@manjeet-ecommerce/users';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'orders-cart',
  templateUrl: './cart.component.html',
  styles: [],
})
export class CartComponent implements OnInit {

  cartItems: CartProduct[] = [];
  serverErrMsg: string;
  isLoading: boolean = false;
  isLoadingDelete: boolean = false;
  totalPrice: number = 0;
  quantity: number = 0;

  constructor(private cartService: CartService, private productService: ProductService, private authService: AuthService, private messageService: MessageService) {
  }

  ngOnInit(): void {
    if (!this.authService.isUserLoggedIn()) {
      this._getLocalStorageCart();
    }
    else {
      this._getCartFromServer();
    }
  }

  private _getLocalStorageCart() {
    this.cartService.cart$.pipe(take(1)).subscribe(respCart => {
      if (respCart && respCart.items.length > 0) {
        respCart.items.forEach(cartItem => {
          this.productService.getProduct(cartItem.productId).subscribe(res => {
            this.cartItems.push({
              product: res['product'],
              quantity: cartItem['quantity']
            });
          }, err => {
            this._errorHandler(err);
          });
        })
      }
    });
  }

  private _getCartFromServer() {
    this.isLoading = true;
    const fetchedCart = localStorage.getItem(CART_KEY);
    // if cart is present in localstorage, store that in user account and clear localstorage cart
    if (fetchedCart) {
      const cart = JSON.parse(fetchedCart);
      this.cartService.postMultipleCart(cart).subscribe(res => {
        this.cartService.emptyCart();
        this.cartService.getCartFromServer().subscribe(res => {
          this.isLoading = false;
          res.products.forEach((product: any) => {
            this.totalPrice += +product.productId.price * +product.quantity;
            this.quantity += +product.quantity;
            this.cartService.serverCart$.next({ totalPrice: +this.totalPrice, quantity: this.quantity });
            this.cartItems.push({
              product: product.productId,
              quantity: product.quantity
            });
          })
        }, err => {
          this.isLoading = false;
          this._errorHandler(err);
        });
      }, err => {
        this.isLoading = false;
        this._errorHandler(err);
      })
    }
    else {
      this.cartService.getCartFromServer().subscribe(res => {
        res.products.map(product => {
          this.isLoading = false;
          this.totalPrice += +product.productId.price * +product.quantity;
          this.quantity += +product.quantity;
        })
        this.cartService.serverCart$.next({ totalPrice: +this.totalPrice, quantity: this.quantity });
        res.products.forEach((product: any) => {
          this.cartItems.push({
            product: product.productId,
            quantity: product.quantity
          });
        })
      }, err => {
        this.isLoading = false;
        this._errorHandler(err);
      });
    }

  }

  onLoading(event: boolean) {
    this.isLoading = event;
  }

  onUpdateQuantity(event: HTMLInputElement, productId: string) {
    if (!this.authService.isUserLoggedIn()) {
      this.cartService.setCartToLocalStorage({
        quantity: +event.value,
        productId: productId
      }, true);
    }
    else {
      const cartItem = {
        productId: productId,
        quantity: +event.value
      }
      this.isLoading = true;
      this.cartService.postCart(cartItem).subscribe((res: PostCartResponse) => {
        this.cartService.serverCart$.next({ totalPrice: +res.totalPrice, quantity: +res.quantity });
        this.isLoading = false;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Cart Updated' });
      }, err => {
        console.log(err)
        this.isLoading = false;
        this._errorHandler(err);
      })
    }

  }

  onDeleteItemFromCart(productId: string, index: number, price: number, quantity: number) {
    this.isLoadingDelete = true;
    this.cartService.postDeleteProductCart(productId).subscribe(res => {
      this.isLoadingDelete = false;
      this.cartItems.splice(index, 1);
      this.cartService.serverCart$.next({ totalPrice: (this.totalPrice - +price* +quantity), quantity: this.quantity - quantity });
      this.totalPrice = (this.totalPrice - (+price* +quantity));
      this.quantity = (this.quantity - quantity)
      this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
    }, err => {
      this.isLoadingDelete = false;
      this._errorHandler(err);
    });
  }

  private _errorHandler(err: HttpErrorResponse) {
    if (err.error['message']) {
      this.serverErrMsg = err.error['message'];
    } else {
      this.serverErrMsg = 'An error occured. Please try again!';
    }
  }

}
