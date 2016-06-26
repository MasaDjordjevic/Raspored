import {Component} from "angular2/core";
import {GlobalService} from "../services/global.service";



@Component({
    selector: 'r-toast',
    templateUrl: 'app/global/toast.html',
    styleUrls: ['app/global/toast.css'],
    host: {
        "[style.display]": "message ? 'block' : 'none'"
    }
})

export class ToastComponent {

    constructor(
        private _globalService: GlobalService
    ) {
        this._globalService.toast$.subscribe(message => {
            this.message = message;
            setTimeout(() => {
                this.message = null;
            }, 6000);
        })
    }

    private message: string = null;

}