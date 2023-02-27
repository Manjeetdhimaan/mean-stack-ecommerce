import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { timer } from 'rxjs';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { MessageService } from 'primeng/api';

import { CategoriesService } from '@manjeet-ecommerce/products';
import { ActivatedRoute, Params } from '@angular/router';

export interface SuccessResponse {
  success: boolean;
  message: string;
}

@Component({
  selector: 'admin-category-edit',
  templateUrl: './category-edit.component.html',
  styles: [],
})
export class CategoryEditComponent implements OnInit {
  form: FormGroup;
  submit = false;
  isLoading = false;
  isError = false;
  editMode = false;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoriesService,
    private location: Location,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: new FormControl('', [Validators.required]),
      icon: new FormControl('', [Validators.required]),
    });

    this.activatedRoute.params.subscribe((param: Params) => {
      console.log(param);
      if(param['id']){
        this.editMode = true;
      }
      else {
        this.editMode = false
      }
    })
  }

  get f() {
    return this.form.controls;
  }

  onSubmitForm() {
    this.submit = true;
    if (!this.form.valid) {
      return;
    }
    this.isLoading = true;
    this.categoryService.postCategory(this.form.value).subscribe(
      (res: SuccessResponse) => {
        this.isLoading = false;
        this.isError = false;
        if (res.success) {
          this.messageService.add({severity:'success', summary:'Success', detail: res['message']});
          // this.router.navigate(['/categories']);
          timer(1000).toPromise().then(() => {
            this.location.back();
          })
        }
      },
      (err) => {
        this.isLoading = false;
        this.isError = true;
        if(err.name==="HttpErrorResponse") {
          this.messageService.add({severity:'error', summary:'An error occured', detail: 'Please try again!'});
        }
        else {
          this.messageService.add({severity:'error', summary:'Error', detail: err['message']});
        }
        console.log(err);
      }
    );
    console.log(this.form.value);
  }
}
