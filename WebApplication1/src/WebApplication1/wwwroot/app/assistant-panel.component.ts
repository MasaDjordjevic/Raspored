import {Component, OnInit} from "angular2/core";
import {Assistant} from "./assistant";
import {AssistantEditComponent} from "./assistant-edit.component";
import {ROUTER_DIRECTIVES, Route, RouteConfig} from 'angular2/router';
import {Router, RouteParams} from 'angular2/router';

import {AssistantPanelOptionsComponent} from "./assistant-panel-options.component";
import {DivisionsListComponent} from "./divisions-list.component";
import {DepartmentService} from "./department.service";
import {Department} from "./department";
import {YearDepartments} from './YearDepartments';

@RouteConfig([
    {
        path: '/',
        name: 'AssistantPanelOptions',
        component: AssistantPanelOptionsComponent,
        useAsDefault: true,
    },
    {
        path: '/department/:id/...',
        name: 'DivisionList',
        component: DivisionsListComponent,
    }
])

@Component({
    selector: "r-assistant-panel",
    directives: [ROUTER_DIRECTIVES],
    template: `
<h2>Asistentski panel</h2>
<h3>Departments list</h3>
<div class="container">
    <div *ngIf="yearDepartments != null">
        <div *ngFor="#yd of yearDepartments">
            <label>{{yd.year}}</label>
            <ul>
                <li *ngFor="#dep of yd.departments" [class.selected]="isSelected(dep)">
                    <a (click)="onSelect(dep.departmentID)">{{dep.departmentName}}</a>
                </li>         
            </ul>
        </div>
        <div>     
            <a (click)="onDeselect()">Back to General Assistant Panel Options</a>
        </div>
    </div>  
    <router-outlet></router-outlet>
</div>
    `,
    styles: [` *{color: black; text-decoration: none;}
                .selected a{color: #FF9D00;}
                .container {                        
                        display: flex;
                        flex-flow: row;
                        justify-content: flex-start;
    `],
    providers: [DepartmentService],
})
export class AssistantPanelComponent implements OnInit{
    assistant: Assistant;
    yearDepartments: YearDepartments[];
    errorMessage: string;
    selectedDepartmentID: number;

    constructor(private _departmentsService: DepartmentService, private _router: Router) { }

    ngOnInit() {
        this.getDepartmentsByYear();
    }

    getDepartmentsByYear() {
        this._departmentsService.getDepartmentsByYear()
            .then(
            deps => this.yearDepartments = deps,
            error => this.errorMessage = <any>error);
    }

    onSelect(departmentID: number) {
        this.selectedDepartmentID = departmentID;
        this._router.navigate(['DivisionList', { id: departmentID }]);
    }

    onDeselect() {
        this.selectedDepartmentID = -1;
        this._router.navigate(['AssistantPanelOptions']);
    }

    isSelected(department: Department) {
        return department.departmentID === this.selectedDepartmentID;
    }

}