import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderPanelComponent} from './header-panel/header-panel.component';
import {GeneralViewRouting} from './general-view.routing';
import {RouterModule} from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MapComponent } from './map/map.component'
import {
  AngularCesiumModule,
  AngularCesiumWidgetsModule,
  PolygonsEditorService,
  ViewerConfiguration
} from 'angular-cesium';
import {PipesConfig} from 'angular2parse';


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
  ],
  providers: [
    PolygonsEditorService,
    ViewerConfiguration
  ]
})
export class GeneralViewModule {

}
