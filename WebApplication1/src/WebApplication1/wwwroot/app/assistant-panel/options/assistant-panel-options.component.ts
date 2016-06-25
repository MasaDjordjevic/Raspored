import {Component} from "angular2/core";
import {Assistant} from "../../models/Assistant";
import {R_BUTTON} from "../../ui/r-button.component";
import {R_STEPPER} from "../../ui/r-stepper.component";
import {R_DIALOG} from "../../ui/r-dialog";
import {R_INPUT} from "../../ui/r-input-text.component";
import {R_DROPDOWN} from "../../ui/r-dropdown";
import {R_DL} from "../../ui/r-dl";
import {Control} from "angular2/common";
import {R_MULTIPLE_SELECTOR} from "../../ui/multiple-selector.component";
import {multicast} from "rxjs/operator/multicast";
import {GlobalService} from "../../services/global.service";
import {TimetableComponent} from "../../timetable/r-timetable.component";
import {TimetableClassComponent} from "../../timetable/r-timetable-class.component";
import {TimetableColumnComponent} from "../../timetable/r-timetable-column.component";
import {ClassroomsService} from "../../services/classrooms.service";
import {Department} from "../../models/Department";
import {YearDepartments} from "../../models/YearDepartments";
import {DepartmentService} from "../../services/department.service";
import {CoursesService} from "../../services/courses.service";
import {StudentsService} from "../../services/students.service";
import {AssistantService} from "../../services/assistant.service";

@Component({
    selector: 'r-assistant-panel-options',
    template: `
    <div class="container">
    
        <!-- radi -->
        <!--<r-input class="light-theme" label="Labela" [(val)]="inputText" style="width:50%;"></r-input>
        <r-input class="light-theme" label="Labela" [(val)]="inputText" style="width:50%;"></r-input>
        <input [(ngModel)]="inputText" type="text"/>
        <span>{{inputText}}</span>-->       
        
        
        
        <!-- radi -->
        <!--<r-dropdown [(val)]="dropdown" label="Labela bre" style="width:60%;" [primaryColor]="'MaterialRed'" >
            <r-dropdown-item *ngFor="let b of ['b1', 'b2', 'b3', 'b4', 'b5']" [value]="b">{{b + "ooo"}}</r-dropdown-item>
        </r-dropdown>
        
        <div style="width:100%; min-height: 20px;"></div>
        
        <r-dropdown [(val)]="dropdown" label="Labela bre" style="width:60%;">
            <r-dropdown-item *ngFor="let b of ['b1', 'b2', 'b3', 'b4', 'b5']" [value]="b">{{b + "ooo"}}</r-dropdown-item>
        </r-dropdown>
        
        <select [(ngModel)]="dropdown">
            <option value="b1">boob1</option>
            <option value="b2">boob2</option>
            <option value="b3">boob3</option>
            <option value="b4">boob4</option>
            <option value="b5">boob5</option>
        </select>
        
        <span>{{dropdown}}</span>
        
        <div style="width:100%; min-height: 100px;"></div>
        
        <h1>{{_globalService.translate("TEST_STRING")}}</h1>
        -->
        <!--radi-->
        <!--<r-multiple-selector [(val)]="multipleSelector" style="width:45%" primaryColor="MaterialGreen">
            <r-multiple-selector-item *ngFor="let n of stuff; let i = index" [val]="i">
                <span>{{n.split('').reverse().join('')}}</span>
                <span>{{n.substring(5)}}</span>
            </r-multiple-selector-item>
        </r-multiple-selector>
        
        <r-multiple-selector [(val)]="multipleSelector" style="width:45%" primaryColor="MaterialRed">
            <r-multiple-selector-item *ngFor="let n of stuff; let i = index" [val]="i">
                <span>{{n.split('').reverse().join('')}}</span>
                <span>{{n.substring(5)}}</span>
            </r-multiple-selector-item>
        </r-multiple-selector>
        
        <div style="width:100%; min-height: 20px;"></div>
        
        <span>{{multipleSelector | json}}</span>
        <button (click)="toggle2()">toggle 2</button>
        <button (click)="addNew()">add new</button>
        
        <div style="width:100%; min-height: 20px;"></div>-->
        
        <div id="options">
            <label>
                Weeks from now 
                <input type="number" min="-100" max="100" step="1" [(ngModel)]="weeksFromNow" />
            </label>
            <label>
                Assistant ID
                <input type="number" min="1" max="100000" step="1" [(ngModel)]="assistantID" />
            </label><br/>
            <r-dropdown name="mode" [label]="'Režim'" [(val)]="mode">
                <r-dropdown-item [value]="0">student</r-dropdown-item>
                <r-dropdown-item [value]="1">globalni</r-dropdown-item>
                <r-dropdown-item [value]="2">učionica</r-dropdown-item>
            </r-dropdown>
            <div *ngIf="mode == 0 || mode  == 1">
                <r-dropdown #selYears *ngIf="yearDepartments != null" [label]="'Godina studija'" [(val)]="selectedYear" >                 
                    <r-dropdown-item *ngFor="let yd of yearDepartments; let i = index"  [value]="i">
                        {{yd.year}}
                    </r-dropdown-item>
                </r-dropdown>
                
                <r-dropdown *ngIf="depsOfSelected != null" [label]="'Departments'" [(val)]="departmentID">
                    <r-dropdown-item *ngFor="let dep of depsOfSelected" [value]="dep.departmentID">
                        {{dep.departmentName}}
                    </r-dropdown-item>
                </r-dropdown>
                
                <r-dropdown *ngIf="mode == 0" [label]="'Student'"  [(val)]="studentID">
                    <r-dropdown-item *ngFor="let stud of students" [value]="stud.studentID">{{stud.UniMembers.surname}} {{stud.UniMembers.name}} ({{stud.indexNumber}})</r-dropdown-item>
                </r-dropdown>
            </div>
                            
            <r-dropdown *ngIf="mode == 2"  [label]="'Učionica'" [(val)]="classroomID">
                <r-dropdown-item *ngFor="let classroom of classrooms" [value]="classroom.classroomID" >{{classroom.number}}</r-dropdown-item>
            </r-dropdown>
            mode: {{mode}} s:{{studentID}} g:{{groupID}} dep:{{departmentID}} c:{{classroomID}}
        </div>
        
        <div id="timetable">
                <r-timetable [studentID]="studentID" [classroomID]="classroomID" [departmentID]="departmentID" [groupID]="groupID" [assistantID]="assistantID" ></r-timetable>
        </div>
        
    </div>
    `,
    providers: [ClassroomsService, CoursesService, DepartmentService, StudentsService, AssistantService],
    styleUrls: ['app/assistant-panel/options/assistant-panel-options.css'],
    directives: [R_BUTTON, R_STEPPER, R_DIALOG, R_INPUT, R_DROPDOWN, R_DL, R_MULTIPLE_SELECTOR, TimetableComponent],
})

export class AssistantPanelOptionsComponent {

    public inputText: string = "boobs";
    public dropdown: string;

    public _multipleSelector: string[] = [];

    public get multipleSelector(): string[] {
        return this._multipleSelector;
    }

    public set multipleSelector(m: string[]) {
        this._multipleSelector = m;
    }

    public stuff: string[] = [];

    public randomString = (n) => (Math.random() + 1).toString(36).substring(2, n + 2);

    constructor(
        private _globalService: GlobalService,
        private _clasroomsService: ClassroomsService,
        private _coursesService: CoursesService,
        private _departmentsService: DepartmentService,
        private _studentsService: StudentsService
    ) {
        this.getClassrooms();
        this.getDepartmentsByYear();
        for (let i = 0; i < 4; this.stuff[i++] = this.randomString(i * 10 % 7 + 10));
    }

    public toggle2() {
        this.multipleSelector = this.multipleSelector.concat();
        var ind = this._multipleSelector.indexOf("2");
        if (!~ind) this._multipleSelector.push("2");
        else this._multipleSelector.splice(ind, 1);
    }

    public addNew() {
        this.stuff = this.stuff.concat();
        this.stuff.push(this.randomString(10));
    }

    assistant: Assistant;
    yearDepartments:YearDepartments[];
    depsOfSelected: Department[];

    _selectedYear;
    get selectedYear(){
        return this._selectedYear;
    }
    set selectedYear(index:number) {
        this._selectedYear = index;
        this.depsOfSelected = this.yearDepartments[index].departments;
        this.departmentID = this.depsOfSelected[0].departmentID;
    }


    getDepartmentsByYear() {
        this._departmentsService.getDepartmentsByYear()
            .then(
                deps => this.yearDepartments = deps,
                error => this.errorMessage = <any>error);
    }

    students: any[];

    getStudentsOfDepartment() {
        this._studentsService.getStudentsOfDepartment(this._departmentID)
            .then(studs => this.students = studs,
            error => this.errorMessage = error);
    }

    _studentID: number;
    _groupID: number;
    _departmentID: number;
    _classroomID: number;
    _assistantID: number = 1;
    _weeksFromNow:number = 0;

    _mode: number;
    get mode() {
        return this._mode;
    }
    set mode(m) {
        this._mode = m;
    }

    clearAllIDs() {
        this._studentID = null;
        this._groupID = null;
        this._departmentID = null;
        this._classroomID = null;
        this._assistantID = null;
    }

    get weeksFromNow() {
        return this._weeksFromNow;
    }
    set weeksFromNow(w) {
        this._weeksFromNow = w;
    }

    get studentID() {
        return this._studentID;
    }
    set studentID(s) {
        var depID = this._departmentID;
        this.clearAllIDs();
        this._departmentID = depID;
        this._studentID = s;
    }

    get groupID() {
        return this._groupID;
    }
    set groupID(g) {
        this.clearAllIDs();
        this._groupID = g;
    }

    get classroomID() {
        return this._classroomID;
    }
    set classroomID(c) {
        this.clearAllIDs();
        this._classroomID = c;
    }

    get departmentID() {
        return this._departmentID;
    }
    set departmentID(d) {
        this.clearAllIDs();
        this._departmentID = d;
        this.getStudentsOfDepartment();
    }

    get assistantID() {
        return this._assistantID;
    }
    set assistantID(a) {
        this.clearAllIDs();
        this._assistantID = a;
    }

    classrooms: any[];
    errorMessage: string;
    getClassrooms() {
        this._clasroomsService.getClassrooms()
         .then(
             cls => this.classrooms = cls,
             error => this.errorMessage = <any>error);
    }



}