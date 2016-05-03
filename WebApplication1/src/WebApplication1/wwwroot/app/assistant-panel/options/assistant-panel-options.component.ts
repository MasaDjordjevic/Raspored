import {Component} from "angular2/core";
import {Assistant} from "../../models/Assistant";
import {R_BUTTON} from "../../ui/r-button.component";
import {R_STEPPER} from "../../ui/r-stepper.component";
import {R_DIALOG} from "../../ui/r-dialog";
import {R_INPUT} from "../../ui/r-input-text.component";
import {R_DROPDOWN} from "../../ui/r-dropdown";



@Component({
    selector: 'r-assistant-panel-options',
    template: `
    <style>
        :host {
            display: flex;
            align-items: baseline;
            font-size: 18px;
        }
    </style>
    <r-dropdown style="width: 360px;">
        <r-dropdown-item [value]="val[0]" default>Prvi item</r-dropdown-item>
        <r-dropdown-item [value]="val[1]">Drugi item</r-dropdown-item>
        <r-dropdown-item [value]="val[2]">Treci item</r-dropdown-item>
        <r-dropdown-item [value]="val[3]">Cetvrti item</r-dropdown-item>
    </r-dropdown>
    `,
    styleUrls: ['app/assistant-panel/options/assistant-panel-options.css'],
    directives: [R_BUTTON, R_STEPPER, R_DIALOG, R_INPUT, R_DROPDOWN]
})

export class AssistantPanelOptionsComponent {

    assistant: Assistant;

    val: Array<string> = ["a", "b", "c", "d"];

}