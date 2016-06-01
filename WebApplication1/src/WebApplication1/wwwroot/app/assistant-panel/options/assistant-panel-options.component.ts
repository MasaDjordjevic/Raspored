﻿import {Component} from "angular2/core";
import {Assistant} from "../../models/Assistant";
import {R_BUTTON} from "../../ui/r-button.component";
import {R_STEPPER} from "../../ui/r-stepper.component";
import {R_DIALOG} from "../../ui/r-dialog";
import {R_INPUT} from "../../ui/r-input-text.component";
import {R_DROPDOWN} from "../../ui/r-dropdown";
import {R_DL} from "../../ui/r-dl";
import {Control} from "angular2/common";
import {R_MULTIPLE_SELECTOR} from "../../ui/multiple-selector.component";
import {multicast} from "rxjs/operator/multicast";

@Component({
    selector: 'r-assistant-panel-options',
    template: `
    <div style="font-size: 1.1em">
        <!--<r-input class="light-theme" label="Labela" [(val)]="inputText"></r-input> <br/>
        {{inputText}}
        <br/> <br/>
        <r-dropdown [(val)]="dropdown" label="Labela bre">
            <r-dropdown-item value="b1">boob1</r-dropdown-item>
            <r-dropdown-item value="b2">boob2</r-dropdown-item>
            <r-dropdown-item value="b3">boob3</r-dropdown-item>
            <r-dropdown-item value="b4">boob4</r-dropdown-item>
        </r-dropdown> <br/>
        {{dropdown}}
        <br/>
        <br/>-->
        <r-multiple-selector [(val)]="multipleSelector">
            <r-multiple-selector-item *ngFor="let n of stuff; let i = index" [val]="i">
                <span>{{n.split('').reverse().join('')}}</span>
                <span>{{n.substring(5)}}</span>
            </r-multiple-selector-item>
        </r-multiple-selector>
    </div>
    `,
    styleUrls: ['app/assistant-panel/options/assistant-panel-options.css'],
    directives: [R_BUTTON, R_STEPPER, R_DIALOG, R_INPUT, R_DROPDOWN, R_DL, R_MULTIPLE_SELECTOR],
})

export class AssistantPanelOptionsComponent {

    public inputText: string = "boobs";
    public dropdown: string = "b2";

    public multipleSelector: string[] = ["1", "4", "7"];

    public stuff: string[] = [];

    public randomString = (n) => (Math.random() + 1).toString(36).substring(2, n + 2);

    constructor() {
        for (let i = 0; i < 12; this.stuff[i++] = this.randomString(i * 10 % 7 + 10));
    }

    assistant: Assistant;

}