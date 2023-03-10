import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { animate, group, keyframes, query, stagger, state, style, transition, trigger } from '@angular/animations';
import { take } from 'rxjs';
import { MessageService } from 'primeng/api';

import { ProductService } from '@manjeet-ecommerce/products';
import { AuthService } from '@manjeet-ecommerce/users';
import { CartProduct } from '../../models/cart.model';
import { CartService, CART_KEY, PostCartResponse } from '../../services/cart.service';

@Component({
  selector: 'orders-cart',
  templateUrl: './cart.component.html',
  styles: [],
  animations: [
    trigger('list1', [
      state('in', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateX(-100px)'
        }),
        animate(300)
      ]),
      transition('* => void', [
        animate(300, style({
          transform: 'translateX(100px)',
          opacity: 0
        }))
      ])
    ]),
    trigger('list2', [
      state('in', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      transition('void => *', [
        animate(1000, keyframes([
          style({
            transform: 'translateY(-100px)',
            opacity: 0,
            offset: 0
          }),
          style({
            transform: 'translateY(-50px)',
            opacity: 0.5,
            offset: 0.3
          }),
          style({
            transform: 'translateY(-20px)',
            opacity: 1,
            offset: 0.8
          }),
          style({
            transform: 'translateY(0px)',
            opacity: 1,
            offset: 1
          })
        ]))
      ]),
      transition('* => void', [
        group([
          animate(300, style({
            color: 'red'
          })),
          animate(800, style({
            transform: 'translateX(100px)',
            opacity: 0
          }))
        ])
      ])
    ]),
    trigger('listAnimation', [
      transition('* => *', [ // each time the binding value changes
        query(':leave', [
          stagger(100, [
            animate('0.5s', style({ opacity: 0 }))
          ])
        ], { optional: true }),
        query(':enter', [
          style({ opacity: 0 }),
          stagger(100, [
            animate('0.5s', style({ opacity: 1 }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger("slide", [
      transition("* => *", [
        style({ transform: "translateY(100%)", opacity: 0 }),
        animate(2000, style({ transform: "translateY(-100%)", opacity: 1 }))
      ])
    ]),
    trigger("enterSlide", [
      transition("* => *", [
        // each time the binding value changes
        query(
          ":enter",
          [
            stagger(2000, [
              style({ transform: "translateY(100%)", opacity: 0 }),
              animate(2000, style({ transform: "translateY(-100%)", opacity: 1 }))
            ])
          ],
          {
            optional: true
          }
        )
      ])
    ])
  ]
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
    if (fetchedCart && JSON.parse(fetchedCart).items.length >0) {
      const cart = JSON.parse(fetchedCart);
      this.cartService.postMultipleCart(cart).subscribe(res => {
        this.cartService.emptyCart();
        this.cartService.getCartFromServer().subscribe(res => {
          this.isLoading = false;
          res.products.forEach((product: any) => {
            this.totalPrice += +product.productId.price * +product.quantity;
            this.quantity += +product.quantity;
            this.cartItems.push({
              product: product.productId,
              quantity: product.quantity
            });
            this.cartService.serverCart$.next({ totalPrice: +this.totalPrice, quantity: this.quantity });
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
        this.isLoading = false;
        res.products.map(product => {
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
