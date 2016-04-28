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
        path: '/group/:id/...',
        component: StudentsListComponent,
        name: 'StudentsList'
    }
])
@Component({
    template: `
<h3>Group List</h3>
<a [routerLink]="['StudentsList', {id: 1}]">Group 1</a>
<a [routerLink]="['StudentsList', {id: 2}]">Group 2</a>
<a [routerLink]="['StudentsList', {id: 3}]">Group 3</a><br/>
<a [routerLink]="['DivisionOptions']">Back to Division Options</a>
<router-outlet></router-outlet>`,
    directives: [ROUTER_DIRECTIVES],
})
export class GroupsListComponent {

}