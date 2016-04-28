import {Component, OnInit} from "angular2/core";
import {RouteParams, Router, RouteDefinition, RouteConfig, Location, ROUTER_DIRECTIVES} from "angular2/router";
import {DivisionOptionsComponent} from "./division-options.component";
import {StudentsListComponent} from "./students-list.component";

import {Group} from './Group';
import {GroupsService} from './groups.service';

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
        template: `
<h3>Divisions List</h3>
<div class="container">
    <div *ngIf="groups != null">
        <div *ngFor="#gr of groups">
            <a (click)="onSelect(gr.groupID)" [class.selected]="isSelected(gr)">{{gr.classroomNumber}}</a>
            <span>s: {{gr.timeSpan.startDate}} </span>
            <span>e: {{gr.timeSpan.endDate}} </span>
            <span>p: {{gr.timeSpan.period}} </span>
        </div>
        <div>     
            <a (click)="onDeselect()">Back to Division Options</a>
        </div>
    </div>  
    <router-outlet></router-outlet>
</div>
`,
        directives: [ROUTER_DIRECTIVES],
        styles: [` *{color: black; text-decoration: none;}
                .selected {color: #FF9D00;}
                .container {                        
                        display: flex;
                        flex-flow: row;
                        justify-content: flex-start;
    `],
        providers: [GroupsService],
    })
export class GroupsListComponent implements OnInit {
    groups: Group[];
    errorMessage: string;
    selectedDivisionID: number;
    selectedGroupID: number;

    constructor(private routeParams: RouteParams, private _router: Router, private _groupsService: GroupsService) { }

    ngOnInit() {
        this.selectedDivisionID = 2;
        //puca aplikacija kada dodam routParams
        this.selectedDivisionID = +this.routeParams.get('id');
        this.getGroups();
    }

    getGroups() {
        this._groupsService.getGroups(this.selectedDivisionID)
            .then(
            groups => this.groups = groups,
            error => this.errorMessage = <any>error);
    }

    onSelect(groupID: number) {
        this.selectedGroupID = groupID;
        this._router.navigate(['StudentsList', { id: groupID }]);
    }

    onDeselect() {
        this.selectedGroupID = -1;
        this._router.navigate(['DivisionOptions']);
    }

    isSelected(group: Group) {
        return group.groupID === this.selectedGroupID;
    }

}