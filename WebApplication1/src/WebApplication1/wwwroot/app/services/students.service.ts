import "rxjs/Rx"
import {Http, Response} from "angular2/http";
import {Injectable} from "angular2/core";
import {Headers, RequestOptions} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';

import {Student} from "../models/Student";



@Injectable()
export class StudentsService {
    constructor(private http: Http) { }

    private _url = "api/Students";

    /**
     * GET: api/Students/GetStudent/{studentId}
     * Uzmi grupu čiji se ID poklapa sa prosleðenim parametrom.
     */
    getStudent(studentId: number): Promise<Student> {
        return this.http.get(this._url + '/GetStudent/' + studentId)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    /**
     * GET: api/Students/GetStudents/{groupId}
     * Uzmi studente koji pripadaju grupi sa prosleðenim ID-jem.
     */
    getStudents(groupId: number): Promise<Student[]> {
        return this.http.get(this._url + '/GetStudents/' + groupId)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    /**
     * GET: api/Students/GetStudentsOfDepartment/{departmentID}
     * Uzmi studente koji pripadaju smeru (department) sa prosleðenim ID-jem.
     */
    getStudentsOfDepartment(departmentID: number): Promise<Student[]> {
        return this.http.get(this._url + '/GetStudentsOfDepartment/' + departmentID)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    getStudentsOfCourse(courseID: number): Promise<any[]> {
        return this.http.get(this._url + '/GetStudentsOfCourse/' + courseID)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    addToGroup(studentID: number, groupID: number): Promise<any[]> {
            return this.http.get(this._url + `/AddToGroup?studentID=${studentID}&groupID=${groupID}`)
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