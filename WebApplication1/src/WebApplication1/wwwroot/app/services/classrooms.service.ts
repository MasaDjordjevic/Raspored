import "rxjs/Rx"
import {Http, Response} from "angular2/http";
import {Injectable} from "angular2/core";
import {Headers, RequestOptions} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';
import {Classroom} from '../models/Classroom'


@Injectable()
export class ClassroomsService {
    constructor(private http: Http) { }

    private _url = 'api/Classrooms';
   

    getClassrooms(): Promise<Classroom[]> {
        return this.http.get(this._url + "/getClassrooms" )
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }
   
    addClassroom(number: string, projector: boolean, sunnySide: boolean): Promise<Classroom> {
        let body = JSON.stringify({ number, projector, sunnySide });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this._url + "/PostClassrooms", body, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    getSchedule(classroomID: number, weeksFromNow:number): Promise<any[]> {
        return this.http.get(this._url + `/GetSchedule/?classroomID=${classroomID}&weeksFromNow=${weeksFromNow}`)
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
        // In a real world app, we might send the error to remote logging infrastructure
        let errMsg = error.message || 'Server error';
        console.error(errMsg); // log to console instead
        return Promise.reject(errMsg);
    }

}