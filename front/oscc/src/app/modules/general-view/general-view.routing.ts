import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {GeneralViewComponent} from './general-view.component';


const routes: Routes = [
  {
    path: '',
    component: GeneralViewComponent,
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
