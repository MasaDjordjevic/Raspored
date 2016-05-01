﻿import "rxjs/Rx"
import {Http, Response} from "angular2/http";
import {Injectable} from "angular2/core";
import {Headers, RequestOptions} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';

import {Division} from "../models/Division";
import {TypeDivisions} from '../models/TypeDivisions';



@Injectable()
export class DivisionsService {
    constructor(private http: Http) { }

    private _url = "api/Divisions";


    getDivision(id: number) : Promise<Division> {
        return this.http.get(this._url + '/GetDivision/' + id)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    /**
     * Zahteva od servera sve raspodele (divisions) koje pripadaju smeru
     * (department) ciji je ID prosledjen.
     * GET: api/Divisions/GetDivisions/{id}
     */
    getDivisionsByType(departmentID: number): Promise<TypeDivisions[]> {
        return this.http.get(this._url + '/GetDivisions/' + departmentID)
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
        let errMsg = error.message || 'Server error';
        console.error(errMsg);
        return Promise.reject(errMsg);
    }

}