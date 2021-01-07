// Modules
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

import {routing} from './login.routing';

// Components
import {LoginComponent} from './login.component';

import {SpinnerComponent} from './spinner/spinner.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  imports: [
    routing,
    FormsModule,
    CommonModule,

    // MatIconModule,
    // MatTableModule,
    // MatDialogModule,
    // MatSelectModule,
    MatButtonModule,
    // MatToolbarModule,
    // MatSidenavModule,
    // MatListModule,
    MatFormFieldModule,
    MatInputModule,
    // MatCheckboxModule,
    // MatTabsModule,
    MatProgressSpinnerModule
  ],
  providers: [
    // {provide: 'ENVserverUrl', useValue: loginServerUrl},
    {provide: 'ENVmodulName', useValue: 'login'},
  ],
  declarations: [
    LoginComponent,
    SpinnerComponent
  ]
})
export class LoginModule {
}
