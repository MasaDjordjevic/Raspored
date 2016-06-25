import "rxjs/Rx"
import {Http, Response} from "angular2/http";
import {Injectable} from "angular2/core";
import {Headers, RequestOptions} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';

import {Student} from "../models/Student";
import {TimeSpan} from "../models/TimeSpan";



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

    moveToGroup(studentID: number, groupID: number): Promise<any[]> {
            return this.http.get(this._url + `/MoveToGroup?studentID=${studentID}&groupID=${groupID}`)
                .toPromise()
                .then(this.extractData)
                .catch(this.handleError);
    }

    getSchedule(studentID: number, weeksFromNow:number): Promise<any[]> {
        return this.http.get(this._url + `/GetSchedule/?studentID=${studentID}&weeksFromNow=${weeksFromNow}`)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    getPersonalSchedule(studentID: number, weeksFromNow:number): Promise<any[]> {
        return this.http.get(this._url + `/GetPersonalSchedule/?studentID=${studentID}&weeksFromNow=${weeksFromNow}`)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    getOfficialSchedule(studentID: number, weeksFromNow:number): Promise<any[]> {
        return this.http.get(this._url + `/GetOfficialSchedule/?studentID=${studentID}&weeksFromNow=${weeksFromNow}`)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    removeFromGroup(studentID:number, groupID:number): Promise<any[]> {
            return this.http.get(this._url + `/RemoveFromGroup/?studentID=${studentID}&groupID=${groupID}`)
                .toPromise()
                .then(this.extractData)
                .catch(this.handleError);
    }

    hideClass(groupID:number): Promise<any[]> {
        return this.http.get(this._url + `/HideClass/?groupID=${groupID}`)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    unhideClass(groupID:number): Promise<any[]> {
        return this.http.get(this._url + `/UnHideClass/?groupID=${groupID}`)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    alertClass(groupID:number): Promise<any[]> {
    return this.http.get(this._url + `/AlertClass/?groupID=${groupID}`)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
    }

    public addActivity(classroomId: number, timespan: TimeSpan, title: string, content: string, place: string, groupId: number) {
        let body = JSON.stringify({
            "classroomID" : classroomId,
            "timeSpan" : timespan,
            "place" : place,
            "title" : title,
            "content" : content,
            "groupID": groupId
        });
        console.log(body);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this._url + '/AddActivity', body, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    deleteActivity(activityID:number): Promise<any[]> {
        return this.http.get(this._url + `/DeleteActivity/?activityID=${activityID}`)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    alertActivity(activityID:number): Promise<any[]> {
        return this.http.get(this._url + `/AlertActivity/?activityID=${activityID}`)
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