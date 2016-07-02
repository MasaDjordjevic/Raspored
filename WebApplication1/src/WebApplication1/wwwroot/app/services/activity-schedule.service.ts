import "rxjs/Rx"
import {Http, Response} from "angular2/http";
import {Injectable} from "angular2/core";
import {Headers, RequestOptions} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';
import {ServiceService} from "./service.service";

@Injectable()
export class ActivityScheduleService extends ServiceService {
    constructor(private http:Http) {
    }

    private _url = "api/ActivitySchedules";

    //varaca objekat sa beginning i ending
    getCurrentSemesterTimeSpan(){
        return this.http.get(this._url + '/GetCurrentSemesterTimeSpan/')
            .toPromise()
            .then(super.extractData)
            .catch(super.handleError);
    }

    deleteGlobalActivity(activityID: number) {
        return this.http.get(this._url + '/DeleteGlobalActivity/' + activityID)
            .toPromise()
            .then(super.extractData)
            .catch(super.handleError);
    }
}