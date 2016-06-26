import "rxjs/Rx"
import {Http, Response} from "angular2/http";
import {Injectable} from "angular2/core";
import {Headers, RequestOptions} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';

import {Group} from "../models/Group";
import {TimeSpan} from "../models/TimeSpan";




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

    updateGroup(groupID: number, divisionID: number, assistantID:number, name: string, classroomID: number, timespan: any, students: Array<number>) {
        let body = JSON.stringify({
            groupID: groupID,
            name: name,
            classroomID: classroomID,
            students: students,
            divisionID: divisionID,
            assistantID: assistantID,
            timespan: timespan
        });
        console.log(body);
        /*debugger;*/
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this._url + '/Update', body, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }
    

    removeGroup(groupId:number) {
        return this.http.delete(this._url + '/DeleteGroups/' + groupId)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    addActivity(groupID: number, classroomID:number, place: string, title: string, content:string, timespan: TimeSpan) {
        let body = JSON.stringify({
            groupID: groupID,
            classroomID: classroomID,
            place: place,
            title: title,
            content: content,
            timespan: timespan
        });
        console.log(body);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this._url + '/AddActivity', body, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    cancelClass(groupID:number, title: string, content: string, timespan: TimeSpan) {
        let body = JSON.stringify({
            groupID: groupID,
            title: title,
            content: content,
            timespan: timespan
        });
        console.log(body);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this._url + '/CancelClass', body, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    unCancelClass(activityID:number): Promise<any[]> {
        return this.http.get(this._url + `/UnCancelClass/?activityID=${activityID}`)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    getCanceledTimes(groupID: number): Promise<any[]> {
        return this.http.get(this._url + `/GetCanceledTimes/?groupID=${groupID}`)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    getSchedule(groupID: number, weeksFromNow:number): Promise<any[]> {
        return this.http.get(this._url + `/GetSchedule/?groupID=${groupID}&weeksFromNow=${weeksFromNow}`)
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

    massGroupEdit(sendData: any) {
        let body = JSON.stringify({
            groups: sendData
        });
        console.log(body);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this._url + '/MassGroupEdit', body, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    //////// BulletinBoard ///////////

    getAllBulletinBoardChoices(groupId: number): Promise<Group> {
        return this.http.get(this._url + '/GetAllBulletinBoardChoices/' + groupId)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    getPossibleBulletinBoardChoices(groupId: number): Promise<Group> {
        return this.http.get(this._url + '/GetPossibleBulletinBoardChoices/' + groupId)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    exchangeStudents(groupId: number, adID: number): Promise<Group> {
        return this.http.get(this._url + `/ExchangeStudents/?groupID=${groupId}&adID=${adID}`)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    addAd(groupID: number, groupIDs: any) {
        let body = JSON.stringify({
            groupID: groupID,
            groupIDs: groupIDs
        });
        console.log(body);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this._url + '/AddAd', body, options)
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