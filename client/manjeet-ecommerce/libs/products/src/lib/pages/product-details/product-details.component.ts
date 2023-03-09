import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { Product } from '../../models/product.model';
import { ProductResponse, ProductService } from '../../services/products.service';
import { CartService } from '@manjeet-ecommerce/orders';
import { CartItem } from 'libs/orders/src/lib/models/cart.model';

@Component({
  selector: 'products-details',
  templateUrl: './product-details.component.html',
  styles: []
})
export class ProductDetailsComponent implements OnInit {
  product: Product;
  quantity: number = 1;
  isLoading = false;
  serverErrMsg: string;

  constructor(private productService: ProductService, private activatedRoute: ActivatedRoute, private cartService: CartService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params['productId']) {
        this._getProduct(params['productId']);
      }
    });
  }

  addProductToCart(productId: string) {
    const cartItem: CartItem = {
      productId: productId,
      quantity: this.quantity
    }
    this.cartService.setCartToLocalStorage(cartItem);
  }

  private _getProduct(id: string) {
    this.serverErrMsg = '';
    this.isLoading = true;
    this.productService.getProduct(id).subscribe((res: ProductResponse) => {
      this.product = res['product'];
      this.serverErrMsg = '';
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
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
