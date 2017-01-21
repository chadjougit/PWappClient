import { Component, OnInit } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { IdentityService } from '../services/identity.service';

@Component({
  selector: 'app-test-values',
  templateUrl: './test-values.component.html',
  styleUrls: ['./test-values.component.css']
})
export class TestValuesComponent implements OnInit {
    users: any;
  constructor(public authHttp: AuthHttp, public identity: IdentityService) { }

  
  
  
  getAll() {

        this.identity.GetAll()
            .subscribe(
            (res: any) => {

                this.users = res;
                console.log(res);

            },
            (error: any) => {

                // Error on get request.
                let errMsg = (error.message) ? error.message :
                    error.status ? `${error.status} - ${error.statusText}` : 'Server error';

                console.log(errMsg);

            });

    }

   FindByName(username: string, summ: number) {

        this.identity.FindByName(username, summ)
            .subscribe(
            (res: any) => {

                // IdentityResult.
                if (res.succeeded) {

                    // Refreshes the users.
                    this.getAll();

                } else {

                    console.log(res.errors);

                }

            },
            (error: any) => {

                // Error on post request.
                let errMsg = (error.message) ? error.message :
                    error.status ? `${error.status} - ${error.statusText}` : 'Server error';

                console.log(errMsg);

            });

    }



  ngOnInit() {
  }

}
