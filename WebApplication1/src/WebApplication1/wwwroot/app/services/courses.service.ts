import "rxjs/Rx"
import {Http, Response} from "angular2/http";
import {Injectable} from "angular2/core";
import {Headers, RequestOptions} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';

import {Department} from "../models/Department";
import {Course} from '../models/Course';
import {ServiceService} from "./service.service";



@Injectable()
export class CoursesService  extends ServiceService {
    constructor(private http: Http) { }

    private _url = "api/Courses";

    getCourses(): Promise<Course[]> {
        return this.http.get(this._url)
            .toPromise().then(super.extractData).catch(super.handleError);
    }

    addCourse(code:string, alias:string, name: string, departmentID: number, semester:number): Promise<Course> {
        let body = JSON.stringify({ code, alias, name, departmentID, semester });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this._url + '/PostCourses', body, options)
            .toPromise().then(super.extractData).catch(super.handleError);
    }

    deleteCourse(courseID: number) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.delete(this._url + '/DeleteCourses/' + courseID, options)
            .toPromise().then(super.extractData).catch(super.handleError);
    }

    // Vrati predmete (courses) koji odgovaraju prosledjenom smeru (department).
    // [GET] api/Courses/GetCoursesOfDepartment/{department-id}
    getCoursesOfDepartment(departmentID: number): Promise<Course[]> {
        return this.http.get(this._url + '/GetCoursesOfDepartment/' + departmentID)
            .toPromise().then(super.extractData).catch(super.handleError);
    }

}