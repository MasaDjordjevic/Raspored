import "rxjs/Rx"
import {Http, Response} from "angular2/http";
import {Injectable} from "angular2/core";
import {Headers, RequestOptions} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';

import {Student} from "../models/Student";
import {TimeSpan} from "../models/TimeSpan";
import {ServiceService} from "./service.service";



@Injectable()
export class StudentsService extends ServiceService {
    constructor(private http: Http) { }

    private _url = "api/Students";

    /**
     * GET: api/Students/GetStudent/{studentId}
     * Uzmi grupu čiji se ID poklapa sa prosleðenim parametrom.
     */
    getStudent(studentId: number): Promise<Student> {
        return this.http.get(this._url + '/GetStudent/' + studentId)
            .toPromise()
            .then(super.extractData)
            .catch(super.handleError);
    }

    /**
     * GET: api/Students/GetStudents/{groupId}
     * Uzmi studente koji pripadaju grupi sa prosleðenim ID-jem.
     */
    getStudents(groupId: number): Promise<Student[]> {
        return this.http.get(this._url + '/GetStudents/' + groupId)
            .toPromise()
            .then(super.extractData)
            .catch(super.handleError);
    }

    /**
     * GET: api/Students/GetStudentsOfDepartment/{departmentID}
     * Uzmi studente koji pripadaju smeru (department) sa prosleðenim ID-jem.
     */
    getStudentsOfDepartment(departmentID: number): Promise<Student[]> {
        return this.http.get(this._url + '/GetStudentsOfDepartment/' + departmentID)
            .toPromise()
            .then(super.extractData)
            .catch(super.handleError);
    }

    getStudentsOfCourse(courseID: number): Promise<any[]> {
        return this.http.get(this._url + '/GetStudentsOfCourse/' + courseID)
            .toPromise()
            .then(super.extractData)
            .catch(super.handleError);
    }

    moveToGroup(studentID: number, groupID: number): Promise<any[]> {
            return this.http.get(this._url + `/MoveToGroup?studentID=${studentID}&groupID=${groupID}`)
                .toPromise()
                .then(super.extractData)
                .catch(super.handleError);
    }

    getSchedule(studentID: number, weeksFromNow:number): Promise<any[]> {
        return this.http.get(this._url + `/GetSchedule/?studentID=${studentID}&weeksFromNow=${weeksFromNow}`)
            .toPromise()
            .then(super.extractData)
            .catch(super.handleError);
    }

    getPersonalSchedule(studentID: number, weeksFromNow:number): Promise<any[]> {
        return this.http.get(this._url + `/GetPersonalSchedule/?studentID=${studentID}&weeksFromNow=${weeksFromNow}`)
            .toPromise()
            .then(super.extractData)
            .catch(super.handleError);
    }

    getOfficialSchedule(studentID: number, weeksFromNow:number): Promise<any[]> {
        return this.http.get(this._url + `/GetOfficialSchedule/?studentID=${studentID}&weeksFromNow=${weeksFromNow}`)
            .toPromise()
            .then(super.extractData)
            .catch(super.handleError);
    }

    removeFromGroup(studentID:number, groupID:number): Promise<any[]> {
            return this.http.get(this._url + `/RemoveFromGroup/?studentID=${studentID}&groupID=${groupID}`)
                .toPromise()
                .then(super.extractData)
                .catch(super.handleError);
    }

    hideClass(groupID:number): Promise<any[]> {
        return this.http.get(this._url + `/HideClass/?groupID=${groupID}`)
            .toPromise()
            .then(super.extractData)
            .catch(super.handleError);
    }

    unhideClass(groupID:number): Promise<any[]> {
        return this.http.get(this._url + `/AddClassToPersonalSchedule/?groupID=${groupID}`)
            .toPromise()
            .then(super.extractData)
            .catch(super.handleError);
    }

    alertClass(groupID:number): Promise<any[]> {
    return this.http.get(this._url + `/AlertClass/?groupID=${groupID}`)
        .toPromise()
        .then(super.extractData)
        .catch(super.handleError);
    }

    public addActivity(groupId: number, classroomId: number, place: string,
                       title: string, content: string, timespan: TimeSpan) {
        debugger;
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
            .then(super.extractData)
            .catch(super.handleError);
    }

    deleteActivity(activityID:number): Promise<any[]> {
        return this.http.get(this._url + `/DeleteActivity/?activityID=${activityID}`)
            .toPromise()
            .then(super.extractData)
            .catch(super.handleError);
    }

    alertActivity(activityID:number): Promise<any[]> {
        return this.http.get(this._url + `/AlertActivity/?activityID=${activityID}`)
            .toPromise()
            .then(super.extractData)
            .catch(super.handleError);
    }

}