import {Component, Input, OnInit, Output, EventEmitter} from "angular2/core";
import {DivisionsService} from "../../services/divisions.service";
import {GroupsService} from "../../services/groups.service";
import {Student} from "../../models/Student";
import {StudentsService} from "../../services/students.service";
import {R_BUTTON} from "../../ui/r-button.component";
import {R_DROPDOWN} from "../../ui/r-dropdown";
import {GlobalService} from "../../services/global.service";


@Component({
    selector: 'move-student-to-group',
    template: ` 
    <template [ngIf="groups && groups.length > 1 && groupId">
        <span *ngIf="groups && groups.length > 1 && groupId">
            {{_globalService.translate('student_is_currently_in_group__1')}}
            <b>{{groupName}}</b>
            {{_globalService.translate('student_is_currently_in_group__2')}}
        </span>
        <div>
            <r-dropdown *ngIf="groups && groups.length > 1" [(val)]="selectedGroupId"
                        [label]="'Odredišna grupa'" [primaryColor]="primaryColor">
                <r-dropdown-item *ngFor="let group of groupsWithoutCurrent"
                                 [value]="group && group.groupID">
                    {{group && group.name}}
                </r-dropdown-item>
            </r-dropdown>
        </div>
        
        <div class="controls">
        
            <button r-button flat [text]="_globalService.translate('cancel')" (click)="closeMe()"
                    [primaryColor]="primaryColor">
                {{_globalService.translate('cancel')}}
            </button>
            
            <button r-button raised [text]="_globalService.translate('move')" (click)="onSave()"
                    [primaryColor]="primaryColor">
                {{_globalService.translate('move')}}
            </button>  
            
        </div>
    </template>
    <template [ngIf]="!(groups && groups.length > 1 && groupId)">
        <span>Nema drugih grupa.</span>
    </template>
    `,
    providers: [DivisionsService, GroupsService],
    directives: [R_BUTTON, R_DROPDOWN],
    styleUrls: ['app/assistant-panel/dialogs/student-move-to-group.css'],
})

export class MoveStudentToGroupComponent {

    @Input() primaryColor: string = "MaterialBlue";
    @Input() secondaryColor: string = "MaterialOrange";

    @Output() close: EventEmitter<any> = new EventEmitter<any>();
    public closeMe() {
        this.close.emit({});
    }

    student: any;
    groups: any[];
    selectedGroupId: number;
    errorMessage: string;

    get groupsWithoutCurrent() {
        return this.groups && this.groups.filter(e => e.groupID !== this.groupId);
    }

    // grupa kroz koju se doslo
    @Input() groupId: number;

    get groupName() {
        return this.groups
            && this.groups.filter(a => a.groupID == this.groupId)[0]
            && this.groups.filter(a => a.groupID == this.groupId)[0].name;
    }

    constructor(
        private _groupsService: GroupsService,
        private _studentsService: StudentsService,
        private _globalService: GlobalService
    ) { }

    private _studentId: number = 0;

    @Input() set studentId(n: number) {
        this._studentId = n;
        this.getStudent();
    }

    get studentId() {
        return this._studentId;
    }

    getStudent(): void {
        this._studentsService.getStudent(this._studentId).then(
            student => this.student = student,
            error => this.errorMessage = <any>error);
    }

    private _divisionId: number = 0;

    @Input() set divisionId(n: number) {
        this._divisionId = n;
        this.getGroupsOfDivision(n);
    }

    get divisionId() {
        return this._divisionId;
    }

    getGroupsOfDivision(divisionId: number) {
        this._groupsService.getGroups(divisionId)
            .then(
                groups => this.groups = groups,
                error => this.errorMessage = <any>error);
    }

    onSave() {
        this._studentsService.moveToGroup(this.student.studentID, this.selectedGroupId)
            .then(response => {
                switch(response["status"]) {
                    case "uspelo":
                        this._globalService.toast(this._globalService.translate('student_successfully_moved'));
                        break;
                    default:
                        this._globalService.toast(this._globalService.translate('error') + ' ' +
                            this._globalService.translate('student_not_moved'));
                        debugger;
                        break;
                }
            })
            .then(() => {
                this.closeMe();
            })
            .then(() => {
                this._globalService.refreshAssistantPanelAll();
            });
    }

}