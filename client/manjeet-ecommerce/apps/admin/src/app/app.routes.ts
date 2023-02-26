import { Route } from '@angular/router';
import { CategoriesListComponent } from './categories/categories-list/categories-list.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ShellComponent } from './shared/shell/shell.component';

export const appRoutes: Route[] = [
  {
    path: '', component: ShellComponent, data: { title: 'Admin Panel' },
      children: [
        {
          path: 'dashboard', component: DashboardComponent
        },
        {
          path: 'categories', component: CategoriesListComponent
        }
      ]
  }
];
