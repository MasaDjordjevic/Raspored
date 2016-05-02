import {Component} from "angular2/core";
import {Assistant} from "../../models/Assistant";
import {R_BUTTON} from "../../ui/r-button.component";
import {R_STEPPER} from "../../ui/r-stepper.component";
import {R_DIALOG} from "../../ui/r-dialog"

@Component({
    selector: 'r-assistant-panel-options',
    template: `
    <button #testDialogSource r-button raised
        [text]="'Sezame, otvori se!'"
        (click)="testDialog.open()"></button>
    <r-dialog #testDialog [source]="testDialogSource">
        <r-stepper>
            <r-step [stepTitle]="'Prvi korak'">
                <p>Ovo je prvi korak.</p>
            </r-step>
            <r-step [stepTitle]="'Drugi korak'">
                <p>Ovo je drugi korak.</p>
            </r-step>
            <r-step [stepTitle]="'Treci korak'">
                <p>Ovo je treci korak.</p>
            </r-step>
        </r-stepper>
    </r-dialog>
    `,
    styleUrls: ['app/assistant-panel/options/assistant-panel-options.css'],
    directives: [R_BUTTON, R_STEPPER, R_DIALOG]
})
export class AssistantPanelOptionsComponent {

    assistant: Assistant;

}