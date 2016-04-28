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
        path: '/student/:id',
        component: StudentOptionsComponent,
        name: 'Student',
    }
])
@Component({
    template: `
<h3>Student List</h3>
<a [routerLink]="['Student', {id: 1}]">Student 1</a>
<a [routerLink]="['Student', {id: 2}]">Student 2</a>
<a [routerLink]="['Student', {id: 3}]">Student 3</a><br/>
<a [routerLink]="['GroupOptions']">Back to Group Options</a>
<router-outlet></router-outlet>`,
    directives: [ROUTER_DIRECTIVES],
})
export class StudentsListComponent {

}