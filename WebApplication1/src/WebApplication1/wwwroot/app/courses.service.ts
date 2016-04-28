import "rxjs/Rx"
import {Http, Response} from "angular2/http";
import {Injectable} from "angular2/core";
import {Headers, RequestOptions} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';

import {Department} from "./department";
import {Course} from './course';



@Injectable()
export class CoursesService {
    constructor(private http: Http) { }

    private _url = "api/Courses";

    getCourses(): Promise<Course[]> {
        return this.http.get(this._url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    addCourse(code:string, alias:string, name: string, departmentID: number, semester:number): Promise<Course> {
        let body = JSON.stringify({ code, alias, name, departmentID, semester });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this._url + '/PostCourses', body, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    deleteCourse(courseID: number) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.delete(this._url + '/DeleteCourses/' + courseID, options)
            .toPromise().then(this.extractData).catch(this.handleError);
    }

    
    getCoursesOfDepartment(departmentID: number): Promise<Course[]> {
        return this.http.get(this._url + '/GetCoursesOfDepartment/' + departmentID)
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