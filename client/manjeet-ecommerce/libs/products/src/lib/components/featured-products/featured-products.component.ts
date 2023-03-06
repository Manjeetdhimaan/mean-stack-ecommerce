import { Component, OnInit } from '@angular/core';

import { Product } from '../../models/product.model';
import { ProductService, ProductsResponse } from '../../services/products.service';

@Component({
  selector: 'products-featured',
  templateUrl: './featured-products.component.html',
  styles: [],
})
export class FeaturedProductsComponent implements OnInit {
  products: Product[] = [];
  isLoading = false;
  isError = false;
  isLoadingDelete = false;
  serverErrMsg: string = '';

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this._getFeaturedProducts();
  }

  _getFeaturedProducts() {
    this.isLoading = true;
    this.productService.getFeaturedProducts(4, -1).subscribe((res: ProductsResponse) => {
      this.products = res['products'];
      console.log(this.products)
      this.isLoading = false;
      this.isError = false;
    }, err => {
      this.isLoading = false;
      this.isError = true;
      this._errorHandler(err);
    })
  }

  private _errorHandler(err: any) {
    if (err.error['message']) {
      this.serverErrMsg = err.error['message'];
    } else {
      this.serverErrMsg = 'An error occured. Please try again!';
    }
  }
}
