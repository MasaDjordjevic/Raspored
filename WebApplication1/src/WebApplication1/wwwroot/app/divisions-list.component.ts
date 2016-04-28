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
        path: '/division/...',
        component: GroupsListComponent,
        name: 'GroupsList'
    }
])
@Component({
        template: `
<h3>Divisions List</h3>
<a [routerLink]="['GroupsList']">Division 1</a>
<a [routerLink]="['GroupsList']">Division 2</a>
<a [routerLink]="['GroupsList']">Division 3</a>
<a [routerLink]="['DepartmentOptions']">Options</a>
<router-outlet></router-outlet>`,
        directives: [ROUTER_DIRECTIVES],
})
export class DivisionsListComponent {

}
