import {Component, AfterContentInit, ElementRef} from "angular2/core";
import {StudentsService} from "../services/students.service";
import {GlobalService} from "../services/global.service";
import {TimetableComponent} from "../timetable/r-timetable.component";
import {PanelHeaderComponent} from "../panel-header/panel-header.component";
import {ToastComponent} from "../global/toast.component";
import {R_DIALOG} from "../ui/r-dialog";
import {AddAnnouncementComponent} from "../assistant-panel/dialogs/add-announcement.component";
import {LoginService} from "../services/login.service";
import {AddPersonalActivityComponent} from "./dialogs/add-activity.component";


export enum TimetableType {
    Official, Personal, Global,
}


@Component({
    selector: 'r-student-panel',
    templateUrl: 'app/student-panel/student-panel.html',
    styleUrls: ['app/student-panel/student-panel.css', 'app/panel-header/panel-header.css'],
    providers: [StudentsService, LoginService],
    directives: [TimetableComponent, PanelHeaderComponent, ToastComponent, R_DIALOG, AddPersonalActivityComponent]
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

    //region Language stuff
    private lang = this._globalService.currentLanguage;

    private _language: string;

    public get language() {
        return this._language;
    }

    private dayNames: string[] = [];

    public setDayNames() {
        this.dayNames = [
            this._globalService.translate('monday'),
            this._globalService.translate('tuesday'),
            this._globalService.translate('wednesday'),
            this._globalService.translate('thursday'),
            this._globalService.translate('friday'),
            this._globalService.translate('saturday'),
            this._globalService.translate('sunday'),
        ];
    }

    public set language(lan) {
        this._language = lan;
        this._globalService.currentLanguage = lan;
        this.setDayNames();
    }
    //endregion

    constructor(
        private _studentsService: StudentsService,
        private _globalService: GlobalService,
        private _elementRef: ElementRef,
        private _loginService: LoginService
    ) {
        this._loginService.isAllowedStudent();
        this.setDayNames();
    }

    ngAfterContentInit() {
        this.getStudent();
    }

    getStudent() {
        this._loginService.getUser()
            .then(student => {
                this.student = student, error => this.error = error
            })
            .then(() => this.timetableType = TimetableType.Official);
    }
    
    logout() {
        this._loginService.logout()
            .then(res=> {
                if(res.status == "uspelo") {
                    window.location = <Location>"/login";
                } else {
                    console.log(res);
                }
            })
    }

}