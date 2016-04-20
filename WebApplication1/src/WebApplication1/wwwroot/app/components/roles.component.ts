﻿import {Component, OnInit} from "angular2/core";
import {CORE_DIRECTIVES} from "angular2/src/common/directives/core_directives";
import {RolesService} from "./roles.service";
import {Role} from './role';

@Component({
    selector: "test",
    templateUrl: "app/components/roles.component.html",
    providers: [RolesService],
    directives: CORE_DIRECTIVES
})
export class RolesComponent implements OnInit {
    message: string;
    errorMessage : string;
    data: Role[];
    isLoading: boolean = false;
    ro: Role;

    constructor(private service: RolesService) { }

    ngOnInit() {
        this.getHeroes();
    }

    getHeroes() {
        this.service.getHeroes()
            .then(
            heroes => this.data = heroes,
            error => this.errorMessage = <any>error);
    }

    addHero(name: string) {
        if (!name) { return; }
        this.service.addHero(name)
            .then(
            hero  => this.data.push(hero),
            error => this.errorMessage = <any>error);
    }
}