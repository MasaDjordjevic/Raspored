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
import {R_MULTIPLE_SELECTOR} from "../../ui/multiple-selector.component";
import {R_STUDENT_SELECTOR} from "./students-selector.component";


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
    directives: [R_INPUT, R_DROPDOWN, R_BUTTON],
    template: `
<!--<form #form="ngForm" (ngSubmit)="save(form.value)">-->
    <!--<label>Ime</label>
    <input type="text" [(ngModel)]="group.name" ngControl="groupName"/>
    <br/>
    <label>Učionica</label>
    <select *ngIf="classrooms" name="classroom" ngControl="classroom"  [(ngModel)]="group.classroomID">
        <option *ngFor="let classroom of classrooms" [value]="classroom.classroomID" >{{classroom.number}}</option>
    </select>
    
    <label>Asistent</label>
    
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
       <br/>-->
       
       
    <r-input class="light-theme" [label]="'Ime grupe'" [(val)]="editedGroupName"></r-input>
    
    
    
    <r-dropdown [label]="'Učionica'" [(val)]="editedClassroom">
        <r-dropdown-item *ngFor="let classroom of classrooms" [value]="classroom.classroomID">
            {{classroom.number}}
        </r-dropdown-item>
    </r-dropdown>
    
    
    
    <r-dropdown *ngIf="assistants" [label]="'Asistent'" name="assistant" [val]="editedAssistant">
        <r-dropdown-item *ngFor="let assistant of assistants" [value]="assistant.uniMemberID" >{{assistant.name}} {{assistant.surname}}</r-dropdown-item>
    </r-dropdown>

    <button r-button flat type="button" (click)="getAllAssistants()" [text]="'Svi asistenti'"></button>
    
    
    
    <r-input class="light-theme" [label]="'Početak'" [(val)]="editedTimeStart"></r-input>
    <r-input class="light-theme" [label]="'Kraj'" [(value)]="editedTimeEnd"></r-input>
    <r-input class="light-theme" [label]="'Perioda'" [(value)]="editedPeriod"></r-input>   
       
    
    
    <div style="height: 340px; width: 550px;">
        <r-students-selector #chosenStuds [students]="chosenStudents" primaryColor="MaterialRed">
        </r-students-selector>
    </div>
    
    <button r-button raised [text]="'Izbaci iz grupe'" primaryColor="MaterialRed"
            (click)="moveToOthers(chosenStuds.selected); chosenStuds.selected = null">
    </button>
    
    <div style="height: 340px; width: 550px;">
        <r-students-selector #otherStuds [(selected)]="selectedOtherStudents" [students]="otherStudents | withoutStudents : chosenStudents" primaryColor="MaterialRed">
        </r-students-selector>
    </div>
    
    <button r-button raised [text]="'Ubaci u grupu'" primaryColor="MaterialGreen"
            (click)="moveToChosen(otherStuds.selected)"
            >        
    </button>
        
     <button r-button raised [text]="'Sačuvaj izmene'" type="submit" (click)="save()"></button>
     
<!--</form>-->
    `,
    providers: [ClassroomsService, StudentsService, AssistantService],
    pipes: [WithoutStudentsPipe],
    directives: [R_INPUT, R_DROPDOWN, R_BUTTON, R_MULTIPLE_SELECTOR, R_STUDENT_SELECTOR]
})

// Koristi se i za Editovanje postojece grupe i za kreiranje nove grupe.
export class GroupEditComponent implements AfterContentInit {

    _group;

    get group() {
        return this._group;
    }

    set group(g) {
        this._group = g;
        console.log(g);
        this.editedGroupName = g.name;
        this.editedClassroom = g.classroomID;
        this.editedAssistant = g.assistant && g.assistant.uniMemberID;
        this.editedTimeStart = g.timespan && g.timespan.startDate;
        this.editedTimeEnd = g.timespan && g.timespan.endDate;
        this.editedPeriod = g.timespan && g.timespan.period;
    }

    @Input() group: any;



    private classrooms;
    private assistants;
    private errorMessage;

    otherStudents;
    chosenStudents;

    // Todo probaj kroz bez ovoga
    selectedChosenStudents;
    selectedOtherStudents;

    constructor(
        private _service: ClassroomsService,
        private _groupsService: GroupsService,
        private _studentsService: StudentsService,
        private _assistantsService: AssistantService
    ) {
        this.getClassrooms();
    }

    editedAssistant: any;
    editedClassroom: any;
    editedGroupName: string;
    editedTimeStart: any;
    editedTimeEnd: any;
    editedPeriod: any;

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
                if (this.chosenStudents[j].studentID == arr[i]) {
                    this.chosenStudents.splice(j--, 1); // pomozi bog
                }
            }
        }
    }

    moveToChosen(arr) {
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < this.otherStudents.length; j++) {
                if (this.otherStudents[j].studentID == arr[i]) {
                    this.chosenStudents.push(this.otherStudents[j]);
                }
            }
        }
    }
    
    save() {
        var pom: Array<number> = this.chosenStudents.map(i => i.studentID);
        console.log(pom);
        var timespan:TimeSpan = new TimeSpan;
        if (this.editedTimeStart && this.editedTimeEnd && this.editedPeriod) {
            timespan.startDate = this.editedTimeStart;
            timespan.endDate = this.editedTimeEnd;
            timespan.period = this.editedPeriod;
        } else {
            timespan = null;
        }
        console.log(timespan);
        debugger;
        this._groupsService.updateGroup(this.group.groupID, this.group.division.divisionID, this.editedAssistant, this.editedGroupName, this.editedClassroom, timespan,  pom)
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
