// Angular2
import {Component, OnInit} from "angular2/core";
import {RouteDefinition, RouteConfig, ROUTER_DIRECTIVES, Router, RouteParams} from "angular2/router";
import {Location} from "angular2/platform/common";

// Components
import {DepartmentOptionsComponent} from "./department-options.component";
import {GroupsListComponent} from "./groups-list.component";

// Services
import {DivisionsService} from '../services/divisions.service';

// Models
import {TypeDivisions} from '../models/TypeDivisions';
import {Division} from '../models/Division';

// UI
import {R_NESTED_LIST_DIRECTIVES} from "../ui/r-nested-list";

// Interfaces
import {INestedList, NestedList} from "../INestedList";


@RouteConfig([
    {
        path: '/',
        component: DepartmentOptionsComponent,
        name: 'DepartmentOptions',
        useAsDefault: true,
    }, 
    {
        path: '/division/:divid/...',
        component: GroupsListComponent,
        name: 'GroupsList'
    }
])

@Component({
    selector: 'r-divisions-list',
    templateUrl: 'app/assistant-panel/divisions-list.html',
    styleUrls: ['app/assistant-panel/divisions-list.css'],
    directives: [ROUTER_DIRECTIVES, R_NESTED_LIST_DIRECTIVES],
    providers: [DivisionsService],
})

export class DivisionsListComponent implements OnInit {

    typeDivisions: TypeDivisions[];
    errorMessage: string;
    selectedDivisionID: number;
    selectedDepartmentID: number;
    titleString: string = "Raspodele";

    private _nestedListData = null;

    constructor(
        private routeParams: RouteParams,
        private _router: Router,
        private _divisionsService: DivisionsService
    ) { }

    ngOnInit() {
        //TODO sta ce ti ovo dole?
        this.selectedDepartmentID = 1;
        //puca aplikacija kada dodam routParams //TODO ??? pa dodala si ga i radi?
        this.selectedDepartmentID = +this.routeParams.get('depid');
        console.log(this.selectedDepartmentID);
        console.log(this.routeParams);
        this.getDivisionsByType();
    }

    get nestedListData() {
        if (!this.typeDivisions) return;
        if (!this._nestedListData) this._nestedListData = new Array<NestedList>();

        for (let i = 0; i < this.typeDivisions.length; i++) {
            if (!this._nestedListData[i]) this._nestedListData[i] = new NestedList;
            this._nestedListData[i].outer = {
                s: this.typeDivisions[i].type,
                id: this.typeDivisions[i].type
            };
            if (!this._nestedListData[i].inner) this._nestedListData[i].inner = [];
            for (let j = 0; j < this.typeDivisions[i].divisions.length; j++) {
                this._nestedListData[i].inner[j] = {
                    s: this.typeDivisions[i].divisions[j].departmentName,
                    id: this.typeDivisions[i].divisions[j].divisionID
                };
            }
        }
        return this._nestedListData;
    }

    set nestedListData(data) {
        this._nestedListData = data;
    }

    getDivisionsByType() {
        this._divisionsService.getDivisionsByType(this.selectedDepartmentID)
            .then(
            divs => this.typeDivisions = divs,
            error => this.errorMessage = <any>error);
    }

    onSelect(divisionID: number) {
        this.selectedDivisionID = divisionID;
        this._router.navigate(['GroupsList', { divid: divisionID }]);
    }

    onDeselect() {
        this.selectedDivisionID = -1;
        this._router.navigate(['DepartmentOptions']);
    }
    
}
