
import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {AuthGuard} from './AuthGuard/auth.guard';

export const appRoutes: Routes = [

  {path: 'login', loadChildren: () => import('../app/modules/login/login.module').then(m => m.LoginModule)},
  {path: 'general-view', loadChildren: () => import('./modules/general-view/general-view.module').then(m => m.GeneralViewModule)
    , canActivate: [AuthGuard]},

  {path: '', redirectTo: 'general-view', pathMatch: 'full'},
  {path: '**', redirectTo: 'login', pathMatch: 'full'}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

