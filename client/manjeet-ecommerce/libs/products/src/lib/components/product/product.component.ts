import { Component, Input } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { CartService, ServerResponse } from '@manjeet-ecommerce/orders';
import { Product } from '../../models/product.model';
import { MessageService } from 'primeng/api';
import { AuthService } from '@manjeet-ecommerce/users';

@Component({
  selector: 'products-product',
  templateUrl: './product.component.html',
  styles: [],
})
export class ProductComponent {

  @Input() product: Product;
  serverErrMsg: string;
  isLoading = false;

  constructor( private cartService: CartService, private messageService: MessageService, private authService: AuthService ) {}

  onAddtoCart(productId: string) {
    const cartObject = {
      productId,
      quantity: 1
    }
    this.isLoading = true;
    this.cartService.postCart(cartObject).subscribe((res: ServerResponse) => {
      this.isLoading = false;
      this.messageService.add({severity:'success', summary:'Success', detail: res['message']});
    }, err => {
      this.isLoading = false;
      this._errorHandler(err);
    })
  }

  private _errorHandler(err: HttpErrorResponse) {
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
