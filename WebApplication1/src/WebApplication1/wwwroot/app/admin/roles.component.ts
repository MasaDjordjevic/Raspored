// Angular2
import {Component, OnInit} from "angular2/core";

// Services
import {RolesService} from "../services/roles.service";

// Models
import {Role} from '../models/Role';


@Component({
    selector: "r-roles",
    templateUrl: "app/admin/roles.component.html",
    providers: [RolesService]
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