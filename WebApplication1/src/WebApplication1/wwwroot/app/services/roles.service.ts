import "rxjs/Rx"
import {Http, Response} from "angular2/http";
import {Injectable} from "angular2/core";
import {Headers, RequestOptions} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';

import {Role} from '../models/Role';
import {ServiceService} from "./service.service";

@Injectable()
export class RolesService  extends ServiceService {
    constructor(private http: Http) { }

    private _heroesUrl = 'api/roles';

    get(onNext: (json: any) => void) {
        this.http.get("api/roles").map(response => response.json()).subscribe(onNext);
    }

    getHeroes(): Promise<Role[]> {
        return this.http.get(this._heroesUrl)
            .toPromise()
            .then(super.extractData)
            .catch(super.handleError);
    }
    addHero(name: string): Promise<Role> {
        let body = JSON.stringify({ name });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this._heroesUrl, body, options)
            .toPromise()
            .then(super.extractData)
            .catch(super.handleError);
    }

}