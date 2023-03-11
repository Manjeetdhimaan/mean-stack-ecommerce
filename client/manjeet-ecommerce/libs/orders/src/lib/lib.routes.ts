import { Route } from '@angular/router';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { ThanksComponent } from './pages/thanks/thanks.component';

export const ordersRoutes: Route[] = [
  {
    path: 'cart', component: CartComponent
  },
  {
    path: 'checkout', component: CheckoutComponent
  },
  {
    path: 'success', component: ThanksComponent
  }
];
