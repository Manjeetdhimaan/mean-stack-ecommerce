import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../../environments/environment'
import { Category } from '../models/category.model';

export interface CategoryResponse {
  success: boolean,
  categories: Category[]
}

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private http: HttpClient) { }

  getCategories():Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(`${environment.apiBaseUrl}/categories/get-categories`);
  }
}
