import { ActionReducer, Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { transition } from '@angular/core';


export const ActionTypes = {
    UpdateAmount: '[UserData] UpdateAmount',
    UpdateHistory: '[UserData] UpdateHistory',
    AddNewTransaction: '[UserData] AddNewTransaction'

};

export class UpdateAmount implements Action {
    public type = ActionTypes.UpdateAmount;

    constructor(public payload: number) { }
}

export class UpdateHistory implements Action {
    public type = ActionTypes.UpdateHistory;

    constructor(public payload?: transaction[]) { }
}

export class AddNewTransaction implements Action {
    public type = ActionTypes.AddNewTransaction;

    constructor(public payload?: transaction) { }
}

export type Actions
    = UpdateAmount
    | UpdateHistory
    | AddNewTransaction


interface data {



    message: string;


}

interface transaction {
    Id: number;
    amount: number;
    SenderUsername: string;
    RecipientUsername: string;
    Date: string;

}

export interface State {

    amount: number;
    transactions: transaction[];
    newTranscation: transaction;

}

const initialState: State = {

    amount: null,

    transactions: null,

    newTranscation: {Id : 0, amount : 0, SenderUsername: "teesst@mail.com", RecipientUsername: "teeeeesting@mail.com", Date: "date"}



};

export function UserDataReducer(state: State = initialState, action: Actions) {
    //  export  const reducer: ActionReducer<State[]> = (state: State[] = initialState, action: Actions) => {
    switch (action.type) {
        case ActionTypes.UpdateAmount: {
            var amount2 = action.payload;


           return Object.assign({}, state, { amount: amount2 });

          //   return state.amount = parseInt(amount2);

        }

        case ActionTypes.UpdateHistory: {
            return Object.assign({}, state, { transactions: action.payload });
        }

          case ActionTypes.AddNewTransaction: {
            return Object.assign({}, state, { newTranscation: action.payload });
        }



        default:
            return state;
    }
}