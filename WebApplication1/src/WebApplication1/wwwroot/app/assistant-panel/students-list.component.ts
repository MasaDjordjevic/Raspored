// Angular2
import {Component, OnInit} from "angular2/core";
import {RouteParams, Router, RouteDefinition, RouteConfig, Location, ROUTER_DIRECTIVES} from "angular2/router";

// Components
import {StudentOptionsComponent} from "./student-options.component";
import {GroupOptionsComponent} from "./group-options.component";

// Models
import {Student} from '../models/Student';

// Servives
import {StudentsService} from '../services/students.service'

// UI
import {RList} from '../ui/r-list';


@RouteConfig([
    {
        path: '/',
        component: GroupOptionsComponent,
        name: 'GroupOptions',
        useAsDefault: true,
    },
    {
        path: '/student/:id',
        component: StudentOptionsComponent,
        name: 'Student',
    }
])

@Component({
    selector: 'r-students-list',
    template: `
    <r-list [titleString]="titleString"
            [data]="listData"
            (selectItem)="onSelect($event)">
    </r-list>
    <router-outlet></router-outlet>
`,
    directives: [ROUTER_DIRECTIVES, RList],
    styleUrls: ['app/assistant-panel/students-list.css'],
    providers: [StudentsService],
})

export class StudentsListComponent implements OnInit {
    students: Student[];
    errorMessage: string;
    selectedGroupID: number;
    selectedStudentID: number;
    titleString: string = "Students";

    _listData = null;

    constructor(
        private routeParams: RouteParams,
        private _router: Router,
        private _studentsService: StudentsService
    ) { }

    ngOnInit() {
        this.selectedGroupID = 2;
        //TODO puca aplikacija kada dodam routParams
        this.selectedGroupID = +this.routeParams.get('id');
        this.getStudents();
    }

    get listData() {
        if (!this.students) return;
        if (!this._listData) this._listData = [];
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
        this._studentsService.getGroups(this.selectedGroupID)
            .then(
            studs => this.students = studs,
            error => this.errorMessage = <any>error);
    }

    onSelect(studentID: number) {
        console.log("Student ID " + studentID);
        this.selectedStudentID = studentID;
        this._router.navigate(['Student', { id: studentID }]);
    }

    onDeselect() {
        this.selectedStudentID = -1;
        this._router.navigate(['GroupOptions']);
    }

}
