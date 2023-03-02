import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@env/environment'
import { ServerResponse } from './categories.service';
import { Product } from '../models/product.model';

export interface ProductsResponse {
  success: boolean;
  message: string;
  products: Product[];
}

export interface ProductResponse {
  success: boolean;
  message: string;
  product: Product;
}

@Injectable({
  providedIn: 'root'
})

export class ProductService {

  productBaseUrl = `${environment.apiBaseUrl}/products`

  constructor(private http: HttpClient) { }

  getProducts():Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(`${this.productBaseUrl}/get-products`);
  }

  getProduct(productId: string):Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.productBaseUrl}/get-product/${productId}`);
  }

  postProduct(productBody: FormData):Observable<ServerResponse> {
    return this.http.post<ServerResponse>(`${this.productBaseUrl}/post-product`, productBody);
  }

  updateProduct(productId: string, productBody: FormData):Observable<ServerResponse> {
    return this.http.put<ServerResponse>(`${this.productBaseUrl}/update-product/${productId}`, productBody);
  }

  deleteProduct(productId: string):Observable<ServerResponse> {
    return this.http.delete<ServerResponse>(`${this.productBaseUrl}/delete-product/${productId}`);
  }
}