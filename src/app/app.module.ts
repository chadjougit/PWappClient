import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { HttpModule, Http } from '@angular/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { TestLoginComponent } from './test-login/test-login.component';
import { TestValuesComponent } from './test-values/test-values.component';

import { AuthguardService } from './services/authguard.service';
import { SigninService } from './services/signin.service';
import { AuthenticationService } from './services/authentication.service';
import { routing } from './app.routing';
import { IdentityService } from './services/identity.service';
import { HistoryComponent } from './history/history.component';
import { TransactionComponent } from './transaction/transaction.component';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';

import { CustomFormsModule } from 'ng2-validation'
import { TypeaheadModule } from 'ng2-bootstrap/typeahead';

import {StoreModule} from '@ngrx/store';
import { UserDataReducer } from './reducers/reducers';
import { HHelpers } from './services/HHelpers';



// Set tokenGetter to use the same storage in AuthenticationService.Helpers.
export function getAuthHttp(http: Http) {
    return new AuthHttp(new AuthConfig({
        noJwtError: true,
        tokenGetter: (() => localStorage.getItem('id_token'))
    }), http);
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TestLoginComponent,
    TestValuesComponent,
    HistoryComponent,
    TransactionComponent,
    SignupComponent,
    SigninComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
      CustomFormsModule,
        ReactiveFormsModule,
        TypeaheadModule.forRoot(),
          StoreModule.provideStore( {UserDataReducer: UserDataReducer} )
  ],
  providers: [AuthenticationService,
  SigninService,
  AuthguardService,
  IdentityService,
  
  HHelpers,
  
   {
            provide: AuthHttp,
            useFactory: getAuthHttp,
            deps: [Http]
        }],
  bootstrap: [AppComponent]
})
export class AppModule { }
