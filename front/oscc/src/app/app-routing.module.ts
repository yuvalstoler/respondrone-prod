import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {GeneralViewComponent} from './modules/general-view/general-view.component';
import {LoginComponent} from './modules/login/login.component';

const routes: Routes = [
  {path: 'general-view', component: GeneralViewComponent },
  {path: 'login', component: LoginComponent},
  { path: '',   redirectTo: '/general-view', pathMatch: 'full' }, // redirect to `general-view`
  { path: '**', component: GeneralViewComponent },  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
