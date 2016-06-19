import {Component, Input, OnInit} from "angular2/core";
import {DivisionsService} from "../../services/divisions.service";
import {GroupsService} from "../../services/groups.service";
import {Student} from "../../models/Student";
import {StudentsService} from "../../services/students.service";


@Component({
    selector: 'move-student-to-group',
    template: ` 
        <span *ngIf="groups">Student se treutno nalazi u grupi {{getGroupName()}}</span> <br/>
        <select *ngIf="groups" [(ngModel)]="selectedGroupId" >
            <option>Izaberi grupu</option>
            <option *ngFor="let group of groups" [value]="group.groupID">{{group.classroomName}} {{group.name}}</option>
        </select>
        
        <button class="save" (click)="onSave()">Save</button>
    `,
    providers: [DivisionsService, GroupsService],
})

export class MoveStudentToGroupComponent {
    student: any;
    groups: any[];
    selectedGroupId: number;
    errorMessage: string;

    // TODO lazo iskoristi ovaj ID
    // grupa kroz koju se doslo
    @Input() groupId: number;

    getGroupName(){
       return this.groups.filter(a => a.groupID == this.groupId)[0].name;
    }

    constructor (   private _groupsService: GroupsService,
                    private _studentsService: StudentsService) { }

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
        this._studentsService.moveToGroup(this.student.studentID, this.selectedGroupId);
    }
    
    
}