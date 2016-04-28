﻿import {Component} from "angular2/core";
import {Assistant} from "./assistant";
import {AssistantEditComponent} from "./assistant-edit.component";
import {ROUTER_DIRECTIVES, Route, RouteConfig} from 'angular2/router';
import {AssistantPanelOptionsComponent} from "./assistant-panel-options.component";
import {DivisionsListComponent} from "./divisions-list.component";

@RouteConfig([
    {
        path: '/',
        name: 'AssistantPanelOptions',
        component: AssistantPanelOptionsComponent,
        useAsDefault: true,
    },
    {
        path: '/department/...',
        name: 'DivisionList',
        component: DivisionsListComponent,
    }
])

@Component({
        selector: "r-assistant-panel",
        directives: [ROUTER_DIRECTIVES],
    template: `
<h2>Asistentski panel</h2>
<h2>Departments list</h2>
<a [routerLink]="['DivisionList']">Department 1</a>
<a [routerLink]="['DivisionList']">Department 2</a>
<a [routerLink]="['DivisionList']">Department 3</a>
<a [routerLink]="['AssistantPanelOptions']">Options</a>
<router-outlet></router-outlet>
    `,
})
export class AssistantPanelComponent {
    assistant: Assistant;

}