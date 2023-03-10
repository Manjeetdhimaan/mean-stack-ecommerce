import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';

import { ordersRoutes } from './lib.routes';
import { CartIconComponent } from './components/cart-icon/cart-icon.component';
import { CartComponent } from './pages/cart/cart.component';
import { FormsModule } from '@angular/forms';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(ordersRoutes),
    BadgeModule,
    ButtonModule,
    InputNumberModule,
    FormsModule,
  ],
  declarations: [CartIconComponent, CartComponent, OrderSummaryComponent],
  exports: [CartIconComponent, CartComponent, OrderSummaryComponent],
})
export class OrdersModule {}
