﻿import "rxjs/Rx"
import {Http, Response} from "angular2/http";
import {Injectable} from "angular2/core";
import {Headers, RequestOptions} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';

import {Role} from '../models/Role';

@Injectable()
export class RolesService {
    constructor(private http: Http) { }

    private _heroesUrl = 'api/roles';

    get(onNext: (json: any) => void) {
        this.http.get("api/roles").map(response => response.json()).subscribe(onNext);
    }

    getHeroes(): Promise<Role[]> {
        return this.http.get(this._heroesUrl)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }
    addHero(name: string): Promise<Role> {
        let body = JSON.stringify({ name });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this._heroesUrl, body, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }
    private extractData(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        return body || {};
    }
    private handleError(error: any) {
        // In a real world app, we might send the error to remote logging infrastructure
        let errMsg = error.message || 'Server error';
        console.error(errMsg); // log to console instead
        return Promise.reject(errMsg);
    }

}