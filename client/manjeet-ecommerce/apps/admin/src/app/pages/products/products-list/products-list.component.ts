import { Component, OnInit } from '@angular/core';
import { ProductService, ProductsResponse } from '@manjeet-ecommerce/products';
import { Product } from '@manjeet-ecommerce/products';
import { MessageService } from 'primeng/api';

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

  constructor(private productService: ProductService, private messageService: MessageService) {}

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
