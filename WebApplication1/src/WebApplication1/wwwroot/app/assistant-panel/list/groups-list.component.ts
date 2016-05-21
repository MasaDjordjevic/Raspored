// Angular2
import {Component, OnInit, Input, Output, EventEmitter} from "angular2/core";

// Components
import {DivisionOptionsComponent} from "./../options/division-options.component";
import {StudentsListComponent} from "./students-list.component";

// Models
import {Group} from '../../models/Group';

// Services
import {GroupsService} from '../../services/groups.service';

// UI
import {RList} from '../../ui/r-list';


@Component({
    selector: 'r-groups-list',
    template: `
    <r-list [titleString]="titleString"
            [data]="listData"
            (selectItem)="onSelect($event)">
    </r-list>
    `,
    styleUrls: ['app/assistant-panel/list/assistant-panel-list.css'],
    directives: [RList],
    providers: [GroupsService],
})

export class GroupsListComponent implements OnInit {

    groups: any[];
    errorMessage: string;
    titleString: string = "Grupe";
    private selectedGroupId: number;

    private _selectedDivisionId: number;

    @Input() set selectedDivisionId(n: number) {
        this._selectedDivisionId = n;
        this.getGroups();
    }

    get selectedDivisionId() {
        return this._selectedDivisionId;
    }

    @Output() selectGroup: EventEmitter<any> = new EventEmitter();

    _listData = null;

    constructor(
        private _service: GroupsService
    ) { }

    ngOnInit() {
        this.getGroups();
    }

    get listData() {
        if (!this.groups) return;
        if (!this._listData) this._listData = [];
        this._listData = this._listData.slice(0, this.groups.length);
        for (let i = 0; i < this.groups.length; i++) {
            this._listData[i] = {
                s: this.groups[i].classroom ? this.groups[i].classroom.number : "???????",
                id: this.groups[i].groupID
            };
        }
        return this._listData;
    }

    set listData(data) {
        this._listData = data;
    }

    getGroups() {
        this._service.getGroups(this.selectedDivisionId)
            .then(
            groups => this.groups = groups,
            error => this.errorMessage = <any>error);
    }

    onSelect(groupID: number) {
        this.selectedGroupId = groupID;
        this.selectGroup.emit(this.selectedGroupId);
    }

    onDeselect() {
        this.selectedGroupId = -1;
        this.selectGroup.emit(this.selectedGroupId);
    }

}
