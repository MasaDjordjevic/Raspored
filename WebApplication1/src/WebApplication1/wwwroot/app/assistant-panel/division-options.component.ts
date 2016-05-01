// Angular2
import {Component, Input, OnInit} from "angular2/core";
import {RouteDefinition, RouteConfig, ROUTER_DIRECTIVES, Router, RouteParams} from "angular2/router";

// Models
import {Division} from "../models/Division";

// Services
import {DivisionsService} from "../services/divisions.service";


@Component({
    selector: 'r-division-options',
    template: `<p>Division Options a bre radi {{divisionID}}</p>`,
    styleUrls: ['app/assistant-panel/assistant-panel-options.css'],
})

export class DivisionOptionsComponent implements OnInit {

    divisionID: number = 5;

    constructor(
        private _params: RouteParams,
        private _router: Router,
        private _service: DivisionsService
    ) { }

    ngOnInit() {
        //TODO ne mogu da ga nateram da pikaze ovo dole -.-
        console.log(this._params);
        this.divisionID = +this._params.get('id');
        //this._service
    }

}