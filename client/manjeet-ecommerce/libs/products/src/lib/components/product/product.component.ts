import { Component, Input } from '@angular/core';
import { Product } from '../../models/product.model';

@Component({
  selector: 'products-product',
  templateUrl: './product.component.html',
  styles: [],
})
export class ProductComponent {

  @Input() product: Product;
}
