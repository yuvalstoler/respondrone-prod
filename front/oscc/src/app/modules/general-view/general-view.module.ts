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
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import {MatButtonModule} from '@angular/material/button';

import { EventsSituationPictureComponent } from './left-panel/events-situation-picture/events-situation-picture.component';
import { ReportsSituationPictureComponent } from './left-panel/reports-situation-picture/reports-situation-picture.component';
import { EventsSituationTableComponent } from './left-panel/events-situation-picture/events-situation-table/events-situation-table.component';
import { LeftNarrowPanelComponent } from './left-narrow-panel/left-narrow-panel.component';
import { EventPanelComponent } from './left-narrow-panel/event-panel/event-panel.component';
import { LinkedReportsTableComponent } from './linked-reports-table/linked-reports-table.component';
import { ReportMediaComponent } from './left-narrow-panel/report-media/report-media.component';
import { ViewMediaComponent } from './view-media/view-media.component';
import {MatDialogModule} from '@angular/material/dialog';

@NgModule({
  declarations: [
    HeaderPanelComponent,
    MapComponent,
    LeftPanelComponent,
    EventsSituationPictureComponent,
    ReportsSituationPictureComponent,
    EventsSituationTableComponent,
    LeftNarrowPanelComponent,
    EventPanelComponent,
    LinkedReportsTableComponent,
    ReportMediaComponent,
    ViewMediaComponent
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
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    MatDialogModule,

    AngularCesiumModule.forRoot(),
    AngularCesiumWidgetsModule,
  ],
  exports: [
    HeaderPanelComponent,
    MapComponent,
    LeftPanelComponent,
    EventsSituationPictureComponent,
    ReportsSituationPictureComponent,
    EventsSituationTableComponent,
    LeftNarrowPanelComponent,
    EventPanelComponent,
    LinkedReportsTableComponent,
    ReportMediaComponent
  ],
  providers: [
    PolygonsEditorService,
    ViewerConfiguration
  ],
  entryComponents: [ViewMediaComponent]
})
export class GeneralViewModule {

}
