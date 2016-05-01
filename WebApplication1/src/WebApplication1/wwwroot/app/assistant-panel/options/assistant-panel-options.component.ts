import {Component} from "angular2/core";
import {Assistant} from "../../models/Assistant";
import {R_BUTTON} from "../../ui/r-button.component";
import {R_STEPPER} from "../../ui/r-stepper.component"

@Component({
    selector: 'r-assistant-panel-options',
    template: `
    <!--<button raised r-button [text]="'Visible'">Invisible</button> <br/>
    <button r-button flat [text]="'Visible'">Invisible</button> <br/>
    <button r-button>No Directive (Works)</button> <br/> <br/>
    <button r-button raised disabled [text]="'Raised Disabled'"></button> <br/>
    <button r-button flat disabled [text]="'Flat Disabled'"></button> <br/>
    <button r-button disabled>No Directive Disabled</button> <br/> <br/>
    <button>Good Ol' Button</button> <br/>
    <button disabled>Good Ol' Button</button>-->

    <r-stepper>
        <r-step [stepTitle]="'Prvi korak'">step no1</r-step>
        <r-step [stepTitle]="'Drugi korak'">step no2</r-step>
        <r-step [stepTitle]="'Treci korak'">step no3</r-step>
    </r-stepper>
    `,
    styleUrls: ['app/assistant-panel/options/assistant-panel-options.css'],
    directives: [R_BUTTON, R_STEPPER]
})
export class AssistantPanelOptionsComponent {

    assistant: Assistant;

}