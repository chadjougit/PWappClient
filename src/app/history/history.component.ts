import { Component, OnInit, transition } from '@angular/core';
import { IdentityService } from '../services/identity.service';
import { AuthHttp } from 'angular2-jwt';
import { Store } from '@ngrx/store';
import { State, UpdateAmount, UpdateHistory, AddNewTransaction } from '../reducers/reducers';

import 'rxjs/add/operator/map';
import { Router } from '@angular/router';


export interface Transaction {
    Id: number;
    Amount: number;
    SenderUsername: string;
    RecipientUsername: number;

}


@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {


    transaction = null;

    userData: any;

    constructor(public authHttp: AuthHttp, private router: Router, public identity: IdentityService, private store: Store<State>) { }

    lastUpdated = new Date();

    ngOnInit() {

 this.GetTransactions(); 
this.GetTransactionsFromReducer(); 

    }



    //

    GetTime() {

        this.identity.GetTime()
            .subscribe(
            (res: string) => {


                console.log(res);
                var b: Date = new Date(res);
                console.log(b);

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


    //


    SendTransactionId(id: number) {


        console.log(id);

        //let testvalue = this.transaction.find(trans => trans.Id == id).map(messages => {return messages});

        //let testvalue = this.transaction.map(trans => {trans.Amount = trans.Amount * -1; return trans});


        this.store.dispatch(new AddNewTransaction(this.transaction.map(trans => { trans.Amount = trans.Amount * -1; return trans }).find(trans => trans.Id == id)));
         
         this.router.navigate(["Transaction"]);


    }

    GetTransactionsFromReducer() {

        this.userData = this.store.select("UserDataReducer");

        this.userData.subscribe(
            data => {
                // Set the products Array
                this.userData.transactions = data.transactions;
                this.userData = data;
            })



    }

    GetTransactions() {

        this.identity.GetTransactions()
            .subscribe(
            (res: string) => {


                console.log(JSON.parse(res));
                this.transaction = JSON.parse(res);
                this.transaction = this.transaction.sort(function (a, b) {
                    return b.Id - a.Id})

                this.store.dispatch(new UpdateHistory(this.transaction));
            
            },
            (error: any) => {

                // Error on post request.
                let errMsg = (error.message) ? error.message :
                    error.status ? `${error.status} - ${error.statusText}` : 'Server error';

                console.log(errMsg);
                console.log("совсемnotsuccsess");

            });

    }

}
