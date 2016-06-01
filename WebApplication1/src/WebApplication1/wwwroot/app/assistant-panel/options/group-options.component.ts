import {Component, Input} from "angular2/core";
import {GroupsService} from "../../services/groups.service";
import {Group} from "../../models/Group";
import {R_DIALOG} from "../../ui/r-dialog";
import {R_BUTTON} from "../../ui/r-button.component";
import {R_STEPPER} from "../../ui/r-stepper.component";
import {R_DL} from "../../ui/r-dl";
import {TrimPipe} from "../../pipes/trim.pipe";
import {GroupEditComponent} from "../dialogs/group-edit.component";
import {AddActivityComponent} from "../dialogs/group-add-activity.component";



@Component({
    selector: 'r-group-options',
    templateUrl: 'app/assistant-panel/options/group-options.html',
    styleUrls: [
        'app/assistant-panel/options/assistant-panel-options.css',
    ],
    providers: [GroupsService],
    directives: [R_DIALOG, R_BUTTON, R_STEPPER, R_DL, GroupEditComponent, AddActivityComponent],
    pipes: [TrimPipe]
})

export class GroupOptionsComponent {

    @Input() primaryColor: string = "MaterialBlue";
    @Input() secondaryColor: string = "MaterialOrange";

    group: Group;
    errorMessage: string;

    private _groupId: number = 0;

    @Input() set groupId(n: number) {
        this._groupId = n;
        this.getGroup();
    }

    get groupId() {
        return this._groupId;
    }

    constructor( private _service: GroupsService ) {}

    getGroup(): void {
        this._service.getGroup(this.groupId).then(
            group => this.group = group,
            error => this.errorMessage = <any>error
        )
    }
    
    removeGroup() {
        //TODO uradi nesto pametnije sa odgovorom
        this._service.removeGroup(this.groupId).then(any => console.log(any));
    }

}