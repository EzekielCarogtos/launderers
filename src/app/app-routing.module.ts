import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { OrdersPage } from './orders/orders.page';
import { ServicePage } from './service/service.page';
import { ProfilePage } from './profile/profile.page';
import { BasketPage } from './basket/basket.page';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'service', loadComponent: () => import('./service/service.page').then(m => m.ServicePage) },
  { path: 'orders', loadComponent: () => import('./orders/orders.page').then(m => m.OrdersPage) },
  { path: 'basket', loadComponent: () => import('./basket/basket.page').then(m => m.BasketPage) },
  { path: 'profile', loadComponent: () => import('./profile/profile.page').then(m => m.ProfilePage) },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./pages/checkout/checkout.page').then(m => m.CheckoutPage)
  }

  //{path: '', redirectTo: 'service', pathMatch: 'full'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
