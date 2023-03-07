import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { Product } from '../../models/product.model';
import { ProductResponse, ProductService } from '../../services/products.service';

@Component({
  selector: 'products-details',
  templateUrl: './product-details.component.html',
  styles: []
})
export class ProductDetailsComponent implements OnInit {
  product: Product;
  quantity: number;
  isLoading = false;
  serverErrMsg: string;

  constructor(private productService: ProductService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params['productId']) {
        this._getProduct(params['productId']);
      }
    });
  }

  addProductToCart() { }

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
