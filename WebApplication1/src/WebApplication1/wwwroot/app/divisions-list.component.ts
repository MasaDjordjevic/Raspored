import {Component, OnInit} from "angular2/core";
import {RouteDefinition, RouteConfig, Location, ROUTER_DIRECTIVES} from "angular2/router";
import {Router, RouteParams} from 'angular2/router';

import {DepartmentOptionsComponent} from "./department-options.component";
import {GroupsListComponent} from "./groups-list.component";
import {TypeDivisions} from './TypeDivisions';
import {Division} from './Division';
import {DivisionsService} from './divisions.service';

@RouteConfig([
    {
        path: '/',
        component: DepartmentOptionsComponent,
        name: 'DepartmentOptions',
        useAsDefault: true,
    }, 
    {
        path: '/division/:id/...',
        component: GroupsListComponent,
        name: 'GroupsList'
    }
])
@Component({
        template: `
<h3>Divisions List</h3>
<div class="container">
    <div *ngIf="typeDivisions != null">
        <div *ngFor="#td of typeDivisions">
            <label>{{td.type}}</label>
            <ul>
                <li *ngFor="#div of td.divisions" [class.selected]="isSelected(div)">
                    <a (click)="onSelect(div.divisionID)">{{div.creatorName}}</a>
                </li>         
            </ul>
        </div>
        <div>     
            <a (click)="onDeselect()">Back to Department Options</a>
        </div>
    </div>  
    <router-outlet></router-outlet>
</div>
`,
        directives: [ROUTER_DIRECTIVES],
        styles: [` *{color: black; text-decoration: none;}
                .selected a{color: #FF9D00;}
                .container {                        
                        display: flex;
                        flex-flow: row;
                        justify-content: flex-start;
    `],
        providers: [DivisionsService],
})
export class DivisionsListComponent implements OnInit {
    typeDivisions: TypeDivisions[];
    errorMessage: string;
    selectedDivisionID: number;
    selectedDepartmentID: number;

    constructor(private routeParams: RouteParams, private _router: Router, private _divisionsService: DivisionsService) { }

    ngOnInit() {
        this.selectedDepartmentID = 1;
        //puca aplikacija kada dodam routParams
        this.selectedDepartmentID = +this.routeParams.get('id');
        this.getDivisionsByType();
    }

    getDivisionsByType() {
        this._divisionsService.getDivisionsByType(this.selectedDepartmentID)
            .then(
            divs => this.typeDivisions = divs,
            error => this.errorMessage = <any>error);
    }

    onSelect(divisionID: number) {
        this.selectedDivisionID = divisionID;
        this._router.navigate(['GroupsList', { id: divisionID }]);
    }

    onDeselect() {
        this.selectedDivisionID = -1;
        this._router.navigate(['DepartmentOptions']);
    }

    isSelected(division: Division) {
        return division.divisionID === this.selectedDivisionID;
    }

}
