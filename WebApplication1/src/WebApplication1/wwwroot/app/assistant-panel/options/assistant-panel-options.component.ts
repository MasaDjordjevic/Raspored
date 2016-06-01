import {Component} from "angular2/core";
import {Assistant} from "../../models/Assistant";
import {R_BUTTON} from "../../ui/r-button.component";
import {R_STEPPER} from "../../ui/r-stepper.component";
import {R_DIALOG} from "../../ui/r-dialog";
import {R_INPUT} from "../../ui/r-input-text.component";
import {R_DROPDOWN} from "../../ui/r-dropdown";
import {R_DL} from "../../ui/r-dl";
import {Control} from "angular2/common";

@Component({
    selector: 'r-assistant-panel-options',
    template: `
    <form ngForm style="font-size: 1.2em">
        <r-input class="light-theme" label="Labela" [(val)]="inputText"></r-input> <br/>
        {{inputText}}
        <br/> <br/>
        <r-dropdown [(val)]="dropdown" label="Labela bre">
            <r-dropdown-item value="b1">boob1</r-dropdown-item>
            <r-dropdown-item value="b2">boob2</r-dropdown-item>
            <r-dropdown-item value="b3">boob3</r-dropdown-item>
            <r-dropdown-item value="b4">boob4</r-dropdown-item>
        </r-dropdown> <br/>
        {{dropdown}}
    </form>
    `,
    styleUrls: ['app/assistant-panel/options/assistant-panel-options.css'],
    directives: [R_BUTTON, R_STEPPER, R_DIALOG, R_INPUT, R_DROPDOWN, R_DL]
})

export class AssistantPanelOptionsComponent {

    public inputText: string = "boobs";
    public dropdown: string = "b2";

    constructor() {
    }

    assistant: Assistant;

}