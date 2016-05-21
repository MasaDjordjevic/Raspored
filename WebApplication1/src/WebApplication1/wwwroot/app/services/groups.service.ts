import "rxjs/Rx"
import {Http, Response} from "angular2/http";
import {Injectable} from "angular2/core";
import {Headers, RequestOptions} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';

import {Group} from "../models/Group";




@Injectable()
export class GroupsService {
    constructor(private http: Http) { }

    private _url = "api/Groups";

    /**
     * GET: api/Groups/GetGroup/{group-id}
     * Uzima grupu čiji se ID poklapa sa prosleðenim parametrom.
     */
    getGroup(groupId: number): Promise<Group> {
        return this.http.get(this._url + '/GetGroup/' + groupId)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    updateGroup(groupID: number, name: string, classroomID: number, students: Array<number>) {
        let body = JSON.stringify({
            groupID: groupID,
            name: name,
            classroomID: classroomID,
            students: students
        });
        console.log(body);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this._url + '/Update', body, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    /**
     * GET: api/Groups/GetGroups/{division-id}
     * Uzima grupe koje pripadaju smeru čiji je ID prosleðen kao parametar.
     */
    getGroups(divisionID: number): Promise<Group[]> {
        return this.http.get(this._url + '/GetGroups/' + divisionID)
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