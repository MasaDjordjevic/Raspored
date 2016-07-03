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
import {R_MULTIPLE_SELECTOR} from "../ui/multiple-selector.component";
import {R_INPUT} from "../ui/r-input-text.component";


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
    directives: [TimetableColumnComponent, R_BUTTON, R_DIALOG, R_MULTIPLE_SELECTOR, R_INPUT],
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
            debugger;
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
            .subscribe(item => {
                this.studentID = <any>(new Number(this.studentID));
            });

        this._globalService.refreshStudentPanelOfficial$
            .subscribe(item => {
                this.officialStudentID = <any>(new Number(this.officialStudentID));
            })
    }

    getStudentSchedule(){
        this._studentsService.getPersonalSchedule(this.studentID, this.weeksFromNow)
            .then(
                sch => this.classes = sch,
                error => this.errorMessage = error
            ).then(() => this.pom());
    }

    getOfficialStudentSchedule() {
        this._studentsService.getOfficialSchedule(this.officialStudentID, this.weeksFromNow)
            .then(
                sch => this.classes = sch,
                error => this.errorMessage = error
            ).then(() => this.pom());
    }

    getGroupSchedule(){
        this._groupsService.getSchedule(this.groupID, this.weeksFromNow)
            .then(
                sch => this.classes = sch,
                error => this.errorMessage = error
            ).then(() => this.pom());
    }

    getDepartmentSchedule() {
        this._departmentsService.getSchedule(this.departmentID, this.weeksFromNow)
            .then(
                sch => this.classes = sch,
                error => this.errorMessage = error
            ).then(() => this.pom());
    }

    getClassroomSchedule() {
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
        //console.log(this.classes);
    }

    public _dayNames: string[] = [
        this._globalService.translate('monday'),
        this._globalService.translate('tuesday'),
        this._globalService.translate('wednesday'),
        this._globalService.translate('thursday'),
        this._globalService.translate('friday'),
        this._globalService.translate('saturday'),
        this._globalService.translate('sunday'),
    ];

    // U studetskom panelu se ce biti overridovano opcijama iz samog panela,
    // ovde mu postavljam getter samo da kod asistentskog panela ne bi puklo.
    // Zapravo moze uvek da bude ovako.
    @Input() public set dayNames(dayNames) {
        this._dayNames= dayNames;
    }

    public get dayNames() {
        if (this._dayNames && this._dayNames.length > 0) {
            return this._dayNames;
        } else {
            return [
                this._globalService.translate('monday'),
                this._globalService.translate('tuesday'),
                this._globalService.translate('wednesday'),
                this._globalService.translate('thursday'),
                this._globalService.translate('friday'),
                this._globalService.translate('saturday'),
                this._globalService.translate('sunday'),
            ]
        }
    }

    public get dayNamesAbbr(): string[] {
        // japanski uzima prvo slovo, ostali jeizici uzimaju prva tri slova
        let length = 3;
        if (this._globalService.currentLanguage == "ja") {
            length = 1;
        }
        return this.dayNames.map(dayName => dayName.substr(0, length));
    }

    displayDay: Array<boolean> = [true, true, true, true, true, true, false];

}
