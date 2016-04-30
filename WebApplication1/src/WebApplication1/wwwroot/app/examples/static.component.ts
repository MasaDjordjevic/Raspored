import {Component, OnInit} from "angular2/core";

@Component({
    selector: "static",
    templateUrl: "app/examples/static.html"
})
export class StaticComponent implements OnInit {
    message: string;

    constructor() { }

    ngOnInit() {
        this.message = "Masa menja stvari!"
    }
}