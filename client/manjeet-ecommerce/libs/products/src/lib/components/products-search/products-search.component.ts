import { animate, group, keyframes, query, stagger, state, style, transition, trigger } from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { Product } from '../../models/product.model';
import { ProductService, ProductsResponse } from '../../services/products.service';

@Component({
  selector: 'products-search',
  templateUrl: './products-search.component.html',
  styles: [],
  animations: [
    trigger('fadeIn', [
      state('in', style({
        opacity: 1,
      })),
      transition('void => *', [
        animate(300, keyframes([
          style({
            opacity: 0
          }),
          style({
            opacity: 0.5
          }),
          style({
            opacity: 1
          }),
          style({
            opacity: 1
          })
        ]))
      ]),
      transition('* => void', [
        group([
          animate(50, style({
            color: 'red'
          })),
          animate(250, style({
            opacity: 0
          }))
        ])
      ])
    ]),
    trigger('list2', [
      state('in', style({
        opacity: 1,
        transform: 'translateY(0)'
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
            offset: 0
          }),
          style({
            transform: 'translateY(-20px)',
            opacity: 1,
            offset: 0.1
          }),
          style({
            transform: 'translateY(0px)',
            opacity: 1,
            offset: 0.4
          })
        ]))
      ]),
      transition('* => void', [
        group([
          animate(50, style({
            color: 'red'
          })),
          animate(250, style({
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
    ])
  ]
})
export class ProductsSearchComponent implements OnInit {
  products: Product[] = [];
  isLoadingProducts = false;
  serverErrMsg: string;
  searchText: string

  constructor(private productService: ProductService) { }

  ngOnInit() {
  }

  onSearchProducts(searchEvent: Event, clearSearchEvent?:boolean) {

    const search = (searchEvent.target as HTMLInputElement).value;
    if(clearSearchEvent) {
      this.products = [];
      this.searchText = '';
      return;
    }
    if(search.trim() === '') {
      this.products = [];
    }
    else {
      this.products.length = 3
      console.log('else', this.searchText);
    }
  }

  private _getProducts(categoriesFilter?: any) {
    this.isLoadingProducts = true;
    // getting products without filters
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
        this.products = [];
      }
      this.serverErrMsg = err.error['message'];
    } else {
      this.serverErrMsg = 'An error occured. Please try again!';
    }
  }
}
