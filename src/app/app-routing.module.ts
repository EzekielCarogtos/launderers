import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'getting-started',
    pathMatch: 'full'
  },
  {
    path: 'getting-started',
    loadComponent: () => import('./getting-started/getting-started.page').then(m => m.GettingStartedPage)
  },
  {
    path: 'signup',
    loadComponent: () => import('./signup/signup.page').then(m => m.SignupPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  { 
    path: 'service', 
    loadComponent: () => import('./service/service.page').then(m => m.ServicePage) 
  },
  { 
    path: 'orders', 
    loadComponent: () => import('./orders/orders.page').then(m => m.OrdersPage) 
  },
  { 
    path: 'basket', 
    loadComponent: () => import('./basket/basket.page').then(m => m.BasketPage) 
  },
  { 
    path: 'profile', 
    loadComponent: () => import('./profile/profile.page').then(m => m.ProfilePage) 
  },
  {
    path: 'bubblepass',
    loadComponent: () => import('./bubblepass/bubblepass.page').then(m => m.BubblepassPage)
  },
  {
    path: 'review-plan',
    loadComponent: () => import('./review-plan/review-plan.page').then(m => m.ReviewPlanPage)
  },
  {
    path: 'checkout',
    loadComponent: () => import('./pages/checkout/checkout.page').then(m => m.CheckoutPage)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }