import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';

import { BannerComponent } from './components/banner/banner.component';
import { SliderComponent } from './components/slider/slider.component';

@NgModule({
  imports: [
    CommonModule,
    ButtonModule
  ],
  declarations: [BannerComponent, SliderComponent],
  exports: [BannerComponent, SliderComponent],
})
export class UiModule { }
