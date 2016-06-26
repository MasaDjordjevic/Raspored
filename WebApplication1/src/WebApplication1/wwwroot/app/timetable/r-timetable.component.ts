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


export enum TimetableType {
    Official, Personal, Global
}

export enum Mode {
    StudentOfficial,
    StudentPersonal,
    StudentGlobal,
    AssistantOfficial,
    ClassroomOfficial,
}

@Component({
    selector: 'r-timetable',
    templateUrl: 'app/timetable/r-timetable.html',
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

    clearAll() {
        this._groupID = this._studentID = this._officialStudentID =
            this._departmentID = this._classroomID = this._assistantID = null;
    }

    @Input() type: TimetableType;

    get mode() {
        if (this.type === TimetableType.Official && this.officialStudentID) {
            return Mode.StudentOfficial;
        } else if (this.type === TimetableType.Global && this.departmentID) {
            return Mode.StudentGlobal;
        } else if (this.type === TimetableType.Personal && this.studentID) {
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
        if (this.studentID) {
            this.getStudentSchedule();
        } else if (this.classroomID) {
            this.getClassroomSchedule();
        } else if (this.groupID) {
            this.getGroupSchedule();
        } else if (this.departmentID) {
            this.getDepartmentSchedule();
        } else if (this.officialStudentID) {
            this.getOfficialStudentSchedule();
        } else if (this.assistantID) {
            this.getAssistantSchedule();
        } else {
            /*debugger;*/
            throw "nesto ne valja";
        }
    }

    get groupID () {
        return this._groupID;
    }
    @Input() set groupID(g) {
        if (!g) return;
        this.clearAll();
        this._groupID = g;
        this.getGroupSchedule();
    }

    get studentID () {
        return this._studentID;
    }
    @Input() set studentID(s) {
        if (!s) return;
        this.clearAll();
        this._studentID = s;
        this.getStudentSchedule();
    }

    get officialStudentID() {
        return this._officialStudentID;
    }
    @Input() set officialStudentID(id) {
        if (!id) return;
        this.clearAll();
        this._officialStudentID = id;
        this.getOfficialStudentSchedule();
    }

    get departmentID () {
        return this._departmentID;
    }
    @Input() set departmentID(g) {
        if (!g) return;
        this.clearAll();
        this._departmentID = g;
        this.getDepartmentSchedule();
    }

    get classroomID () {
        return this._classroomID;
    }
    @Input() set classroomID(g) {
        if (!g) return;
        this.clearAll();
        this._classroomID = g;
        this.getClassroomSchedule();
    }

     get assistantID () {
        return this._assistantID;
    }
    @Input() set assistantID(a) {
        if (!a) return;
        this.clearAll();
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
