// Angular2
import {Component, OnInit, Input, Output, EventEmitter} from "angular2/core";

// Components
import {StudentOptionsComponent} from "./../options/student-options.component";
import {GroupOptionsComponent} from "./../options/group-options.component";

// Models
import {Student} from '../../models/Student';

// Servives
import {StudentsService} from '../../services/students.service'

// UI
import {RList} from '../../ui/r-list';


@Component({
    selector: 'r-students-list',
    template: `
    <r-list [titleString]="titleString"
            [data]="listData"
            (selectItem)="onSelect($event)">
    </r-list>
    `,
    styleUrls: ['app/assistant-panel/list/assistant-panel-list.css'],
    directives: [RList],
    providers: [StudentsService],
})

export class StudentsListComponent implements OnInit {

    students: Student[];
    errorMessage: string;
    selectedStudentID: number;
    titleString: string = "Students";

    private _selectedGroupId: number;

    _listData = null;

    @Input() set selectedGroupId(n: number) {
        this._selectedGroupId = n;
        this.getStudents();
    }

    get selectedGroupId() {
        return this._selectedGroupId;
    }

    @Output() selectStudent: EventEmitter<any> = new EventEmitter();

    constructor(
        private _studentsService: StudentsService
    ) { }

    ngOnInit() {
        this.getStudents();
    }

    get listData() {
        if (!this.students) return;
        if (!this._listData)
            this._listData = [];
        this._listData = this._listData.slice(0, this.students.length);
        for (let i = 0; i < this.students.length; i++) {
            this._listData[i] = {
                s: this.students[i].name + " " + this.students[i].surname,
                id: this.students[i].studentID
            };
        }
        return this._listData;
    }

    set listData(data) {
        this._listData = data;
    }

    getStudents() {
        this._studentsService.getStudents(this.selectedGroupId)
            .then(
            studs => this.students = studs,
            error => this.errorMessage = <any>error);
    }

    onSelect(studentID: number) {
        this.selectedStudentID = studentID;
        this.selectStudent.emit(this.selectedStudentID);
    }

    onDeselect() {
        this.selectedStudentID = -1;
        this.selectStudent.emit(this.selectedStudentID);
    }

}
