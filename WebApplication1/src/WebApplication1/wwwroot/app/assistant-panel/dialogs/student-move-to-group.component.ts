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
        <span *ngIf="groups && groups.length > 1 && groupId">Student se treutno nalazi u grupi <b>{{groupName}}</b>.</span>
        <div>
            <r-dropdown *ngIf="groups && groups.length > 1" [(val)]="selectedGroupId" [label]="'Odredišna grupa'" [primaryColor]="primaryColor">
                <r-dropdown-item *ngFor="let group of groupsWithoutCurrent" [value]="group && group.groupID">{{group && group.name}}</r-dropdown-item>
            </r-dropdown>
        </div>
        
        <div class="controls">
            <button r-button flat [text]="'Odustani'" (click)="closeMe()" [primaryColor]="primaryColor">Odustani</button>
            <button r-button raised [text]="'Prebaci'" (click)="onSave()" [primaryColor]="primaryColor">Prebaci</button>  
        </div>
    `,
    providers: [DivisionsService, GroupsService],
    directives: [R_BUTTON, R_DROPDOWN],
    styleUrls: ['app/assistant-panel/dialogs/student-move-to-group.css'],
})

export class MoveStudentToGroupComponent {

    @Input() primaryColor: string = "MaterialOrange";
    @Input() secondaryColor: string = "MaterialBlue";

    student: any;
    groups: any[];
    selectedGroupId: number;
    errorMessage: string;

    get groupsWithoutCurrent() {
        return this.groups && this.groups.filter(e => e.groupID !== this.groupId);
    }

    // TODO lazo iskoristi ovaj ID
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
                switch(response.status) {
                    case "uspelo":
                        this._globalService.toast(`Student uspešno prebačen.`); // TODO koji, odakle, gde?
                        break;
                    default:
                        this._globalService.toast(`Došlo je do greške. Student nije prebačen.`);
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
    
    @Output() close: EventEmitter<any> = new EventEmitter<any>();
    
    public closeMe() {
        this.close.emit("Close!");
    }
}