import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../../environments/environment'
import { Category } from '../models/category.model';

export interface CategoryResponse {
  success: boolean,
  categories: Category[]
}

export interface SuccessResponse {
  success: boolean,
  message: string
}

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private http: HttpClient) { }

  getCategories():Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(`${environment.apiBaseUrl}/categories/get-categories`);
  }

  postCategory(categoryBody: Category):Observable<SuccessResponse> {
    return this.http.post<SuccessResponse>(`${environment.apiBaseUrl}/categories/post-category`, categoryBody);
  }

  deleteCategory(categoryId: string):Observable<SuccessResponse> {
    return this.http.delete<SuccessResponse>(`${environment.apiBaseUrl}/categories/delete-category/${categoryId}`);
  }
}
