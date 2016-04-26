import {Component, OnInit} from "angular2/core";
import {AsyncRoute, Router, RouteDefinition, RouteConfig, Location, ROUTER_DIRECTIVES} from "angular2/router";
import {StaticComponent} from "./components/static.component";

declare var System: any;

@Component({
    selector: "app",
    templateUrl: "/app/app.html",
    directives: [ROUTER_DIRECTIVES]
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
                    loader: () => System.import("app/components/mvc.component").then(c => c["MvcComponent"])
                }),
                new AsyncRoute({
                    path: "/numbers",
                    name: "Numbers",
                    loader: () => System.import("app/components/api.component").then(c => c["ApiComponent"])
                }),
                new AsyncRoute({
                    path: "/test",
                    name: "Testtttttt",
                    loader: () => System.import("app/components/test.component").then(c => c["TestComponent"])
                }),
                new AsyncRoute({
                    path: "/roles",
                    name: "Roles",
                    loader: () => System.import("app/components/roles.component").then(c => c["RolesComponent"])
                }),
                new AsyncRoute({
                    path: "/admin/departments",
                    name: "Departments",
                    loader: () => System.import("app/components/admin.departments.component").then(c => c["AdminDepartmentsComponent"])
                }),
                new AsyncRoute({
                    path: "/admin/courses",
                    name: "Courses",
                    loader: () => System.import("app/components/admin.courses.component").then(c => c["AdminCoursesComponent"])
                }),
                new AsyncRoute({
                    path: "/admin/classrooms",
                    name: "Classrooms",
                    loader: () => System.import("app/components/admin.classrooms.component").then(c => c["AdminClassroomsComponent"])
                }),
            ];

            this.router.config(this.routes);
        }
    }

    getLinkStyle(route: RouteDefinition) {
        return this.location.path().indexOf(route.path) > -1;
    }
}