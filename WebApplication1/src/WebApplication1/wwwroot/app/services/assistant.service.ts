import "rxjs/Rx"
import {Http, Response, Headers, RequestOptions} from "angular2/http";
import {Injectable} from "angular2/core";
import {Observable} from 'rxjs/Observable';
import {Assistant} from '../models/Assistant';
import {ServiceService} from "./service.service";

@Injectable()
export class AssistantService  extends ServiceService {

    constructor(private http: Http) { }

    private _url = "api/assistants";

    getAssistant(assistantId: number): Promise<Assistant>{
        return this.http.get(this._url + "/GetAssistant/" + assistantId )
            .toPromise()
            .then(super.extractData)
            .catch(super.handleError);
    }

    getAssistants(): Promise<Assistant[]>{
        return this.http.get(this._url + "/GetAssistants" )
            .toPromise()
            .then(super.extractData)
            .catch(super.handleError);
    }

    //vraca sve asistente ako raspodela kojoj pripada grupa nije kreirana po kursu ili vraca sve asistente tog kursa
    getAssistantsByGroupID(groupID: number): Promise<Assistant[]>{
        return this.http.get(this._url + "/GetAssistantsByGroupID/" + groupID )
            .toPromise()
            .then(super.extractData)
            .catch(super.handleError);
    }

    getSchedule(assistantID: number, weeksFromNow:number): Promise<any[]> {
        return this.http.get(this._url + `/GetSchedule/?assistantID=${assistantID}&weeksFromNow=${weeksFromNow}`)
            .toPromise()
            .then(super.extractData)
            .catch(super.handleError);
    }

}

