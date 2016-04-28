import "rxjs/Rx"
import {Http, Response} from "angular2/http";
import {Injectable} from "angular2/core";
import {Department} from "./department";
import {Headers, RequestOptions} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';
import {YearDepartments} from './YearDepartments';

@Injectable()
export class DepartmentService {
    constructor(private http: Http) { }

    private _url = "api/departments";

    getDepartments(): Promise<Department[]> {
        return this.http.get(this._url + '/GetDepartments')
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    getDepartmentsByYear(): Promise<YearDepartments[]> {
        return this.http.get(this._url + '/GetDepartmentsByYear')
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    addDepartment(departmentName: string, year: number): Promise<Department> {
        let body = JSON.stringify({ departmentName, year });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this._url + '/PostDepartments', body, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    deleteDepartment(departmentID: number) {
        //let body = JSON.stringify({ departmentID });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.delete(this._url + '/DeleteDepartments/' + departmentID, options)
            .toPromise().then(this.extractData).catch(this.handleError);
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