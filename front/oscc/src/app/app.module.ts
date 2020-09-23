import {BrowserModule} from '@angular/platform-browser';
import {NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {GeneralViewModule} from './modules/general-view/general-view.module';
import {GeneralViewComponent} from './modules/general-view/general-view.component';
import {LoginComponent} from './modules/login/login.component';

import {
  AngularCesiumModule,
  AngularCesiumWidgetsModule,
  PolygonsEditorService,
  ViewerConfiguration
} from 'angular-cesium';

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
    AngularCesiumWidgetsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
