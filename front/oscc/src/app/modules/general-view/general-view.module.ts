import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderPanelComponent} from './header-panel/header-panel.component';
import {GeneralViewRouting} from './general-view.routing';
import {RouterModule} from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MapComponent } from './map/map.component'
import {FormsModule} from '@angular/forms';
import {
  AngularCesiumModule,
  AngularCesiumWidgetsModule,
  PolygonsEditorService,
  ViewerConfiguration
} from 'angular-cesium';
import {PipesConfig} from 'angular2parse';
import { LeftPanelComponent } from './left-panel/left-panel.component';

import {MatSidenavModule} from '@angular/material/sidenav';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';


import { EventsSituationPictureComponent } from './left-panel/events-situation-picture/events-situation-picture.component';
import { ReportsSituationPictureComponent } from './left-panel/reports-situation-picture/reports-situation-picture.component';
import { EventsSituationTableComponent } from './left-panel/events-situation-picture/events-situation-table/events-situation-table.component';

@NgModule({
  declarations: [
    HeaderPanelComponent,
    MapComponent,
    LeftPanelComponent,
    EventsSituationPictureComponent,
    ReportsSituationPictureComponent,
    EventsSituationTableComponent
  ],
  imports: [
    CommonModule,
    GeneralViewRouting,
    RouterModule,
    FormsModule,
    MatIconModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatTabsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,

    AngularCesiumModule.forRoot(),
    AngularCesiumWidgetsModule,
  ],
  exports: [
    HeaderPanelComponent,
    MapComponent,
    LeftPanelComponent,
    EventsSituationPictureComponent,
    ReportsSituationPictureComponent,
    EventsSituationTableComponent
  ],
  providers: [
    PolygonsEditorService,
    ViewerConfiguration
  ]
})
export class GeneralViewModule {

}
