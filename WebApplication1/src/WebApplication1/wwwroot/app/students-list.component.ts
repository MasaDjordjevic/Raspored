import {Component} from "angular2/core";
import {Router, RouteDefinition, RouteConfig, Location, ROUTER_DIRECTIVES} from "angular2/router";
import {GroupOptionsComponent} from "./group-options.component";
import {StudentOptionsComponent} from "./student-options.component";

@RouteConfig([
    {
        path: '/',
        component: GroupOptionsComponent,
        name: 'GroupOptions',
        useAsDefault: true,
    },
    {
        path: '/student',
        component: StudentOptionsComponent,
        name: 'Student',
    }
])
@Component({
    template: `
<h3>Student List</h3>
<a [routerLink]="['Student']">Student 1</a>
<a [routerLink]="['Student']">Student 2</a>
<a [routerLink]="['Student']">Student 3</a>
<a [routerLink]="['GroupOptions']">Options</a>
<router-outlet></router-outlet>`,
    directives: [ROUTER_DIRECTIVES],
})
export class StudentsListComponent {

}