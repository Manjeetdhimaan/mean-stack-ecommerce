import { Route } from '@angular/router';

import { UserAuthGuard } from '@manjeet-ecommerce/users';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { ThanksComponent } from './pages/thanks/thanks.component';

export const ordersRoutes: Route[] = [
  {
    path: 'cart', component: CartComponent
  },
  {
    path: 'checkout', component: CheckoutComponent, canActivate: [UserAuthGuard]
  },
  {
    path: 'success', component: ThanksComponent
  }
];
