import {ModuleWithProviders, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {GeneralViewComponent} from './general-view.component';

const routes: Routes = [
  {
    path: '',
    component: GeneralViewComponent,
  }
];

// export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralViewRouting { }
