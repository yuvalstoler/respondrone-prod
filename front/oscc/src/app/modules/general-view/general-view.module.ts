import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderPanelComponent} from './header-panel/header-panel.component';
import {GeneralViewRouting} from './general-view.routing';
import {RouterModule} from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MapComponent } from './map/map.component'
import {AngularCesiumWidgetsModule, AngularCesiumModule} from 'angular-cesium';

@NgModule({
  declarations: [
    HeaderPanelComponent,
    MapComponent
  ],
  imports: [
    CommonModule,
    GeneralViewRouting,
    RouterModule,
    MatIconModule,

    AngularCesiumModule.forRoot(),
    AngularCesiumWidgetsModule,
  ],
  exports: [
    HeaderPanelComponent,
    MapComponent
  ]
})
export class GeneralViewModule {
}
