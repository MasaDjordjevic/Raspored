import "rxjs/Rx"
import {Http, Response} from "angular2/http";
import {Injectable} from "angular2/core";
import {Headers, RequestOptions} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';

import {YearDepartments} from '../models/YearDepartments';
import {Department} from "../models/Department";
import {ServiceService} from "./service.service";

@Injectable()
export class DepartmentService  extends ServiceService {
    constructor(private http: Http) { }

    private _url = "api/departments";

    getDepartment(id: number): Promise<Department> {
        return this.http.get(this._url + '/GetDepartments/' + id)
            .toPromise()
            .then(super.extractData)
            .catch(super.handleError);
    }

    getDepartments(): Promise<Department[]> {
        return this.http.get(this._url + '/GetDepartments')
            .toPromise()
            .then(super.extractData)
            .catch(super.handleError);
    }

    getDepartmentsByYear(): Promise<YearDepartments[]> {
        return this.http.get(this._url + '/GetDepartmentsByYear')
            .toPromise()
            .then(super.extractData)
            .catch(super.handleError);
    }

    addDepartment(departmentName: string, year: number): Promise<Department> {
        let body = JSON.stringify({ departmentName, year });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this._url + '/PostDepartments', body, options)
            .toPromise()
            .then(super.extractData)
            .catch(super.handleError);
    }

    deleteDepartment(departmentID: number) {
        //let body = JSON.stringify({ departmentID });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.delete(this._url + '/DeleteDepartments/' + departmentID, options)
            .toPromise().then(super.extractData).catch(super.handleError);
    }

    getSchedule(departmentID: number, weeksFromNow:number): Promise<any[]> {
        return this.http.get(this._url + `/GetSchedule/?departmentID=${departmentID}&weeksFromNow=${weeksFromNow}`)
            .toPromise()
            .then(super.extractData)
            .catch(super.handleError);
    }


}