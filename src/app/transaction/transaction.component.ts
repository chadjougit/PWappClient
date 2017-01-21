import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validator, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { IdentityService } from '../services/identity.service';
import { CustomValidators } from 'ng2-validation';
import { TypeaheadModule } from 'ng2-bootstrap/typeahead';

import { TypeaheadMatch } from 'ng2-bootstrap';

import 'rxjs/add/observable/of';
import { Store } from '@ngrx/store';
import { State } from '../reducers/reducers';

import 'rxjs/add/operator/take'



@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {


 complexForm : FormGroup;
  public stateCtrl:FormControl = new FormControl();
 
  public myForm:FormGroup = new FormGroup({
    state: this.stateCtrl
  });
 
  public customSelected:string = '';
  public groupSelected:string = '';
  public selected:string = '';
  public dataSource:Observable<any>;
  public asyncSelected:string = '';
 public asyncAmount:string = '';


  public typeaheadLoading:boolean = false;
  public typeaheadNoResults:boolean = false;
  public states:string[] = ['Alabama', 'Alaska', 'Arizona', 'Arkansas',
    'California', 'Colorado',
    'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
    'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts',
    'Michigan', 'Minnesota',
    'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico',
    'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon',
    'Pennsylvania', 'Rhode Island',
    'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington',
    'West Virginia', 'Wisconsin', 'Wyoming'];
  public statesComplex:any[] = [
    {id: 1, name: 'Alabama', region: 'South'}, {id: 2, name: 'Alaska', region: 'West'}, {id: 3, name: 'Arizona', region: 'West'},
    {id: 4, name: 'Arkansas', region: 'South'}, {id: 5, name: 'California', region: 'West'},
    {id: 6, name: 'Colorado', region: 'West'}, {id: 7, name: 'Connecticut', region: 'Northeast'},
    {id: 8, name: 'Delaware', region: 'South'}, {id: 9, name: 'Florida', region: 'South'},
    {id: 10, name: 'Georgia', region: 'South'}, {id: 11, name: 'Hawaii', region: 'West'},
    {id: 12, name: 'Idaho', region: 'West'}, {id: 13, name: 'Illinois', region: 'Midwest'},
    {id: 14, name: 'Indiana', region: 'Midwest'}, {id: 15, name: 'Iowa', region: 'Midwest'},
    {id: 16, name: 'Kansas', region: 'Midwest'}, {id: 17, name: 'Kentucky', region: 'South'},
    {id: 18, name: 'Louisiana', region: 'South'}, {id: 19, name: 'Maine', region: 'Northeast'},
    {id: 21, name: 'Maryland', region: 'South'}, {id: 22, name: 'Massachusetts', region: 'Northeast'},
    {id: 23, name: 'Michigan', region: 'Midwest'}, {id: 24, name: 'Minnesota', region: 'Midwest'},
    {id: 25, name: 'Mississippi', region: 'South'}, {id: 26, name: 'Missouri', region: 'Midwest'},
    {id: 27, name: 'Montana', region: 'West'}, {id: 28, name: 'Nebraska', region: 'Midwest'},
    {id: 29, name: 'Nevada', region: 'West'}, {id: 30, name: 'New Hampshire', region: 'Northeast'},
    {id: 31, name: 'New Jersey', region: 'Northeast'}, {id: 32, name: 'New Mexico', region: 'West'},
    {id: 33, name: 'New York', region: 'Northeast'}, {id: 34, name: 'North Dakota', region: 'Midwest'},
    {id: 35, name: 'North Carolina', region: 'South'}, {id: 36, name: 'Ohio', region: 'Midwest'},
    {id: 37, name: 'Oklahoma', region: 'South'}, {id: 38, name: 'Oregon', region: 'West'},
    {id: 39, name: 'Pennsylvania', region: 'Northeast'}, {id: 40, name: 'Rhode Island', region: 'Northeast'},
    {id: 41, name: 'South Carolina', region: 'South'}, {id: 42, name: 'South Dakota', region: 'Midwest'},
    {id: 43, name: 'Tennessee', region: 'South'}, {id: 44, name: 'Texas', region: 'South'},
    {id: 45, name: 'Utah', region: 'West'}, {id: 46, name: 'Vermont', region: 'Northeast'},
    {id: 47, name: 'Virginia', region: 'South'}, {id: 48, name: 'Washington', region: 'South'},
    {id: 49, name: 'West Virginia', region: 'South'}, {id: 50, name: 'Wisconsin', region: 'Midwest'},
    {id: 51, name: 'Wyoming', region: 'West'}];


   userData: Observable<any>;
  content: any;
  constructor(fb: FormBuilder, public identity: IdentityService, private store: Store<State>) { 

 this.GetAllUsers();


this.dataSource = Observable.create((observer:any) => {
      // Runs on every search
      observer.next(this.asyncSelected);
    }).mergeMap((token:string) => this.getusersAsObservable(token));



this.userData = this.store.select("UserDataReducer");

this.content = store.select(state => state);


    

  this.complexForm = fb.group({
      // To add a validator, we must first convert the string value into an array. 
      //The first item in the array is the default value if any, then the next item in the array is the validator. Here we are adding a required validator meaning that the firstName attribute must have a value in it.
      'recipient' : ["noo@gmail.com",  [Validators.required, CustomValidators.email]],
      // We can use more than one validator per field.
      // If we want to use more than one validator we have to wrap our array of validators with a Validators.compose function. Here we are using a required, minimum length and maximum length validator.
      'Amount': ["100", [Validators.required, CustomValidators.number]],
    })


   

  }

  

  users: any;



  public getStatesAsObservable(token:string):Observable<any> {
    let query = new RegExp(token, 'ig');
 
    return Observable.of(
      this.statesComplex.filter((state:any) => {
        return query.test(state.name);
      })
    );




  }
    public getusersAsObservable(token:string):Observable<any> {
    let query = new RegExp(token, 'ig');
 
    return Observable.of(
      this.users.filter((state:any) => {
        return query.test(state);
      })
    );
    }
 
  public changeTypeaheadLoading(e:boolean):void {
    this.typeaheadLoading = e;
  }
 
  public changeTypeaheadNoResults(e:boolean):void {
    this.typeaheadNoResults = e;
  }
  
 
  public typeaheadOnSelect(e:TypeaheadMatch):void {
    console.log('Selected value: ', e.value);
    console.log(this.asyncSelected);
    console.log(this.asyncAmount);
  }


    GetAllUsers() {

        this.identity.GetAllUsers()
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



   click$: Observable<any> = new Subject().map( (value: any) => {

      const val = value;
     console.log(val);
       console.log('heeeey');
         this.FindByName(value.recipient, value.Amount);
     
  });
  
 subscription: any = this.click$.subscribe(
  x => console.log('onNext: %s', JSON.stringify(x)),
  e => console.log('onError: %s', e),
  () => console.log('onCompleted'));
  

testTake(){this.userData.take(1).subscribe(content => {

  console.log(content);

   this.complexForm.controls['Amount'].setValue(content.newTranscation.Amount);
      
    });}




    FindByName(username: string, summ: number) {

this.userData.take(1).subscribe(content => {

if (content.amount - summ <0)
{console.log("маааало");
alert("need more");
}
else if (summ < 0)
{alert("wrong summ!");}

else
{console.log("ноооорм");

  this.identity.FindByName(username, summ)
            .subscribe(
            (res: any) => {

                // IdentityResult.
                if (res.succeeded) {


 console.log(res.succeeded);
                    // Refreshes the users.
                   // this.getAll();

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
      
    });



      

    }

  ngOnInit() {

this.userData.take(1).subscribe(content => {

  console.log(content);

   this.complexForm.controls['Amount'].setValue(content.newTranscation.Amount);
      
    });




/*


 this.userData.first().subscribe(
            data => {
               

                 this.complexForm.value.recipient = data.newTranscation.RecipientUsername;

                   this.complexForm.value.Amount = data.newTranscation.Amount;

                    this.complexForm.controls['Amount'].setValue(data.newTranscation.Amount);
                     
                     var deletethis = this.complexForm.controls['Amount'].value;

                


                     console.log(deletethis);
 
            })
            
            */
            
//this.userData.unsubscribe();
  }

}
