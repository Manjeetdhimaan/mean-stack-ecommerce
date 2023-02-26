import { Component, OnInit } from '@angular/core';

import { CategoriesService, Category, CategoryResponse } from '@manjeet-ecommerce/products'

@Component({
  selector: 'admin-category-list',
  templateUrl: './categories-list.component.html',
  styles: [],
})
export class CategoriesListComponent implements OnInit {
  categories:Category[] = [];
  isLoading = false;

  constructor(private categoryService: CategoriesService) {}

  ngOnInit(): void {
    this.isLoading = true;
      this.categoryService.getCategories().subscribe((res: CategoryResponse) => {
        this.categories = res['categories'];
        this.isLoading = false;
      }, err => {
        console.log(err);
        this.isLoading = false;
      });
  }
}
