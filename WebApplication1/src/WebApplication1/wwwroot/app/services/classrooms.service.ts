import "rxjs/Rx"
import {Http, Response} from "angular2/http";
import {Injectable} from "angular2/core";
import {Headers, RequestOptions} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';
import {Classroom} from '../models/Classroom'
import {ServiceService} from "./service.service";


@Injectable()
export class ClassroomsService extends ServiceService  {
    constructor(private http: Http) { }

    private _url = 'api/Classrooms';
   

    getClassrooms(): Promise<Classroom[]> {
        return this.http.get(this._url + "/getClassrooms" )
            .toPromise()
            .then(super.extractData)
            .catch(super.handleError);
    }
   
    addClassroom(number: string, projector: boolean, sunnySide: boolean): Promise<Classroom> {
        let body = JSON.stringify({ number, projector, sunnySide });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this._url + "/PostClassrooms", body, options)
            .toPromise()
            .then(super.extractData)
            .catch(super.handleError);
    }

    getSchedule(classroomID: number, weeksFromNow:number): Promise<any[]> {
        return this.http.get(this._url + `/GetSchedule/?classroomID=${classroomID}&weeksFromNow=${weeksFromNow}`)
            .toPromise()
            .then(super.extractData)
            .catch(super.handleError);
    }

}