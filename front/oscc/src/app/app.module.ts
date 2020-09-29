import {BrowserModule} from '@angular/platform-browser';
import {NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';

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
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    GeneralViewModule,
    AngularCesiumModule.forRoot(),
    // AngularCesiumModule.forRoot(),
    // AngularCesiumWidgetsModule,

    FormsModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatTabsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
