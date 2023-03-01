import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoriesResponse, CategoriesService, Category } from '@manjeet-ecommerce/products';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'admin-products-list',
  templateUrl: './products-edit.component.html',
  styles: [],
})
export class ProductsEditComponent implements OnInit {

  editMode = false;
  submitted = false;
  isLoading = false;
  isError = false;
  productForm: FormGroup;
  categories: Category[] = [];

  constructor( private fb: FormBuilder, private categoryService: CategoriesService, private messageService: MessageService ) {}

  ngOnInit() {
    this._initForm();
    this._getCategories();
  }

  private _initForm() {
    this.productForm = this.fb.group({
      name: new FormControl(null, [Validators.required]),
      brand: new FormControl(null, [Validators.required]),
      price: new FormControl(0, [Validators.required]),
      category: new FormControl(null, [Validators.required]),
      countInStock: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      richDescription: new FormControl(null),
      image: new FormControl(null, [Validators.required]),
      isFeatured: new FormControl(false),
    })
  }

  private _getCategories() {
    this.isLoading = true;
    this.categoryService.getCategories().subscribe(
      (res: CategoriesResponse) => {
        this.categories = res['categories'];
        this.isLoading = false;
        this.isError = false;
      },
      (err) => {
        this.isLoading = false;
        this.isError = true;
        this._errorHandler(err);
      }
    );
  }

  get f() {
    return this.productForm.controls;
  }

  onSubmitForm() {

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
