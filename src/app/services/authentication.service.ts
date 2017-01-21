import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/timer';
import { Config } from '../config';
import { AuthHttp } from 'angular2-jwt';
import { HHelpers } from './HHelpers';



@Injectable()
export class AuthenticationService {







    /**
     * Stores the URL so we can redirect after signing in.
     */
    public redirectUrl: string;

    /**
     * User's data.
     */
    private user: any = {};

    /**
     * Token info.
     */
    private expiresIn: number;
    private authTime: number;

    /**
     * Scheduling of the refresh token.
     */
    private refreshSubscription: any;
    /**
     * Delay offset for the scheduling to avoid the inconsistency of data on the client.
     */
    private offsetSeconds: number = 30;

    private headers: Headers;
    private options: RequestOptions;


 //Helpers: any

    constructor(private http: Http, private authHttp: AuthHttp, public HHelpers: HHelpers) {


 
//this.Helpers = HHelpers;


        // On bootstrap or refresh, tries to get users'data.
        this.userInfo();

        // Creates header for post requests.
        this.headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        this.options = new RequestOptions({ headers: this.headers });

    }

    /**
     * Tries to sign in the user.
     *
     * @param username
     * @param password
     * @return The user's data
     */
    public signin(username: string, password: string): Observable<any> {

        // Token endpoint & params.
        let tokenEndpoint: string = Config.TOKEN_ENDPOINT;

        let params: any = {
            client_id: Config.CLIENT_ID,
            grant_type: Config.GRANT_TYPE,
            username: username,
            password: password,
            scope: Config.SCOPE
        };

        // Encodes the parameters.
        let body: string = this.encodeParams(params);

        this.authTime = new Date().valueOf();

        return this.http.post(tokenEndpoint, body, this.options)
            .map((res: Response) => {

                let body: any = res.json();

                // Sign in successful if there's an access token in the response.
                if (typeof body.access_token !== 'undefined') {

                    // Stores access token & refresh token.
                    this.store(body);
                    // Gets user info.
                    this.userInfo();

                }

            }).catch((error: any) => {

                // Error on post request.
                return Observable.throw(error);

            });

    }

    /**
     * Optional strategy for refresh token through a scheduler.
     *
     * It will schedule a refresh at the appropriate time.
     */
    public scheduleRefresh() {

        let source = this.authHttp.tokenStream.flatMap(
            (token: string) => {

                let delay: number = this.expiresIn - this.offsetSeconds * 1000;

                return Observable.interval(delay);

            });

        this.refreshSubscription = source.subscribe(() => {
            this.getNewToken().subscribe(
                () => { /*ok*/ },
                (error: any) => { this.unscheduleRefresh(); }
            );
        });

    }

    /**
     * Case when the user comes back to the app after closing it.
     */
    public startupTokenRefresh() {

        // If the user is authenticated, uses the token stream
        // provided by angular2-jwt and flatMap the token.
        if (this.HHelpers.tokenNotExpired()) {

            let source = this.authHttp.tokenStream.flatMap(
                (token: string) => {
                    let now: number = new Date().valueOf();
                    let exp: number = this.HHelpers.getExp();
                    let delay: number = exp - now - this.offsetSeconds * 1000;

                    // Uses the delay in a timer to run the refresh at the proper time. 
                    return Observable.timer(delay);
                });

            // Once the delay time from above is reached, gets a new JWT and schedules additional refreshes.
            source.subscribe(() => {
                this.getNewToken().subscribe(
                    () => {
                        this.scheduleRefresh();
                    },
                    (error: any) => { console.log(error); }
                );
            });

        }

    }

    /**
     * Unsubscribes from the scheduling of the refresh token.
     */
    public unscheduleRefresh() {

        if (this.refreshSubscription) {
            this.refreshSubscription.unsubscribe();
        }

    }

    /**
     * Tries to get a new token using refresh token.
     */
    public getNewToken(): Observable<any> {

        let refreshToken: string = this.HHelpers.getToken('refresh_token');

        // Token endpoint & params.
        let tokenEndpoint: string = Config.TOKEN_ENDPOINT;

        let params: any = {
            client_id: Config.CLIENT_ID,
            grant_type: "refresh_token",
            refresh_token: refreshToken
        };

        // Encodes the parameters.
        let body: string = this.encodeParams(params);

        this.authTime = new Date().valueOf();

        return this.http.post(tokenEndpoint, body, this.options)
            .map((res: Response) => {

                let body: any = res.json();

                // Successful if there's an access token in the response.
                if (typeof body.access_token !== 'undefined') {

                    // Stores access token & refresh token.
                    this.store(body);

                }

            }).catch((error: any) => {

                // Error on post request.
                return Observable.throw(error);

            });

    }

    /**
     * Revokes token.
     */
    public revokeToken(): void {

        let token: string = this.HHelpers.getToken('id_token');

        if (token != null) {

            // Revocation endpoint & params.
            let revocationEndpoint: string = Config.REVOCATION_ENDPOINT;

            let params: any = {
                client_id: Config.CLIENT_ID,
                token_type_hint: "access_token",
                token: token
            };

            // Encodes the parameters.
            let body: string = this.encodeParams(params);

            this.http.post(revocationEndpoint, body, this.options)
                .subscribe(
                () => {

                    this.HHelpers.removeToken('id_token');
                    this.HHelpers.removeExp();

                });

        }

    }

    /**
     * Revokes refresh token.
     */
    public revokeRefreshToken(): void {

        let refreshToken: string = this.HHelpers.getToken('refresh_token');

        if (refreshToken != null) {

            // Revocation endpoint & params.
            let revocationEndpoint: string = Config.REVOCATION_ENDPOINT;

            let params: any = {
                client_id: Config.CLIENT_ID,
                token_type_hint: "refresh_token",
                token: refreshToken
            };

            // Encodes the parameters.
            let body: string = this.encodeParams(params);

            this.http.post(revocationEndpoint, body, this.options)
                .subscribe(
                () => {

                    this.HHelpers.removeToken('refresh_token');

                });

        }

    }

    /**
     * Removes user and revokes tokens.
     */
    public signout(): void {

        this.redirectUrl = null;

        this.user = {};

        // Unschedules the refresh token.
        this.unscheduleRefresh();

        // Revokes tokens.
        this.revokeToken();
        this.revokeRefreshToken();

    }

    /**
     * Gets user's data.
     *
     * @return The user's data
     */
    public getUser(): any {

        return this.user;

    }

    /**
     * Calls UserInfo endpoint to retrieve user's data.
     */
    public userInfo() {

        let token: string = this.HHelpers.getToken('id_token');

        if (token != null && this.HHelpers.tokenNotExpired()) {
            this.authHttp.get(Config.USERINFO_ENDPOINT)
                .subscribe(
                (res: any) => {

                    this.user = res.json();

                },
                (error: any) => {

                    console.log(error);

                });
        }

    }



    public getAm(): any {

        let token: string = this.HHelpers.getToken('id_token');

        if (token != null && this.HHelpers.tokenNotExpired()) {
     return Observable
         .interval(5000).flatMap(x =>  this.HHelpers.getToken('id_token') != null?  this.authHttp.get('http://localhost:5000/api/identity/GetAmount') :  Observable.of('') )
        }

    }

    public fetchModel(): Observable<boolean> {
  if(!this.HHelpers.tokenNotExpired) {
    return new Observable<false>()
  }
  else {
    return new Observable<true>()
  }
}

/*

   public getAm() {

        let token: string = Helpers.getToken('id_token');

        if (token != null && tokenNotExpired()) {
     return Observable
         .interval(5000)
         .flatMap(() => 
         this.authHttp.get('http://localhost:5000/api/identity/GetAmount')
         
         );
        }

    }


*/



    /**
     * Encodes the parameters.
     *
     * @param params The parameters to be encoded
     * @return The encoded parameters
     */
    private encodeParams(params: any): string {

        let body: string = "";
        for (let key in params) {
            if (body.length) {
                body += "&";
            }
            body += key + "=";
            body += encodeURIComponent(params[key]);
        }

        return body;
    }

    /**
     * Stores access token & refresh token.
     *
     * @param body The response of the request to the token endpoint
     */
    private store(body: any): void {

        // Stores access token to keep user signed in.
        this.HHelpers.setToken('id_token', body.access_token);
        // Stores refresh token.
        this.HHelpers.setToken('refresh_token', body.refresh_token);

        // Calculates token expiration.
        this.expiresIn = <number>body.expires_in * 1000; // To milliseconds.
        // Stores token expiration.
        this.HHelpers.setExp(this.authTime + this.expiresIn);

    }

}

/**
 * Checks for presence of token and that token hasn't expired.
 * For use with the @CanActivate router decorator and NgIf.
 */




