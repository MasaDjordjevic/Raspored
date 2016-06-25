import {Component, AfterContentInit} from "angular2/core";
import {StudentsService} from "../services/students.service";
import {GlobalService} from "../services/global.service";
import {TimetableComponent} from "../timetable/r-timetable.component";
import {PanelHeaderComponent} from "../panel-header/panel-header.component";




@Component({
    selector: 'r-student-panel',
    templateUrl: 'app/student-panel/student-panel.html',
    styleUrls: ['app/student-panel/student-panel.css'],
    providers: [StudentsService, GlobalService],
    directives: [TimetableComponent, PanelHeaderComponent]
})

export class StudentPanelComponent implements AfterContentInit {

    student: any;
    public error: string = "";

    constructor(
        private _studentsService: StudentsService,
        private _globalService: GlobalService
    )
    {

    }

    ngAfterContentInit() {
        this.getStudent();
    }

    getStudent() {
        this._studentsService.getStudent(3)
            .then(student => this.student = student, error => this.error = error);
    }

}