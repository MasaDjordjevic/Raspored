import {Component, Input, AfterContentInit, Pipe, PipeTransform, ChangeDetectionStrategy} from "angular2/core";
import {Control} from "angular2/common";
import {Group} from "../../models/Group";
import {ClassroomsService} from "../../services/classrooms.service";
import {StudentsService} from "../../services/students.service";


@Pipe({
    name: 'withoutStudents',
    pure: false
})
class WithoutStudentsPipe implements PipeTransform {
    // students bez studenata iz groupStudents
    transform(students, groupStudents) {
        var ret = [];

        if (!students || !groupStudents) {
            return students;
        }

        outer:
        for (let i = 0; i < students.length; i++) {
            for (let j = 0; j < groupStudents.length; j++) {
                if (students[i].studentID == groupStudents[j].studentID)
                    continue outer;
            }
            ret.push(students[i]);
        }

        return ret;
    }
}

@Component({
    selector: 'group-edit',
    template: `
    <label>Ime</label>
    <input type="text" [(ngModel)]="group.name"/>
    <br/>
    <label>Učionica</label>
    <select *ngIf="classrooms" name="classroom">
        <option *ngFor="let classroom of classrooms" [value]="classroom.classroomID">{{classroom.number}}</option>
    </select>
    <br/><br/>
    <div class="students">
        <div>
            <h2>Studenti u grupi</h2>
            <select #chosenStuds name="chosen-students" multiple size="10">
                <option *ngFor="let student of chosenStudents" [value]="student.studentID">
                    {{student.indexNumber}}
                    {{student.UniMembers.name}}
                    {{student.UniMembers.surname}}
                </option>
            </select> 
            <button (click)="moveToOthers(chosenStuds.selectedOptions)"> >> </button>
        </div>
        <div>
            <h2>Ostali sa smera</h2>
            <select name="other-students" multiple size="10" #otherStuds>
                <option *ngFor="let student of otherStudents | withoutStudents : chosenStudents" [value]="student.studentID">
                    {{student.indexNumber}}
                    {{student.UniMembers.name}}
                    {{student.UniMembers.surname}}
                </option>
            </select>
            <button (click)="moveToChosen(otherStuds.selectedOptions)"> << </button>
        </div>
    </div>
    <button (click)="save()">SAVE</button>
    `,
    providers: [ClassroomsService, StudentsService],
    pipes: [WithoutStudentsPipe],
    //changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupEditComponent implements AfterContentInit {

    @Input() group: any;

    private classrooms;
    private errorMessage;

    otherStudents;
    chosenStudents;

    constructor(
        private _service: ClassroomsService,
        private _studentsService: StudentsService
    ) {
        this.getClassrooms();
    }

    moveToOthers(arr) {
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < this.chosenStudents.length; j++) {
                if (this.chosenStudents[j].studentID == arr[i].value) {
                    this.chosenStudents.splice(j--, 1); // pomozi bog
                }
            }
        }
    }

    moveToChosen(arr) {
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < this.otherStudents.length; j++) {
                if (this.otherStudents[j].studentID == arr[i].value) {
                    this.chosenStudents.push(this.otherStudents[j]);
                }
            }
        }
    }
    
    save() {
        
    }

    ngAfterContentInit() {
        this.getAllStudents();

        var ret = [];
        for (let i = 0; i < this.group.GroupsStudents.length; i++) {
            ret.push(this.group.GroupsStudents[i].student);
        }
        this.chosenStudents = ret;
        debugger;
    }

    getClassrooms() {
        this._service.getClassrooms()
            .then(
                cls => this.classrooms = cls,
                error => this.errorMessage = <any>error);
    }

    getAllStudents() {
        this._studentsService.getStudentsOfDepartment(this.group.division.departmentID)
            .then(otherStudents => this.otherStudents = otherStudents, error => this.errorMessage = <any>error);
    }

}
