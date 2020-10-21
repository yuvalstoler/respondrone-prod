import {BrowserModule} from '@angular/platform-browser';
import {NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import 'hammerjs';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {GeneralViewModule} from './modules/general-view/general-view.module';
import {GeneralViewComponent} from './modules/general-view/general-view.component';
import {LoginComponent} from './modules/login/login.component';
import {AngularCesiumModule} from 'angular-cesium';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import {MatButtonModule} from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';

import {HttpClientModule} from '@angular/common/http';
import {MatSortModule} from '@angular/material/sort';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDialogModule} from '@angular/material/dialog';
import { ConfirmDialogComponent } from './dialogs/confirm-dialog/confirm-dialog.component';
import {MatIconModule} from '@angular/material/icon';
import { LinkedReportDialogComponent } from './dialogs/linked-report-dialog/linked-report-dialog.component';
import { LinkedReportContainerComponent } from './dialogs/linked-report-dialog/linked-report-container/linked-report-container.component';
import { LinkedReportTableComponent } from './dialogs/linked-report-dialog/linked-report-table/linked-report-table.component';
import { LinkedEventDialogComponent } from './dialogs/linked-event-dialog/linked-event-dialog.component';
import { LinkedEventContainerComponent } from './dialogs/linked-event-dialog/linked-event-container/linked-event-container.component';
import { LinkedEventTableComponent } from './dialogs/linked-event-dialog/linked-event-table/linked-event-table.component';
import {ToastrModule} from 'ngx-toastr';
import {SocketIoModule, SocketIoConfig} from 'ngx-socket-io';
import {SOCKET_CONFIG} from '../environments/environment';
import { EventDialogComponent } from './dialogs/event-dialog/event-dialog.component';
import { ReportDialogComponent } from './dialogs/report-dialog/report-dialog.component';
import { TaskDialogComponent } from './dialogs/task-dialog/task-dialog.component';

const config: SocketIoConfig = SOCKET_CONFIG;


// import {
//   AngularCesiumModule,
//   AngularCesiumWidgetsModule,
//   PolygonsEditorService,
//   ViewerConfiguration
// } from 'angular-cesium';

@NgModule({
  declarations: [
    AppComponent,
    GeneralViewComponent,
    LoginComponent,
    ConfirmDialogComponent,
    LinkedReportDialogComponent,
    LinkedReportContainerComponent,
    LinkedReportTableComponent,
    LinkedEventDialogComponent,
    LinkedEventContainerComponent,
    LinkedEventTableComponent,
    EventDialogComponent,
    ReportDialogComponent,
    TaskDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    GeneralViewModule,
    HttpClientModule,
    AngularCesiumModule.forRoot(),
    SocketIoModule.forRoot(config),
    ToastrModule.forRoot(),
    // AngularCesiumModule.forRoot(),
    // AngularCesiumWidgetsModule,

    FormsModule,
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
    MatSortModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatIconModule,
    MatExpansionModule
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ConfirmDialogComponent,
    LinkedReportDialogComponent,
    LinkedEventDialogComponent,
    EventDialogComponent,
    ReportDialogComponent,
    TaskDialogComponent
  ]
})
export class AppModule {
}
