﻿// Angular2
import {Component, OnInit} from "angular2/core";
import {AsyncRoute, Router, RouteDefinition, RouteConfig, ROUTER_DIRECTIVES, Route} from "angular2/router";
import {Location} from "angular2/platform/common";

// Components
import {StaticComponent} from "./examples/static.component";
import {AssistantPanelComponent} from "./assistant-panel/assistant-panel.component";
import {RolesComponent} from "./admin/roles.component";

declare var System: any;

@Component({
    selector: "app",
    templateUrl: "/app/app.html",
    directives: [ROUTER_DIRECTIVES],
})

export class AppComponent implements OnInit {

    public routes: RouteDefinition[] = null;
    constructor(
        private router: Router
        //private location: Location
        //TODO Ne znam cemu sluzi, ali ne radi od prelaska na beta17.
        // Lik sa chata je pomenuo https://github.com/angular/angular/pull/8300 ali ne znam sta da radim.
    ) {  }

    ngOnInit() {
        if (this.routes === null) {
            this.routes = [
                { path: "/index", component: StaticComponent, name: "Index", useAsDefault: false },
                new AsyncRoute({
                    path: "/sub",
                    name: "Sub",
                    loader: () => System.import("app/examples/mvc.component").then(c => c["MvcComponent"])
                }),
                new AsyncRoute({
                    path: "/numbers",
                    name: "Numbers",
                    loader: () => System.import("app/examples/api.component").then(c => c["ApiComponent"])
                }),
                new AsyncRoute({
                    path: "/test",
                    name: "Testtttttt",
                    loader: () => System.import("app/examples/test.component").then(c => c["TestComponent"])
                }),
                new AsyncRoute({
                    path: "/roles",
                    name: "Roles",
                    loader: () => System.import("app/admin/roles.component").then(c => c["RolesComponent"])
                }),
                new AsyncRoute({
                    path: "/departments",
                    name: "Departments",
                    loader: () => System.import("app/admin/admin.departments.component").then(c => c["AdminDepartmentsComponent"])
                }),
                new AsyncRoute({
                    path: "/assistant-edit",
                    name: "Assistant Edit",
                    loader: () => System.import("app/assistant-panel/dialogs/assistant-edit.component").then(c => c["AssistantEditComponent"])
                }),
                new AsyncRoute({
                    path: "/courses",
                    name: "Courses",
                    loader: () => System.import("app/admin/admin.courses.component").then(c => c["AdminCoursesComponent"])
                }),
                new AsyncRoute({
                    path: "/classrooms",
                    name: "Classrooms",
                    loader: () => System.import("app/admin/admin.classrooms.component").then(c => c["AdminClassroomsComponent"])
                }),
                new AsyncRoute({
                    path: "/assistant-panel",
                    name: "AssistantPanel",
                    loader: () => System.import("app/assistant-panel/assistant-panel.component").then(c => c["AssistantPanelComponent"])
                }),
                new AsyncRoute({
                    path: "/student-panel",
                    name: "Timetable",
                    loader: () => System.import("app/student-panel/student-panel.component").then(c => c["StudentPanelComponent"])
                }),
                new AsyncRoute({
                    path: "/login",
                    name: "Login",
                    useAsDefault: true,
                    loader: () => System.import("app/login.component").then(c => c["LoginComponent"])
                }),
                new AsyncRoute({
                    path: "/unauthorized-access",
                    name: "UnauthorizedAccess",
                    loader: () => System.import("app/errors/unauthorized-access.component").then(c => c["UnauthorizedAccessComponent"])
                }),
                new AsyncRoute({
                    path: "/**",
                    name: "NotFound",
                    loader: () => System.import("app/login.component").then(c => c["LoginComponent"])
                }),
            ];

            this.router.config(this.routes);
        }
    }
    /*
    getLinkStyle(route: RouteDefinition) {
        return this.location.path().indexOf(route.path) > -1;
    }*/
}