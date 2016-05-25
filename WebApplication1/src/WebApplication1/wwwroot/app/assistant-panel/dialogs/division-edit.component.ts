import {Component, Input} from 'angular2/core';
import {DivisionsService} from "../../services/divisions.service";
import {Division} from "../../models/Division";


@Component({
    selector: 'division-edit', 
    templateUrl: 'app/assistant-panel/dialogs/division-edit.component.html',
    providers: [DivisionsService],
})
export class DivisionEditComponent {
    @Input() division: Division;      
    
    
}
