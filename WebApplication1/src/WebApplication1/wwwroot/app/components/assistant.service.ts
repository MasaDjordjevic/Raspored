import "rxjs/Rx";
import {Http, Response, Headers, RequestOptions} from "angular2/http";
import {Injectable} from "angular2/core";
import {Observable} from 'rxjs/Observable';
import {Assistant} from './assistant';

@Injectable()
export class AssistantService {

    constructor(private http: Http) { }

    private _url = "api/unimembers";

    getAssistant(): Assistant[] {
        return [
            {
                id: 1,
                username: 'wlada',
                name: 'Vlada',
                surname: 'Mihajlovic',
                address: '331',
                email: 'wlada@elfak.ni.ac.rs',
                title: 'asistent',
            }
        ];
    }

    getAssistantById(id: number): Assistant {
        return {
            id: 1,
            username: 'wlada',
            name: 'Vlada',
            surname: 'Mihajlovic',
            address: '331',
            email: 'wlada@elfak.ni.ac.rs',
            title: 'asistent'
        };
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

