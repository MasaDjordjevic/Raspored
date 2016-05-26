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
    <form ngForm style="font-size: 2em">
        <r-input class="light-theme" label="meh" [control]="control"></r-input> <br>

    </form>
    `,
    styleUrls: ['app/assistant-panel/options/assistant-panel-options.css'],
    directives: [R_BUTTON, R_STEPPER, R_DIALOG, R_INPUT, R_DROPDOWN, R_DL]
})

export class AssistantPanelOptionsComponent {

    control: Control;

    controlValue$: any;

    constructor() {
        this.control = new Control();
        this.controlValue$ = this.control.valueChanges;
    }

    assistant: Assistant;

}