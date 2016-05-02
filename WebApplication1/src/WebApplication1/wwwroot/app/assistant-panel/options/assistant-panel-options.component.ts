import {Component} from "angular2/core";
import {Assistant} from "../../models/Assistant";
import {R_BUTTON} from "../../ui/r-button.component";
import {R_STEPPER} from "../../ui/r-stepper.component";
import {R_DIALOG} from "../../ui/r-dialog";
import {R_INPUT} from "../../ui/r-input-text.component";

@Component({
    selector: 'r-assistant-panel-options',
    template: `
    <div>12px</div>
    <div style="font-size: 12px; ">
        <r-input class="light-theme" [label]="'Прва ћирлична лабела'" [(val)]="val[0]"></r-input>
    </div>
    <br/><br/>
    <div>16px</div>
    <div style="font-size: 16px; ">
        <r-input class="light-theme" [label]="'Druga šđčćž labela'" [(val)]="val[1]"></r-input>
    </div>
    <br/><br/>
    <div>24px</div>
    <div style="font-size: 24px; ">
        <r-input class="light-theme" [label]="'Treca labela'" [(val)]="val[2]"></r-input>
    </div>
    <br/><br/>
    <div>36px</div>
    <div style="font-size: 36px; ">
        <r-input class="light-theme" [label]="'Cetvrta labela'" [(val)]="val[3]"></r-input>
    </div>
    <br/><br/>
    {{val[0]}}<br/>{{val[1]}}<br/>{{val[2]}}<br/>{{val[3]}}
    `,
    styleUrls: ['app/assistant-panel/options/assistant-panel-options.css'],
    directives: [R_BUTTON, R_STEPPER, R_DIALOG, R_INPUT]
})
export class AssistantPanelOptionsComponent {

    assistant: Assistant;

    val: Array<string> = ["Prva vrednost", "Druga vrednost", "Treca vrednost", "Cetvrta vrednost"];


}