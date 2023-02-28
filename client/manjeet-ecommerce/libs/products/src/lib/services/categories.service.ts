import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../../environments/environment'
import { Category } from '../models/category.model';

export interface CategoriesResponse {
  success: boolean;
  message: string;
  categories: Category[];
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  category: Category;
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

  getCategories():Observable<CategoriesResponse> {
    return this.http.get<CategoriesResponse>(`${environment.apiBaseUrl}/categories/get-categories`);
  }

  getCategory(categoryId: string):Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(`${environment.apiBaseUrl}/categories/get-category/${categoryId}`);
  }

  postCategory(categoryBody: Category):Observable<SuccessResponse> {
    return this.http.post<SuccessResponse>(`${environment.apiBaseUrl}/categories/post-category`, categoryBody);
  }

  updateCategory(categoryId: string, categoryBody: Category):Observable<SuccessResponse> {
    return this.http.put<SuccessResponse>(`${environment.apiBaseUrl}/categories/update-category/${categoryId}`, categoryBody);
  }

  deleteCategory(categoryId: string):Observable<SuccessResponse> {
    return this.http.delete<SuccessResponse>(`${environment.apiBaseUrl}/categories/delete-category/${categoryId}`);
  }
}
