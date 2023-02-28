import { Route } from '@angular/router';
import { CategoriesListComponent } from './pages/categories/categories-list/categories-list.component';
import { CategoryEditComponent } from './pages/categories/category-edit/category-edit.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProductsEditComponent } from './pages/products/products-edit/products-edit.component';
import { ProductsListComponent } from './pages/products/products-list/products-list.component';
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
        },
        {
          path: 'categories/new', component: CategoryEditComponent
        },
        {
          path: 'categories/edit/:id', component: CategoryEditComponent
        },
        {
          path: 'products', component: ProductsListComponent
        },
        {
          path: 'products/new', component: ProductsEditComponent
        },
        {
          path: 'products/edit/:id', component: ProductsEditComponent
        }
      ]
  }
];
