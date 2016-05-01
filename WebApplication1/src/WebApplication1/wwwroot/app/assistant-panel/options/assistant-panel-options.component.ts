import {Component} from "angular2/core";
import {Assistant} from "../../models/Assistant";
import {R_BUTTON} from "../../ui/r-button.component";

@Component({
    selector: 'r-assistant-panel-options',
    template: `
    <button r-button raised [text]="'Raised'"></button> <br/>
    <button r-button flat [text]="'Flat'"></button> <br/>
    <button r-button>No Directive</button> <br/> <br/>
    <button r-button raised disabled [text]="'Raised Disabled'"></button> <br/>
    <button r-button flat disabled [text]="'Flat Disabled'"></button> <br/>
    <button r-button disabled>No Directive Disabled</button> <br/> <br/>
    <button>Good Ol' Button</button> <br/>
    <button disabled>Good Ol' Button</button>
    `,
    styleUrls: ['app/assistant-panel/options/assistant-panel-options.css'],
    directives: [R_BUTTON]
})
export class AssistantPanelOptionsComponent {

    assistant: Assistant;

}