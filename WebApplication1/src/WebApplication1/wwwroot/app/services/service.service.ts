import "rxjs/Rx"
import {Http, Response} from "angular2/http";
import {Injectable} from "angular2/core";
import {Headers, RequestOptions} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';



@Injectable()
export class ServiceService {

    protected extractData(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        return body || {};
    }

    protected handleError(error: any) {
        let errMsg = error.message || 'Server error';
        console.error(errMsg);
        return Promise.reject(errMsg);
    }
} 