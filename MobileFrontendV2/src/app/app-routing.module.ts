import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'check-in',
    loadChildren: () => import('./check-in/check-in.module').then( m => m.CheckInPageModule)
  },
  {
    path: 'check-out',
    loadChildren: () => import('./check-out/check-out.module').then( m => m.CheckOutPageModule)
  },
  {
    path: 'check-out-reminded',
    loadChildren: () => import('./check-out-reminded/check-out-reminded.module').then( m => m.CheckOutRemindedPageModule)
  },
  {
    path: 'welcome',
    loadChildren: () => import('./welcome/welcome.module').then( m => m.WelcomePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
