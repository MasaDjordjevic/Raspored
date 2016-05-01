import {Component} from "angular2/core";
import {Assistant} from "../../models/Assistant";

@Component({
    selector: 'r-assistant-panel-options',
    template: `<p>Assistant Panel Options</p>`,
    styleUrls: ['app/assistant-panel/options/assistant-panel-options.css']
})
export class AssistantPanelOptionsComponent {

    assistant: Assistant;

}