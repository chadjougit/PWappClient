import { stringify } from '@angular/core/testing/facade/lang';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { IdentityService } from './identity.service';
import { Store } from '@ngrx/store';
import { State, Actions, UpdateAmount } from '../reducers/reducers';
import { Observable } from 'rxjs';
import "rxjs/Rx";


@Injectable()
export class SigninService {

    // model: any = {};

    errorMessage: string = "";
    userData: Observable<any>;
     public amount:Observable<any>;

     getAmountSubscriber : any;

    constructor(public authenticationService: AuthenticationService, public identityService: IdentityService, private store: Store<State>) { 


this.userData = store.select("UserDataReducer");


    }


 uns(){

 this.authenticationService.getAm().unsubscribe;

 this.getAmountSubscriber.unsubscribe();

 }

    signin(username: string, password: string): void {

        this.authenticationService.signin(username, password)
            .subscribe(
            () => {

                // Optional strategy for refresh token through a scheduler.
                this.authenticationService.scheduleRefresh();
                console.log("signin dooone");

              this.getAmountSubscriber =  this.authenticationService.getAm()
                    .subscribe(
                    (res) => {

console.log("VLLLADDDDDD");

                    //    console.log(res.json());
                    if (res != ""){
                          this.store.dispatch(new UpdateAmount(parseInt(res.json())));
                          }


                        /*
                        this.transaction = res[0];
                        console.log(res[2]);
                        console.log(res);
                        */

                    });
                     





                /*
                                // Gets the redirect URL from authentication service.
                                // If no redirect has been set, uses the default.
                                let redirect: string = this.authenticationService.redirectUrl
                                    ? this.authenticationService.redirectUrl
                                    : '/home';
                
                                // Redirects the user.
                                this.router.navigate([redirect]);
                                */

            },
            (error: any) => {

                // Checks for error in response (error from the Token endpoint).
                if (error.body != "") {

                    let body: any = error.json();

                    switch (body.error) {

                        case "invalid_grant":
                            this.errorMessage = "Invalid email or password";
                            break;
                        default:
                            this.errorMessage = "Unexpected error. Try again";

                    }

                } else {

                    // Error on post request.
                    let errMsg = (error.message) ? error.message :
                        error.status ? `${error.status} - ${error.statusText}` : 'Server error';

                    console.log(errMsg);

                    this.errorMessage = "Server error. Try later.";

                }

            });

    }
}
