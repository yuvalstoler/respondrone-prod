import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderPanelComponent} from './header-panel/header-panel.component';
import {GeneralViewRouting} from './general-view.routing';
import {RouterModule} from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MapComponent } from './map/map.component';
import {FormsModule} from '@angular/forms';
import {
  AngularCesiumModule,
  AngularCesiumWidgetsModule,
  PolygonsEditorService,
  ViewerConfiguration
} from 'angular-cesium';
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
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatExpansionModule} from '@angular/material/expansion';


import { EventsSituationPictureComponent } from './left-panel/events-situation-picture/events-situation-picture.component';
import { ReportsSituationPictureComponent } from './left-panel/reports-situation-picture/reports-situation-picture.component';
import { EventsSituationTableComponent } from './left-panel/events-situation-picture/events-situation-table/events-situation-table.component';
import { LinkedReportsTableComponent } from './linked-reports-table/linked-reports-table.component';
import { ViewMediaComponent } from './view-media/view-media.component';
import {MatDialogModule} from '@angular/material/dialog';
import { ReportsSituationTableComponent } from './left-panel/reports-situation-picture/reports-situation-table/reports-situation-table.component';
import {MatSortModule} from '@angular/material/sort';
import { LinkedEventsTableComponent } from './linked-events-table/linked-events-table.component';
import { CommentsPanelComponent } from './comments-panel/comments-panel.component';
import {CustomDatePipe} from '../../pipes/custom.datepipe';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ReportMediaComponent} from './report-media/report-media.component';
import { TasksMissionControlComponent } from './left-panel/tasks-mission-control/tasks-mission-control.component';
import { MissionsMissionControlComponent } from './left-panel/missions-mission-control/missions-mission-control.component';
import { TasksMissionTableComponent } from './left-panel/tasks-mission-control/tasks-mission-table/tasks-mission-table.component';
import { TaskAssigneeTableComponent } from './task-assignee-table/task-assignee-table.component';
import { GeoInstructionsComponent } from './geo-instructions/geo-instructions.component';
import {MatMenuModule} from '@angular/material/menu';



@NgModule({
  declarations: [
    HeaderPanelComponent,
    MapComponent,
    LeftPanelComponent,
    EventsSituationPictureComponent,
    ReportsSituationPictureComponent,
    EventsSituationTableComponent,
    LinkedReportsTableComponent,
    ReportMediaComponent,
    ViewMediaComponent,
    ReportsSituationTableComponent,
    LinkedEventsTableComponent,
    CommentsPanelComponent,
    CustomDatePipe,
    TasksMissionControlComponent,
    MissionsMissionControlComponent,
    TasksMissionTableComponent,
    TaskAssigneeTableComponent,
    GeoInstructionsComponent,
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
    MatSortModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatTooltipModule,
    MatMenuModule,

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
    LinkedReportsTableComponent,
    LinkedEventsTableComponent,
    ReportMediaComponent,
    ViewMediaComponent,
    ReportsSituationTableComponent,
    CustomDatePipe,
    CommentsPanelComponent,
    TasksMissionControlComponent,
    MissionsMissionControlComponent,
    TaskAssigneeTableComponent,
    GeoInstructionsComponent
  ],
  providers: [
    PolygonsEditorService,
    ViewerConfiguration
  ],
  entryComponents: [
    ViewMediaComponent
  ]
})
export class GeneralViewModule {

}
