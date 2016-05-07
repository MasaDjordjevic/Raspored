import "rxjs/Rx"
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


    public getDivision(id: number) : Promise<Division> {
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
    public getDivisionsByType(departmentID: number): Promise<TypeDivisions[]> {
        return this.http.get(this._url + '/GetDivisions/' + departmentID)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    /**
     * Vraca grupe studenata kada se svi studenti koji slusaju kurs podele na X grupa.
     */
    public getGroupsOnX(courseID: number, x: number, sortOrder: number) {
        return this.http.get(this._url + `/DevideOnX?courseID=${courseID}&x=${x}&sortOrder=${sortOrder}`)
            .toPromise().then(this.extractData).catch(this.handleError);
    }

    /**
     * Vraca grupe studenata kada se svi studenti koji slusaju kurs podele tako da svaka grupa ima X studenata.
     */
    public getGroupsWithX(courseID: number, x: number, sortOrder: number) {
        return this.http.get(this._url + `/DevideWithX?courseID=${courseID}&x=${x}&sortOrder=${sortOrder}`)
            .toPromise().then(this.extractData).catch(this.handleError);
    }
    
    public getAllDivisionTypes() {
        return this.http.get(this._url + '/GetAllDivisionTypes')
            .toPromise().then(this.extractData).catch(this.handleError);
    }

    public createInitialDivision(name: string, departmentID: number,
                                 courseID: number, divisionTypeID: number,
                                 beginning: Date, ending: Date,
                                 groups: Array<any>) {
        let body = JSON.stringify({
            name: name,
            departmentID: departmentID,
            courseID: courseID,
            divisionTypeID: divisionTypeID,
            beginning: beginning,
            ending: ending,
            groups: groups
        });
        debugger;
        console.log(body);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this._url + '/CreateInitialDivision', body, options)
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