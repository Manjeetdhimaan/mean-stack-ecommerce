import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BadgeModule } from 'primeng/badge';

import { ordersRoutes } from './lib.routes';
import { CartIconComponent } from './components/cart-icon/cart-icon.component';

@NgModule({
  imports: [CommonModule, RouterModule, BadgeModule],
  declarations: [CartIconComponent],
  exports: [CartIconComponent],
})
export class OrdersModule { }
