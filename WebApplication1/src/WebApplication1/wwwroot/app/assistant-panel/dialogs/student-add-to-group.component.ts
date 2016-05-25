import {Component, Input, OnInit} from "angular2/core";
import {DivisionsService} from "../../services/divisions.service";
import {TypeDivisions} from "../../models/TypeDivisions";
import {GroupsService} from "../../services/groups.service";
import {Student} from "../../models/Student";
import {StudentsService} from "../../services/students.service";


@Component({
    selector: 'add-student-to-group',
    template: `        
        <select *ngIf="typeDivisions" [(ngModel)]="selectedDivisionId" (ngModelChange)="selectDivision()">
            <option>Izaberi podelu</option>
            <optgroup *ngFor="let td of typeDivisions" [label]="td.type">
                <option *ngFor="let div of td.divisions" [value]="div.divisionID">{{div.creatorName}} {{div.beginning}}</option>
            </optgroup>     
        </select>
        
        <select *ngIf="groups" [(ngModel)]="selectedGroupId" >
            <option *ngFor="let group of groups" [value]="group.groupID">{{group.classroomName}} {{group.name}}</option>
        </select>
        
        <button class="save" (click)="onSave()">Save</button>
    `,
    providers: [DivisionsService, GroupsService],
})

export class AddStudentToGroupComponent {
    student: any;
    typeDivisions: TypeDivisions[];
    groups: any[];
    selectedDivisionId: number = 0;
    selectedGroupId: number;
    errorMessage: string;

    constructor (   private _divisionsService: DivisionsService,
                    private _groupsService: GroupsService,
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
            student => this.pom(student),
            error => this.errorMessage = <any>error
        );//.then(this.getDivisionsByType());
    }
    //ne znam zasto nece then, izvrsi se odmah
    pom(p) {
        this.student = p;
        this.getDivisionsByType();
    }

    getDivisionsByType() {
        this._divisionsService.getDivisionsByType(this.student.departmentID)
            .then(
                divs => this.typeDivisions = divs,
                error => this.errorMessage = <any>error);
    }


    getGroupsOfDivision(divisionId: number) {
        this._groupsService.getGroups(divisionId)
            .then(
                groups => this.groups = groups,
                error => this.errorMessage = <any>error);

    }

    selectDivision() {
        this.getGroupsOfDivision(this.selectedDivisionId);
    }

    onSave() {
        this._studentsService.addToGroup(this.student.studentID, this.selectedGroupId);
    }
    
    
}