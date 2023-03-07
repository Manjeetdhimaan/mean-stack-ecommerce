import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Product } from '../../models/product.model';
import { ProductService, ProductsResponse } from '../../services/products.service';
import { CategoriesResponse, CategoriesService } from '../../services/categories.service';
import { Category } from '../../models/category.model';

@Component({
  selector: 'products-list',
  templateUrl: './products-list.component.html',
  styles: [],
})
export class ProductsListComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  isLoadingProducts = false;
  isLoadingCategories = false;
  serverErrMsg: string;

  constructor(private productService: ProductService, private categoryService: CategoriesService) { }

  ngOnInit(): void {
    this._getProducts();
    this._getCategories();
  }

  private _getCategories() {
    this.isLoadingCategories = true;
    this.categoryService.getCategories().subscribe(
      (res: CategoriesResponse) => {
        this.categories = res['categories'];
        this.isLoadingCategories = false;
      },
      (err) => {
        this.isLoadingCategories = false;
        this._errorHandler(err);
      }
    );
  }

  private _getProducts(categoriesFilter?: string[]) {
    this.isLoadingProducts = true;
    this.productService.getProducts(categoriesFilter).subscribe((res: ProductsResponse) => {
      if (!res['products']) {
        this.products = [];
      }
      else {
        this.products = res['products'];
      }
      this.isLoadingProducts = false;
      this.serverErrMsg = '';
    }, err => {
      this.isLoadingProducts = false;
      this._errorHandler(err);
    })
  }

  private _errorHandler(err: HttpErrorResponse) {
    if (err.error['message']) {
      if (err.error['message'] === 'No Products found' && err.status === 404) {
        this.products = []
      }
      this.serverErrMsg = err.error['message'];
    } else {
      this.serverErrMsg = 'An error occured. Please try again!';
    }
  }

  categoryFilter() {
    const selectedCategories = this.categories.filter(category => category.checked).map(category => category._id);
    this._getProducts(selectedCategories);
  }
}
