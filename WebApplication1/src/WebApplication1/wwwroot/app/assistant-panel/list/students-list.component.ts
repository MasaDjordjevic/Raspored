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
import {R_NESTED_LIST} from "../../ui/r-nested-list";


@Component({
    selector: 'r-students-list',
    template: `
    <r-nested-list [title]="'Studenti'" [primaryColor]="primaryColor" [secondaryColor]="secondaryColor">
        <r-list-inner-item
            *ngFor="let student of students"
            [value]="student.studentID"
            (click)="onSelect(student.studentID)"
            [class.selected]="student.studentID === selectedStudentID"
            style="display: flex; justify-content: space-between;"
        >
            <pre>{{student.UniMembers.name + " " + student.UniMembers.surname}}</pre>
            <span>{{student.indexNumber}}</span>
        </r-list-inner-item>
    </r-nested-list>
    `,
    styleUrls: ['app/assistant-panel/list/assistant-panel-list.css'],
    directives: [RList, R_NESTED_LIST],
    providers: [StudentsService],
})

export class StudentsListComponent implements OnInit {

    @Input() primaryColor: string = "MaterialBlue";
    @Input() secondaryColor: string = "MaterialOrange";

    students: any[];
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
                s: this.students[i].UniMembers.name + " " + this.students[i].UniMembers.surname,
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
