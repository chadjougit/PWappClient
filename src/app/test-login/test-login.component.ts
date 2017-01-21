import { Component, OnInit } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { SigninService } from '../services/signin.service';
import { AuthenticationService } from '../services/authentication.service';
import { IdentityService } from '../services/identity.service';




class Category {
  
  username:string = "Tom@mail.ru"; password:string = "MypassTest1!"; givenName:string = "Tommy"; familyName:string = "Stark";
  
    
    }


@Component({
  selector: 'app-test-login',
  templateUrl: './test-login.component.html',
  styleUrls: ['./test-login.component.css']
})
export class TestLoginComponent implements OnInit {

  values: any;

  //model:{username:string = "Tom@mail.ru", password:"MypassTest1!", givenName:"Tommy", familyName: "Stark"};



  constructor(public authHttp: AuthHttp, public Signin: SigninService, public authenticationService: AuthenticationService, public identity: IdentityService) { 



  }

    signup(): void {

let category = new Category();
console.log("try");

console.log(category.username);

console.log("try2");


        this.identity.Create(category)
            .subscribe(
            (res: any) => {

                // IdentityResult.
                if (res.succeeded) {

                    // Signs in the user.
                   // this.signin();

                   console.log("registration done");

                } else {

 console.log("registration notdone");

                     console.log(res);
                  //  this.errorMessages = res.errors;

                }

            },
            (error: any) => {

              console.log("registration notdone2");

                // Error on post request.
                let errMsg = (error.message) ? error.message :
                    error.status ? `${error.status} - ${error.statusText}` : 'Server error';

                console.log(errMsg);

              //  this.errorMessage = "Server error. Try later.";

            });

    }


  Login() {
    this.Signin.signin("admin@gmail.com", "Admin01*");
  }
  Logout() { this.authenticationService.signout();
   //  this.authenticationService.getAm().unsubscribe();
   // this.authenticationService.getAm().unsubscribe();
   }




  clicked() {
    this.authHttp.get("http://localhost:5000/api/values")
      .subscribe(
      (res: any) => {

        this.values = res.json();
        console.log(this.values);

      },
      (error: any) => {

        console.log(error);

      });
  }


  ngOnInit() {
  }

}
