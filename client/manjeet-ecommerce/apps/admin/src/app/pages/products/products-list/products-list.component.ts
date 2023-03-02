import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Product } from '@manjeet-ecommerce/products';
import { ProductService, ProductsResponse } from '@manjeet-ecommerce/products';

@Component({
  selector: 'admin-products-list',
  templateUrl: './products-list.component.html',
  styles: [],
})

export class ProductsListComponent implements OnInit {
  products:Product[] = [];
  isLoading = false;
  isError = false;
  isLoadingDelete = false;

  constructor(private productService: ProductService, private messageService: MessageService, private router: Router) {}

  ngOnInit(): void {
      this._getProducts();
  }

  _getProducts() {
    this.isLoading = true;
    this.productService.getProducts().subscribe((res: ProductsResponse) => {
      this.products = res['products'];
      this.isLoading = false;
      this.isError = false;
    }, err => {
      this.isLoading = false;
      this.isError = true;
      this._errorHandler(err);
    })
  }

  onDeleteProduct(productId: string, product:any) {
  }

  onUpdateProduct(productId: string) {
    this.router.navigate([`products/edit/${productId}`]);
  }

  _errorHandler(err: any) {
    if (err.error['message']) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: err.error['message'],
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'An error occured',
        detail: 'Please try again!',
      });
    }
  }
}
