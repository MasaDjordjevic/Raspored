import {Component, OnInit} from "angular2/core";
import {AsyncRoute, Router, RouteDefinition, RouteConfig, Location, ROUTER_DIRECTIVES, Route} from "angular2/router";
import {StaticComponent} from "./static.component";
import {AssistantPanelComponent} from "./assistant-panel.component";

declare var System: any;

@RouteConfig([
    {
        path: '/assistant-panel/...',
        component: AssistantPanelComponent,
        name: 'AssistantPanel',
    }
])
@Component({
    selector: "app",
    templateUrl: "/app/app.html",
    //template: `<h1>Početak sajta</h1> <a [routerLink]="['AssistantPanel']">Otvori asistentski panel</a> <router-outlet></router-outlet>`,
    directives: [ROUTER_DIRECTIVES],
})
export class AppComponent implements OnInit {
    public routes: RouteDefinition[] = null;
    constructor(private router: Router,
        private location: Location) {

    }

    ngOnInit() {
        if (this.routes === null) {
            this.routes = [
                { path: "/index", component: StaticComponent, name: "Index", useAsDefault: true },
                new AsyncRoute({
                    path: "/sub",
                    name: "Sub",
                    loader: () => System.import("app/mvc.component").then(c => c["MvcComponent"])
                }),
                new AsyncRoute({
                    path: "/numbers",
                    name: "Numbers",
                    loader: () => System.import("app/api.component").then(c => c["ApiComponent"])
                }),
                new AsyncRoute({
                    path: "/test",
                    name: "Testtttttt",
                    loader: () => System.import("app/test.component").then(c => c["TestComponent"])
                }),
                new AsyncRoute({
                    path: "/roles",
                    name: "Roles",
                    loader: () => System.import("app/roles.component").then(c => c["RolesComponent"])
                }),
                new AsyncRoute({
                    path: "/departments",
                    name: "Departments",
                    loader: () => System.import("app/admin.departments.component").then(c => c["AdminDepartmentsComponent"])
                }),
                new AsyncRoute({
                    path: "/assistant-edit",
                    name: "Assistant Edit",
                    loader: () => System.import("app/assistant-edit.component").then(c => c["AssistantEditComponent"])
                }),
                new AsyncRoute({                 
					path: "/courses",
                    name: "Courses",
                    loader: () => System.import("app/admin.courses.component").then(c => c["AdminCoursesComponent"])
                }),
                new AsyncRoute({
                    path: "/classrooms",
                    name: "Classrooms",
                    loader: () => System.import("app/admin.classrooms.component").then(c => c["AdminClassroomsComponent"])
                }),
                new AsyncRoute({
                    path: "/assistant-panel",
                    name: "AssistantPanel",
                    loader: () => System.import("app/assistant-panel.component").then(c => c["AssistantPanelComponent"])
                }),
            ];

            this.router.config(this.routes);
        }
    }

    getLinkStyle(route: RouteDefinition) {
        return this.location.path().indexOf(route.path) > -1;
    }
}