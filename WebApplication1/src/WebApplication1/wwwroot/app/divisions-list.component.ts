import {Component} from "angular2/core";
import {Router, RouteDefinition, RouteConfig, Location, ROUTER_DIRECTIVES} from "angular2/router";
import {DepartmentOptionsComponent} from "./department-options.component";
import {GroupsListComponent} from "./groups-list.component";

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
<a [routerLink]="['GroupsList', {id: 1}]">Division 1</a>
<a [routerLink]="['GroupsList', {id: 2}]">Division 2</a>
<a [routerLink]="['GroupsList', {id: 3}]">Division 3</a><br/>
<a [routerLink]="['DepartmentOptions']">Back to Department Options</a>
<router-outlet></router-outlet>`,
        directives: [ROUTER_DIRECTIVES],
})
export class DivisionsListComponent {

}
