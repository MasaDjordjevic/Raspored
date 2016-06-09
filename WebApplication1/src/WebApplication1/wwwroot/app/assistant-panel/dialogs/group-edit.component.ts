import {Component, Input, AfterContentInit, Pipe, PipeTransform, ChangeDetectionStrategy} from "angular2/core";
import {Control} from "angular2/common";
import {Group} from "../../models/Group";
import {ClassroomsService} from "../../services/classrooms.service";
import {StudentsService} from "../../services/students.service";
import {GroupsService} from "../../services/groups.service";
import {AssistantService} from "../../services/assistant.service";
import {TimeSpan} from "../../models/TimeSpan";
import {R_DROPDOWN} from "../../ui/r-dropdown";
import {R_BUTTON} from "../../ui/r-button.component";
import {R_INPUT} from "../../ui/r-input-text.component";


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
    directives: [R_INPUT, R_DROPDOWN, R_BUTTON]
    template: `
<form #form="ngForm" (ngSubmit)="save(form.value)">
    <label>Ime</label>
    <input type="text" [(ngModel)]="group.name" ngControl="groupName"/>
    <br/>
    <label>Učionica</label>
    <select *ngIf="classrooms" name="classroom" ngControl="classroom"  [(ngModel)]="group.classroomID">
        <option *ngFor="let classroom of classrooms" [value]="classroom.classroomID" >{{classroom.number}}</option>
    </select>
    <label>Asistent</label>
    <!-- [(ngModel)]="assistants[0].uniMemberID" -->
    <select *ngIf="assistants" name="assistant" ngControl="assistant" >
        <option *ngFor="let assistant of assistants" [value]="assistant.uniMemberID" >{{assistant.name}} {{assistant.surname}}</option>
        {{assistant | json}}
    </select>
    <button type="button" (click)="getAllAssistants()">Svi asistenti </button>
    <br/><br/>
    
    <label>Pocetak (2016-02-17T08:15:00)</label>
        <input type="text"  ngControl="timeStart" [value]="group.timeSpan && group.timeSpan.startDate"/>
       <br/>
        
        <label>Kraj</label>
        <input type="text"  ngControl="timeEnd" [value]="group.timeSpan && group.timeSpan.endDate"/>
        <br/>
       
       <label>Perioda</label>
        <input type="text"  ngControl="period" [value]="group.timeSpan && group.timeSpan.period"/>
       <br/>
    
    <div class="students">
        <div>
            <h2>Studenti u grupi</h2>
            <select #chosenStuds name="chosen-students" multiple size="10" >
                <option *ngFor="let student of chosenStudents" [value]="student.studentID">
                    {{student.indexNumber}}
                    {{student.UniMembers.name}}
                    {{student.UniMembers.surname}}
                </option>
            </select> 
            <button type="button" (click)="moveToOthers(chosenStuds.selectedOptions)"> >> </button>
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
            <button type="button" (click)="moveToChosen(otherStuds.selectedOptions)"> << </button>
        </div>
    </div>
     <button type="submit">SAVE</button>
</form>
    `,
    providers: [ClassroomsService, StudentsService, AssistantService],
    pipes: [WithoutStudentsPipe],
})

// Koristi se i za Editovanje postojece grupe i za kreiranje nove grupe.
export class GroupEditComponent implements AfterContentInit {

    @Input() group: any;

    private classrooms;
    private assistants;
    private errorMessage;

    otherStudents;
    chosenStudents;

    constructor(
        private _service: ClassroomsService,
        private _groupsService: GroupsService,
        private _studentsService: StudentsService,
        private _assistantsService: AssistantService
    ) {
        this.getClassrooms();
    }

    getAssisatnts() {
        this._assistantsService.getAssistantsByGroupID(this.group.groupID).then(
            asst => this.assistants = asst,
            error => this.errorMessage = error
        );
    }
    getAllAssistants(){
        this._assistantsService.getAssistants().then(
            asst => this.concatAssistanst(asst),
            error => this.errorMessage = error
        );
    }

    concatAssistanst(asst) {
        this.assistants = this.assistants.concat(asst);

        //brisanje duplikata
        this.assistants = this.uniq_fast(this.assistants)
    }

    uniq_fast(a) {
        var seen = {};
        var out = [];
        var len = a.length;
        var j = 0;
        for(var i = 0; i < len; i++) {
            var item = a[i];
            if(seen[item.uniMemberID] !== 1) {
                seen[item.uniMemberID] = 1;
                out[j++] = item;
            }
        }
        return out;
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
    
    save(value) {
        console.log(value);
        var pom: Array<number> = this.chosenStudents.map(i=>i.studentID);
        console.log(pom);
        var timespan:TimeSpan = new TimeSpan;
        debugger;
        if (value.timeStart && value.timeEnd && value.period) {
            timespan.startDate = value.timeStart;
            timespan.endDate = value.timeEnd;
            timespan.period = value.period;
        } else {
            timespan = null;
        }
        console.log(timespan);
        this._groupsService.updateGroup(this.group.groupID, this.group.division.divisionID, value.assistant, value.groupName, value.classroom, timespan,  pom)
            .then(status => console.log(status));
    }

    ngAfterContentInit() {
        this.getAllStudents();

        var ret = [];
        for (let i = 0; i < this.group.GroupsStudents.length; i++) {
            ret.push(this.group.GroupsStudents[i].student);
        }
        this.chosenStudents = ret;

        if(this.group.groupID) {
            this.getAssisatnts();
        }

        //debugger;
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
