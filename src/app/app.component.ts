import { isBoolean } from 'util';
import { BehaviorSubject } from 'rxjs/Rx';
import { Component, DoCheck, OnChanges, SimpleChanges, KeyValueDiffers  } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';
import { AuthHttp } from 'angular2-jwt';
import { SigninService } from './services/signin.service';
import { IdentityService } from './services/identity.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import { State } from './reducers/reducers';
import { HHelpers } from './services/HHelpers';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
//implements DoCheck 
export class AppComponent  {
  title = 'app works!';
  complexForm: FormGroup;
 // userData: Observable<any>;
 userData: any;

 BehaviorSubject2: any; 


 deletethisvalue: any;
  // Optional strategy for refresh token through a scheduler.
/*
 ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
    console.log('Change detected:', changes[String(this.BehaviourSubject3.value)].currentValue);
  }
  */
/*
ngDoCheck() {
		var changes = this.differ.diff((this.BehaviourSubject3.value).toString());

		if(changes) {
			console.log('changes detected');
		
		} else {
			console.log('no changes()');
		}
	}
  */



ngOnChanges() {
   if(!this.signedIn){         
        console.log("newOnchanges");         
   }
 }

differ: any;
 BehaviourSubject3 = new BehaviorSubject(this.signedIn);

  constructor(fb: FormBuilder, public authenticationService: AuthenticationService, private router: Router, public authHttp: AuthHttp, public Signin: SigninService, public identity: IdentityService, private store: Store<State>, public HHelpers: HHelpers, private differs: KeyValueDiffers) {


HHelpers.bSubject.subscribe((value) => {
  console.log("Subscription got", value); // Subscription got b, 
                                          // ^ This would not happen 
                                          // for a generic observable 
                                          // or generic subject by default
});

this.differ = differs.find({}).create(null);
this.BehaviourSubject3.subscribe(data => this.deletethisvalue = data)


    this.userData = store.select("UserDataReducer");

//let BehaviourSubject = new BehaviorSubject(tokenNotExpired);

let BehaviorSubject2 = new BehaviorSubject(this.signedIn);

this.deletethisvalue = false;

/*
let disposeMe = BehaviourSubject.subscribe( data => {
        // Set the products Array
        console.log("yaaaaaaaa");
        
      });
      */

     this.userData.subscribe(
      data => {
        // Set the products Array
        this.userData.amount = data.amount;
        
      })
      

    // Optional strategy for refresh token through a scheduler.
    this.authenticationService.startupTokenRefresh();


    this.complexForm = fb.group({
      // To add a validator, we must first convert the string value into an array. 
      //The first item in the array is the default value if any, then the next item in the array is the validator. Here we are adding a required validator meaning that the firstName attribute must have a value in it.
      'login': ["admin@gmail.com", Validators.required],
      // We can use more than one validator per field.
      // If we want to use more than one validator we have to wrap our array of validators with a Validators.compose function. Here we are using a required, minimum length and maximum length validator.
      'password': ["Admin01*", Validators.required],
    })
  }


  click$: Observable<any> = new Subject().map((value: any) => {
    const val = value;
    console.log(val);
    console.log('heeeey');
    this.login();

    


  });


  get signedIn(): boolean {

        return this.HHelpers.tokenNotExpired();

    }
 



 Logout() {
   
  //  this.Signin.uns();

  //  this.Signin.getAmountSubscriber.unsubscribe();



    this.authenticationService.signout();
   //  this.authenticationService.getAm().unsubscribe();
   // this.authenticationService.getAm().unsubscribe();
   this.router.navigate(["Home"]);
   }

  GetAmount() {



    this.identity.GetAmount()
      .subscribe(
      (res: string) => {


        console.log(res);


        /*
        this.transaction = res[0];
        console.log(res[2]);
        console.log(res);
        */

      },
      (error: any) => {

        // Error on post request.
        let errMsg = (error.message) ? error.message :
          error.status ? `${error.status} - ${error.statusText}` : 'Server error';

        console.log(errMsg);
        console.log("совсемnotsuccsess");

      });

  }

  subscription: any = this.click$.subscribe(
    x => console.log('onNext: %s', JSON.stringify(x)),
    e => console.log('onError: %s', e),
    () => console.log('onCompleted'));




  login() {
    this.Signin.signin(this.complexForm.value.login, this.complexForm.value.password)
  }

 uns(){

console.log("test");

 this.Signin.getAmountSubscriber.unsubscribe();

 console.log("test2");

 }


DeleteThisBehSubscriber()
{
/*
let BehaviourSubject3 = new BehaviorSubject(this.signedIn);
BehaviourSubject3.subscribe(data => this.deletethisvalue = data)
console.log(BehaviourSubject3.value);
*/
console.log("DeleteThisBehSubscriber");
console.log(this.BehaviourSubject3.value);


}


  navigateHome() { this.router.navigate(["Home"]); }
  navigateTestLogin() { this.router.navigate(["TestLogin"]); }
  navigateTestValues() { this.router.navigate(["TestValues"]); }
  navigatesignup() { this.router.navigate(["Signup"]); }
  navigateTransaction() { this.router.navigate(["Transaction"]); }
  navigateHistory() { this.router.navigate(["History"]); }

}



