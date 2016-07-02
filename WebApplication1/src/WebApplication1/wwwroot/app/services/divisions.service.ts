import "rxjs/Rx"
import {Http, Response} from "angular2/http";
import {Injectable} from "angular2/core";
import {Headers, RequestOptions} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';

import {Division} from "../models/Division";
import {TypeDivisions} from '../models/TypeDivisions';
import {ServiceService} from "./service.service";



@Injectable()
export class DivisionsService extends ServiceService  {
    constructor(private http: Http) { }

    private _url = "api/Divisions";


    public getDivision(id: number) : Promise<Division> {
        return this.http.get(this._url + '/GetDivision/' + id)
            .toPromise()
            .then(super.extractData)
            .catch(super.handleError);
    }

    public updateDivision(divisionId, name, beginning, ending, divisionTypeID, courseID) {
        let body = JSON.stringify({
            "divisionID": divisionId,
            "name": name,
            "beginning": new Date(beginning),
            "ending": new Date(ending),
            "divisionTypeID": divisionTypeID,
            "courseID": courseID,
        });
        console.log(body);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this._url + '/UpdateDivision', body, options)
            .toPromise()
            .then(super.extractData)
            .catch(super.handleError);
    }

    public copyDivision(divisionId) {
        return this.http.get(this._url + '/CopyDivision/?divisionID=' + divisionId)
            .toPromise()
            .then(super.extractData)
            .catch(super.handleError);
    }

    public deleteDivision(divisionId) {
        return this.http.get(this._url + '/DeleteDivision/?divisionID=' + divisionId)
            .toPromise()
            .then(super.extractData)
            .catch(super.handleError);
    }

    /**
     * Zahteva od servera sve raspodele (divisions) koje pripadaju smeru
     * (department) ciji je ID prosledjen.
     * GET: api/Divisions/GetDivisions/{id}
     */
    public getDivisionsByType(departmentID: number): Promise<TypeDivisions[]> {
        return this.http.get(this._url + '/GetDivisions/' + departmentID)
            .toPromise()
            .then(super.extractData)
            .catch(super.handleError);
    }   

    /**
     * Vraca grupe studenata kada se svi studenti koji slusaju kurs podele na X grupa.
     */
    public getGroupsOnX(courseID: number, x: number, sortOrder: number) {
        return this.http.get(this._url + `/DivideOnX?courseID=${courseID}&x=${x}&sortOrder=${sortOrder}`)
            .toPromise().then(super.extractData).catch(super.handleError);
    }

    /**
     * Vraca grupe studenata kada se svi studenti koji slusaju kurs podele tako da svaka grupa ima X studenata.
     */
    public getGroupsWithX(courseID: number, x: number, sortOrder: number) {
        return this.http.get(this._url + `/DivideWithX?courseID=${courseID}&x=${x}&sortOrder=${sortOrder}`)
            .toPromise().then(super.extractData).catch(super.handleError);
    }
    
    public getAllDivisionTypes() {
        return this.http.get(this._url + '/GetAllDivisionTypes')
            .toPromise().then(super.extractData).catch(super.handleError);
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
        /*debugger;*/
        console.log(body);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this._url + '/CreateInitialDivision', body, options)
            .toPromise()
            .then(super.extractData)
            .catch(super.handleError);
    }
}