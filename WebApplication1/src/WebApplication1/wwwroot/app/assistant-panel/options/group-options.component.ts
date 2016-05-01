import {Component, Input} from "angular2/core";
import {GroupsService} from "../../services/groups.service";
import {Group} from "../../models/Group";


@Component({
    selector: 'r-group-options',
    template: `
    <div *ngIf="group">
        {{group | json}}
    </div>
    {{errorMessage}}
    `,
    styleUrls: ['app/assistant-panel/options/assistant-panel-options.css'],
    providers: [GroupsService]
})

export class GroupOptionsComponent {

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

}