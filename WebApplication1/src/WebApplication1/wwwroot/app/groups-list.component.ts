import {Component} from "angular2/core";
import {Router, RouteDefinition, RouteConfig, Location, ROUTER_DIRECTIVES} from "angular2/router";
import {DivisionOptionsComponent} from "./division-options.component";
import {StudentsListComponent} from "./students-list.component";

@RouteConfig([
    {
        path: '/',
        component: DivisionOptionsComponent,
        name: 'DivisionOptions',
        useAsDefault: true,
    },
    {
        path: '/group/...',
        component: StudentsListComponent,
        name: 'StudentsList'
    }
])
@Component({
    template: `
<h3>Group List</h3>
<a [routerLink]="['StudentsList']">Group 1</a>
<a [routerLink]="['StudentsList']">Group 2</a>
<a [routerLink]="['StudentsList']">Group 3</a>
<a [routerLink]="['DivisionOptions']">Options</a>
<router-outlet></router-outlet>`,
        directives: [ROUTER_DIRECTIVES],
})
export class GroupsListComponent {

}