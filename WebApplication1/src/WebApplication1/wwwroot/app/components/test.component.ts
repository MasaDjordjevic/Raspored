﻿import {Component, OnInit} from "angular2/core";

@Component({
    selector: "test",
    templateUrl: "app/components/roles.component.html"
})
export class TestComponent implements OnInit {
    message: string;

    constructor() { }

    ngOnInit() {
        this.message = "Pise nesto drugo";
    }
}