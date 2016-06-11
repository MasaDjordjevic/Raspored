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
import {R_NESTED_LIST} from "../../ui/r-nested-list";
import {GlobalService} from "../../services/global.service";


@Component({
    selector: 'r-groups-list',
    template: `
    <r-nested-list [title]="_globalService.translate('groups')" [primaryColor]="primaryColor" [secondaryColor]="secondaryColor">
        <r-list-inner-item
            *ngFor="let group of groups"
            [value]="group.groupID"
            (click)="onSelect(group.groupID)"
            [class.selected]="group.groupID === selectedGroupId"
            style="display: flex; justify-content: space-between;"
        >
            <span>{{group.name}}</span>
            <span *ngIf="group.classroom">({{group.classroom.number}})</span>
        </r-list-inner-item>
    </r-nested-list>
    `,
    styleUrls: ['app/assistant-panel/list/assistant-panel-list.css'],
    directives: [RList, R_NESTED_LIST],
    providers: [GroupsService],
})

export class GroupsListComponent implements OnInit {

    @Input() primaryColor: string = "MaterialBlue";
    @Input() secondaryColor: string = "MaterialOrange";

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
        private _service: GroupsService,
        private _globalService: GlobalService
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
                s: (this.groups[i].classroom ? this.groups[i].classroom.number : "???????") + " " + this.groups[i].name,
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
