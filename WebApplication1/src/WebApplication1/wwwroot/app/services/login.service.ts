import "rxjs/Rx"
import {Http, Response} from "angular2/http";
import {Injectable} from "angular2/core";
import {Headers, RequestOptions} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';
import {ServiceService} from "./service.service";


@Injectable()
export class LoginService extends ServiceService{
    constructor(private http:Http) {
    }

    private _url = 'api/Login';

    login(username: string, password: string): Promise<any> {
        let body = JSON.stringify({
            "username": username,
            "password": password,
        });
        console.log(body);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this._url + '/Login', body, options)
            .toPromise()
            .then(super.extractData)
            .catch(super.handleError);

    }

    loginRedirect() {
        return this.http.get(this._url + '/LoginRedirect')
            .toPromise()
            .then(super.extractData)
            .catch(super.handleError);
    }

    getUser() {
        return this.http.get(this._url + '/GetUser')
            .toPromise()
            .then(super.extractData)
            .catch(super.handleError);
    }

    logout() {
        return this.http.get(this._url + '/Logout')
            .toPromise()
            .then(super.extractData)
            .catch(super.handleError);
    }

    isAllowedStudent() {
        return this.http.get(this._url + '/IsAllowedStudent')
            .toPromise()
            .then(super.extractData)
            .catch(super.handleError);
    }

    isAllowedAssistant() {
        return this.http.get(this._url + '/IsAllowedAssistant')
            .toPromise()
            .then(super.extractData)
            .catch(super.handleError);
    }

}