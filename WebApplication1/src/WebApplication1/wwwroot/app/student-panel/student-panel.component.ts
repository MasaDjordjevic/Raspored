import {Component, AfterContentInit, ElementRef} from "angular2/core";
import {StudentsService} from "../services/students.service";
import {GlobalService} from "../services/global.service";
import {TimetableComponent} from "../timetable/r-timetable.component";
import {PanelHeaderComponent} from "../panel-header/panel-header.component";
import {ToastComponent} from "../global/toast.component";


export enum TimetableType {
    Official, Personal, Global,
}


@Component({
    selector: 'r-student-panel',
    templateUrl: 'app/student-panel/student-panel.html',
    styleUrls: ['app/student-panel/student-panel.css', 'app/panel-header/panel-header.css'],
    providers: [StudentsService],
    directives: [TimetableComponent, PanelHeaderComponent, ToastComponent]
})

export class StudentPanelComponent implements AfterContentInit {

    student: any;
    public error: string = "";
    
    public _timetableType: TimetableType;
    public _TimetableType = TimetableType;

    public studentOfficialID: number;
    public studentID: number;
    public departmentID: number;

    clearAll() {
        this.studentOfficialID = this.studentID = this.departmentID = null;
    }
    
    public get timetableType() {
        return this._timetableType;
    }
    
    public set timetableType(ttt) {
        this._timetableType = ttt;
        this.clearAll();
        switch (ttt) {
            case TimetableType.Official:
                this.studentOfficialID = this.student.studentID;
                break;
            case TimetableType.Personal:
                this.studentID = this.student.studentID;
                break;
            case TimetableType.Global:
                this.departmentID = this.student.departmentID;
                break;
        }
    }

    constructor(
        private _studentsService: StudentsService,
        private _globalService: GlobalService,
        private _elementRef: ElementRef
    ) { }

    ngAfterContentInit() {
        this.getStudent();
    }

    getStudent() {
        this._studentsService.getStudent(3)
            .then(student => this.student = student, error => this.error = error)
            .then(() => this.timetableType = TimetableType.Official);
    }

}