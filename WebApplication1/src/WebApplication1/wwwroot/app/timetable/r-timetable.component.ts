import {Component, Input, AfterContentChecked, AfterContentInit} from "angular2/core";
import {TimetableClassComponent} from "./r-timetable-class.component";
import {TimetableColumnComponent} from "./r-timetable-column.component";
import {ToTimestampPipe} from "../pipes/to-timestamp.pipe";
import {R_BUTTON} from "../ui/r-button.component";
import {R_DIALOG} from "../ui/r-dialog";
import {StudentsService} from "../services/students.service";
import {GroupsService} from "../services/groups.service";
import {DivisionsService} from "../services/divisions.service";
import {DepartmentService} from "../services/department.service";
import {ClassroomsService} from "../services/classrooms.service";
import {AssistantService} from "../services/assistant.service";
import {GlobalService} from "../services/global.service";


export enum Mode {
    StudentGlobal,
    StudentPersonal,
    StudentOfficial,
    AssistantOfficial,
    ClassroomOfficial,
}

@Component({
    selector: 'r-timetable',
    template: `
    <template [ngIf]="classes">
    

        <div class="day-titles-fixed">
            <template ngFor let-i [ngForOf]="[0, 1, 2, 3, 4, 5, 6]">
                <div *ngIf="displayDay[i]">{{dayNames[i]}}</div>
            </template>
        </div>

        <div class="time-marks">
            <div *ngFor="let timeStamp of timeStamps"
                 [style.height]="showEvery * scale + 'px'">
                <span>{{timeStamp}}</span>
            </div>
        </div>
        
        <div class="gutter"></div>
        
        <button r-button fab
                text="&#x26A2;"
                id="options-button"
                #optionsButton
                (click)="optionsDialog.open()"></button>
        
        <r-dialog #optionsDialog [source]="optionsButton">
            <div style="padding:2em; height: 600px; width: 600px;">
                <form><fieldset style="padding:.5em">
                    <legend>Prikaz dana u nedelji</legend>
                    <label *ngFor="let day of dayNames; let i = index">
                        <input type="checkbox" [(ngModel)]="displayDay[i]"/>
                        {{day}}
                        <br/>
                    </label>
                </fieldset></form>
                <form><fieldset style="padding:.5em">
                    <legend>Advanced</legend>
                    <label>
                        Weeks from now ({{weeksFromNow}})
                        <input type="number" min="-100" max="100" step="1" [(ngModel)]="weeksFromNow" />
                    </label><br/>
                    <!--                 
                    <select name="mode" [(ngModel)]="mode">
                        <option [value]="0">student</option>
                        <option [value]="1">grupa</option>
                        <option [value]="2">globalni</option>
                        <option [value]="3">ucionica</option>
                    </select>
                    <input type="number" min="0" max="15000" step="1" *ngIf="mode == 0" [(ngModel)]="studentID" />
                    <input type="number" min="0" max="15000" step="1" *ngIf="mode == 1" [(ngModel)]="groupID" />
                    <input type="number" min="0" max="15000" step="1" *ngIf="mode == 2" [(ngModel)]="departmentID" />                    
                    <select *ngIf="mode == 3" name="classroom"  [(ngModel)]="classroomID">
                        <option *ngFor="let classroom of classrooms" [value]="classroom.classroomID" >{{classroom.number}}</option>
                    </select>
                    mode: {{mode}} s:{{studentID}} g:{{groupID}} dep:{{departmentID}} c:{{classroomID}}
                    -->
                    <br/>
                        Beginning minutes ({{beginningMinutes | toTimestamp}})
                        <input type="number" min="0" max="1440" step="5" [(ngModel)]="beginningMinutes"/>
                    <br/>
                    <label>
                        Ending minutes ({{endingMinutes | toTimestamp}})
                        <input type="number" min="0" max="1440" step="5" [(ngModel)]="endingMinutes"/>
                    </label><br/>
                    <label>
                        Show every ({{showEvery | toTimestamp}})
                        <input type="number" min="1" max="60" step="1" [(ngModel)]="showEvery"/>
                    </label><br/>
                    <label>
                        Scale
                        <input type="number" min="1" max="10" step=".1" [(ngModel)]="scale"/>
                    </label>
                </fieldset></form>
                <form #form="ngForm" (submit)="addNewActivity(form.value)"><fieldset style="padding:.5em">
                    <legend>Nova lična aktivnost</legend>
                    <label>Dan</label>
                    <select #newActivityDay ngControl="newActivityDay" required>
                        <option *ngFor="let dayName of dayNames; let i = index" [value]="i">{{dayName}}</option>
                    </select> {{newActivityDay.value}}<br/>
                    <label>Početak</label>
                    <input required type="number" min="0" max="1440" step="10" value="730" #newActivityStart ngControl="newActivityStart"/> {{newActivityStart.value | toTimestamp}} <br/>
                    <label>Trajanje</label>
                    <input required type="number" min="1" max="1439" step="1" value="60" #newActivityDuration ngControl="newActivityDuration"/> {{newActivityDuration.value | toTimestamp}} <br/>
                    <label>Naslov</label>
                    <input required type="text" value="Moja Aktivnost" #newActivityTitle ngControl="newActivityTitle"/> {{newActivityTitle.value}} <br/>
                    <label>Opis</label>
                    <textarea required #newActicityDesc ngControl="newActivityDesc">Opis moje aktivnosti.</textarea> {{newActicityDesc.value}} <br/>
                    <button type="submit">Dodaj</button>
                </fieldset></form>
            </div>
        </r-dialog>
        
        
        <template ngFor let-i [ngForOf]="[0, 1, 2, 3, 4, 5, 6]">
            <r-timetable-column
                *ngIf="displayDay[i] && classes[i]"
                [title]="dayNames[i]"
                [titleAbbr]="dayNamesAbbr[i]"
                [classes]="classes[i]"
                [beginningMinutes]="beginningMinutes"
                [showEvery]="showEvery"
                [scale]="scale"
                [mode]="mode">
            </r-timetable-column>
        </template>
        
    </template>
    `,
    styleUrls: ['app/timetable/r-timetable.css'],
    providers: [StudentsService, GroupsService, DepartmentService, ClassroomsService, AssistantService],
    directives: [TimetableColumnComponent, R_BUTTON, R_DIALOG],
    pipes: [ToTimestampPipe]
})
export class TimetableComponent {

    beginningMinutes: number = 480; // npr. 07:00 je 420
    endingMinutes: number = 1200; // npr. 20:00 je 1200
    showEvery: number = 15; // npr. prikǎzi liniju na svakih 15 minuta
    scale: number = 2.2; // koliko piksela je jedan minut

    errorMessage: string;
    classes: any[];

    _weeksFromNow: number = 0;
    _groupID: number;
    _studentID: number;
    _officialStudentID: number;
    _departmentID: number;
    _classroomID: number;
    _assistantID: number;

    @Input() type: 'official' | 'global' | 'personal' = 'official';

    get mode() {
        if (this.type === 'official' && this.studentID) {
            return Mode.StudentOfficial;
        } else if (this.type === 'global' && this.studentID) {
            return Mode.StudentGlobal;
        } else if (this.type === 'personal' && this.studentID) {
            return Mode.StudentPersonal;
        } else if (this.classroomID) {
            return Mode.ClassroomOfficial;
        } else if (this.assistantID) {
            return Mode.AssistantOfficial;
        } else {
            return Mode.StudentOfficial; // default
        }
    }

    get weeksFromNow() {
        return this._weeksFromNow;
    }
    @Input() set weeksFromNow(w) {
        this._weeksFromNow = w;
        this.getSchedule();
    }

    getSchedule() {
        if (this.studentID)
            this.getStudentSchedule();
        if (this.classroomID)
            this.getClassroomSchedule();
        if (this.groupID)
            this.getGroupSchedule();
        if (this.departmentID)
            this.getDepartmentSchedule();
        if (this.officialStudentID)
            this.getOfficialStudentSchedule();
        if (this.assistantID)
            this.getAssistantSchedule();

    }

    get groupID () {
        return this._groupID;
    }
    @Input() set groupID(g) {
        if (!g) return;
        this._groupID = g;
        this.getGroupSchedule();
    }

    get studentID () {
        return this._studentID;
    }
    @Input() set studentID(s) {
        if (!s) return;
        this._studentID = s;
        this.getStudentSchedule();
    }

    get officialStudentID() {
        return this._officialStudentID;
    }
    @Input() set officialStudentID(id) {
        if (!id) return;
        this._officialStudentID = id;
        this.getOfficialStudentSchedule();
    }

    get departmentID () {
        return this._departmentID;
    }
    @Input() set departmentID(g) {
        if (!g) return;
        this._departmentID = g;
        this.getDepartmentSchedule();
    }

    get classroomID () {
        return this._classroomID;
    }
    @Input() set classroomID(g) {
        if (!g) return;
        this._classroomID = g;
        this.getClassroomSchedule();
    }

     get assistantID () {
        return this._assistantID;
    }
    @Input() set assistantID(a) {
        if (!a) return;
        this._assistantID = a;
        this.getAssistantSchedule();
    }


    get timeStamps(): Array<string> {
        var ret = [];
        var toTimestampPipe = new ToTimestampPipe();
        // Da ne udje u beskonacnu petlju
        if (this.showEvery == 0) return ret;
        for (let min = this.beginningMinutes; min <= this.endingMinutes; min += this.showEvery) {
            ret.push(toTimestampPipe.transform(min));
        }
        return ret;
    };

    constructor(
        private _studentsService: StudentsService,
        private _groupsService: GroupsService,
        private _departmentsService: DepartmentService,
        private _clasroomsService: ClassroomsService,
        private _assistantService: AssistantService,
        private _globalService: GlobalService
    )
    {
        this._globalService.refreshStudentPanelPersonal$
            .subscribe(item => this.refresh());
    }
    
    public refresh() {
        this.studentID = <any>(new Number(this.studentID));
    }

    getStudentSchedule(){
        //TODO prosledi lepo ID, preko sesije
        this._studentsService.getPersonalSchedule(this.studentID, this.weeksFromNow)
            .then(
                sch => this.classes = sch,
                error => this.errorMessage = error
            ).then(() => this.pom());
    }

    getOfficialStudentSchedule() {
        //TODO prosledi lepo ID, preko sesije (valjda)
        this._studentsService.getOfficialSchedule(this.officialStudentID, this.weeksFromNow)
            .then(
                sch => this.classes = sch,
                error => this.errorMessage = error
            ).then(() => this.pom());
    }

    getGroupSchedule(){
        //TODO prosledi lepo ID
        this._groupsService.getSchedule(this.groupID, this.weeksFromNow)
            .then(
                sch => this.classes = sch,
                error => this.errorMessage = error
            ).then(() => this.pom());
    }

    getDepartmentSchedule() {
        //TODO prosledi lepo ID
        this._departmentsService.getSchedule(this.departmentID, this.weeksFromNow)
            .then(
                sch => this.classes = sch,
                error => this.errorMessage = error
            ).then(() => this.pom());
    }

    getClassroomSchedule() {
        //TODO prosledi lepo ID
        this._clasroomsService.getSchedule(this.classroomID, this.weeksFromNow)
            .then(
                sch => this.classes = sch,
                error => this.errorMessage = error
            ).then(() => this.pom());
    }

    getAssistantSchedule() {
        this._assistantService.getSchedule(this.assistantID, this.weeksFromNow)
            .then(
                sch => this.classes = sch,
                error => this.errorMessage = error
            ).then(() => this.pom());
    }
    
    

    pom() {
        console.log(this.classes);
    }

    dayNames: Array<string> = ["Ponedeljak", "Utorak", "Sreda", "Četvrtak", "Petak", "Subota", "Nedelja"];
    dayNamesAbbr: Array<string> = ["pon", "uto", "sre", "čet", "pet", "sub", "ned"];
    displayDay: Array<boolean> = [true, true, true, true, true, true, false];

    public addNewActivity(value) {
        //TODO
        alert("Sledi mock dodavanje. Implementirati AJAX poziv.");
        var newClass = {
            startMinutes: value.newActivityStart,
            durationMinutes: value.newActivityDuration,
            activityTitle: value.newActivityTitle,
            activityContent: value.newActivityDesc,
            active: true,
            color: "#FF00FF",
        };

        var theDay = this.classes[+value.newActivityDay].push(newClass);
    }



     /*public classes = [
        [
            // ponedeljak
            {startMinutes: 615, durationMinutes: 65, className: "Sistemi baza podataka", abbr: "SBP", classroom: "A2", assistant: "Vlada Mihajlovitj", type: "predavanje", color: "#f44336", active: true},
            {startMinutes: 675, durationMinutes: 45, className: "Sistemi baza podataka", abbr: "SBP", classroom: "A2", assistant: "Clada Mihajlovitj", type: "predavanje", color: "#f44336", active: false},
            {startMinutes: 500, durationMinutes: 90, activityTitle: "Teretana", activityContent: "Moji su bicepsi biseri rasuti po celom benču", color: "#E91E63", active: true},
            {startMinutes: 735, durationMinutes: 45, className: "Veštačka inteligencija", abbr: "VI", classroom: "431", assistant: "Vlada Mihajlovitj", type: "računske", color: "#673AB7", active: true},
            {startMinutes: 840, durationMinutes: 90, className: "Sistemi baza podataka", abbr: "SBP", classroom: "2xx", assistant: "Medica Dobrog Srca", type: "laboratorijske", color: "#f44336", active: true},
            {startMinutes: 930, durationMinutes: 90, className: "Veb programiranje", abbr: "WEB", classroom: "234", assistant: "Ivica Comic Sans", type: "laboratorijske", color: "#2196F3", active: true},
            {startMinutes: 795, durationMinutes: 45, className: "Veštačka inteligencija", abbr: "VI", classroom: "431", assistant: "Vlada Mihajlovitj", type: "računske", color: "#673AB7", active: true},

        ],
        [
            // utorak
            {startMinutes: 495, durationMinutes: 45, className: "Softversko inženjerstvo", abbr: "SWE", classroom: "A2", assistant: "Vlada Mihajlovitj", type: "predavanje", color: "#8BC34A", active: true},
            {startMinutes: 555, durationMinutes: 45, className: "Softversko inženjerstvo", abbr: "SWE", classroom: "A2", assistant: "Vlada Mihajlovitj", type: "predavanje", color: "#8BC34A", active: true},
            {startMinutes: 615, durationMinutes: 45, className: "Mikroračunarski sistemi", abbr: "MIKS", classroom: "222", assistant: "Vlada Mihajlovitj", type: "računske", color: "#FFC107", active: true, announcement: "OVO JE SPARTA!"},
            {startMinutes: 675, durationMinutes: 45, className: "Mikroračunarski sistemi", abbr: "MIKS", classroom: "222", assistant: "Vlada Mihajlovitj", type: "računske", color: "#FFC107", active: true},
            {startMinutes: 900, durationMinutes: 90, className: "Veštačka inteligencija", abbr: "VI", classroom: "2xx", assistant: "Vlada Mihajlovitj", type: "laboratorijske", color: "#673AB7", active: true},
        ],
        [
            // sreda
            {startMinutes: 555, durationMinutes: 45, className: "Veštačka inteligencija", abbr: "VI", classroom: "A2", assistant: "Vlada Mihajlovitj", type: "predavanje", color: "#673AB7", active: true},
            {startMinutes: 615, durationMinutes: 45, className: "Veštačka inteligencija", abbr: "VI", classroom: "A2", assistant: "Vlada Mihajlovitj", type: "predavanje", color: "#673AB7", active: true},
            {startMinutes: 675, durationMinutes: 45, className: "Mikroračunarski sistemi", abbr: "MIKS", classroom: "A3", assistant: "Vlada Mihajlovitj", type: "predavanje", color: "#FFC107", active: true},
            {startMinutes: 735, durationMinutes: 45, className: "Mikroračunarski sistemi", abbr: "MIKS", classroom: "A3", assistant: "Clada Mighahd", type: "predavanje", color: "#FFC107", active: true}
        ],
        [
            // četvrtak
            {startMinutes: 495, durationMinutes: 45, className: "Veb programiranje", abbr: "WEB", classroom: "525", assistant: "Petko Biceps <3", type: "predavanje", color: "#2196F3", active: true},
            {startMinutes: 555, durationMinutes: 45, className: "Veb programiranje", abbr: "WEB", classroom: "525", assistant: "Petko Biceps <3", type: "predavanje", color: "#2196F3", active: true},
            {startMinutes: 615, durationMinutes: 45, className: "Veb programiranje", abbr: "WEB", classroom: "525", assistant: "Petko Biceps <3", type: "računske", color: "#2196F3", active: true},
            {startMinutes: 675, durationMinutes: 45, className: "Veb programiranje", abbr: "WEB", classroom: "525", assistant: "Petko Biceps <3", type: "računske", color: "#2196F3", active: true},
        ],
        [
            // petak
            {startMinutes: 495, durationMinutes: 45, className: "Engleski jezik II", abbr: "ENG2", classroom: "A2", assistant: "Houp Dickovitj", type: "predavanje", color: "#FF5722", active: true},
            {startMinutes: 555, durationMinutes: 45, className: "Engleski jezik II", abbr: "ENG2", classroom: "A2", assistant: "Houp Dickovitj", type: "predavanje", color: "#FF5722", active: true}
        ],
        [
            // subota
        ],
        [
            // nedelja
        ],
    ]*/

}
