import "rxjs/Rx"
import {Http, Response, Headers, RequestOptions} from "angular2/http";
import {Injectable} from "angular2/core";
import {Observable} from 'rxjs/Observable';
import {Assistant} from '../models/Assistant';

@Injectable()
export class AssistantService {

    constructor(private http: Http) { }

    private _url = "api/assistants";

    getAssistant(assistantId: number): Promise<Assistant>{
        return this.http.get(this._url + "/GetAssistant/" + assistantId )
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    getAssistants(): Promise<Assistant[]>{
        return this.http.get(this._url + "/GetAssistants" )
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    //vraca sve asistente ako raspodela kojoj pripada grupa nije kreirana po kursu ili vraca sve asistente tog kursa
    getAssistantsByGroupID(groupID: number): Promise<Assistant[]>{
        return this.http.get(this._url + "/GetAssistantsByGroupID/" + groupID )
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    alter(newAssistant: Assistant) {
        alert("Sent to DB!"); //TODO
    }

    //getUnimembers(): Promise<Department[]> {
    //    return this.http.get(this._url).toPromise()
    //        .then(this.extractData)
    //        .catch(this.handleError);
    //}

    private extractData(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        return res.json() || {};
    }

    private handleError(error: any) {
        let errorMessage = error.message || 'Server error';
        console.log(errorMessage);
        return Promise.reject(errorMessage);
    }



}

