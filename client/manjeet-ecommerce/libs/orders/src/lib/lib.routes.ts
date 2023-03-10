import { Route } from '@angular/router';
import { CartComponent } from './pages/cart/cart.component';

export const ordersRoutes: Route[] = [
  {
    path: 'cart', component: CartComponent
  }
];
