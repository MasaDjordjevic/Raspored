// Angular2
import {Component, OnInit} from "angular2/core";
import {RouteDefinition, RouteConfig, ROUTER_DIRECTIVES, Router, RouteParams} from "angular2/router";
import {Location} from "angular2/platform/common";

// Components
import {DivisionOptionsComponent} from "./division-options.component";
import {StudentsListComponent} from "./students-list.component";

// Models
import {Group} from '../models/Group';

// Services
import {GroupsService} from '../services/groups.service';

// UI
import {RList} from '../ui/r-list';


@RouteConfig([
    {
        path: '/',
        component: DivisionOptionsComponent,
        name: 'DivisionOptions',
        useAsDefault: true,
    },
    {
        path: '/group/:id/...',
        component: StudentsListComponent,
        name: 'StudentsList'
    }
])

@Component({
    selector: 'r-groups-list',
    template: `
    <r-list [titleString]="titleString"
            [data]="listData"
            (selectItem)="onSelect($event)">
    </r-list>
    <router-outlet></router-outlet>
`,
        directives: [ROUTER_DIRECTIVES, RList],
        styleUrls: ['app/assistant-panel/groups-list.css'],
        providers: [GroupsService],
    })
export class GroupsListComponent implements OnInit {
    groups: Group[];
    errorMessage: string;
    selectedDivisionID: number;
    selectedGroupID: number;
    titleString: string = "Grupe";

    _listData = null;

    constructor(
        private routeParams: RouteParams,
        private _router: Router,
        private _groupsService: GroupsService
    ) { }

    ngOnInit() {
        //TODO sta je ovo dole?
        this.selectedDivisionID = 2;
        //TODO puca aplikacija kada dodam routParams
        this.selectedDivisionID = +this.routeParams.get('divid');
        console.log(this.routeParams);
        this.getGroups();
    }

    get listData() {
        if (!this.groups) return;
        if (!this._listData) this._listData = [];
        for (let i = 0; i < this.groups.length; i++) {
            this._listData[i] = {
                s: this.groups[i].classroomNumber,
                id: this.groups[i].groupID
            };
        }
        return this._listData;
    }

    set listData(data) {
        this._listData = data;
    }

    getGroups() {
        this._groupsService.getGroups(this.selectedDivisionID)
            .then(
            groups => this.groups = groups,
            error => this.errorMessage = <any>error);
    }

    onSelect(groupID: number) {
        console.log("Group ID " + groupID);
        this.selectedGroupID = groupID;
        this._router.navigate(['StudentsList', { id: groupID }]);
    }

    onDeselect() {
        this.selectedGroupID = -1;
        this._router.navigate(['DivisionOptions']);
    }

}
