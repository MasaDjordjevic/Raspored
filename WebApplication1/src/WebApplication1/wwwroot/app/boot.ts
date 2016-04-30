/// <reference path="../../node_modules/angular2/typings/browser.d.ts" />

import {provide} from "angular2/core";
import {bootstrap} from "angular2/platform/browser"
import {ROUTER_PROVIDERS, RouteConfig, ROUTER_DIRECTIVES} from "angular2/router";
import {HTTP_PROVIDERS} from "angular2/http";

import {AppComponent} from "./app.component";

bootstrap(AppComponent, [ROUTER_PROVIDERS, HTTP_PROVIDERS]);
//bootstrap(AppComponent, [ROUTER_PROVIDERS, HTTP_PROVIDERS, provide(LocationStrategy, { useClass: HashLocationStrategy })]);