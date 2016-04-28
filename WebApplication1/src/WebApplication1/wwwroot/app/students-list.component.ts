import {Component, OnInit} from "angular2/core";
import {RouteParams, Router, RouteDefinition, RouteConfig, Location, ROUTER_DIRECTIVES} from "angular2/router";
import {GroupOptionsComponent} from "./group-options.component";
import {StudentOptionsComponent} from "./student-options.component";

import {Student} from './Student';
import {StudentsService} from './students.service'

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
    template: `
<h3>Students List</h3>
<div class="container">
    <div *ngIf="students != null">
        <div *ngFor="#st of students">
            <a (click)="onSelect(st.studentID)" [class.selected]="isSelected(st)">{{st.name}} {{st.surname}}</a>
            <label> {{st.indexNumber}} </label>       
        </div>
        <div>     
            <a (click)="onDeselect()">Back to Groups Options</a>
        </div>
    </div>  
    <router-outlet></router-outlet>
</div>
`,
    directives: [ROUTER_DIRECTIVES],
    styles: [` *{color: black; text-decoration: none;}
                .selected {color: #FF9D00;}
                .container {                        
                        display: flex;
                        flex-flow: row;
                        justify-content: flex-start;
    `],
    providers: [StudentsService],
})

export class StudentsListComponent implements OnInit {
    students: Student[];
    errorMessage: string;
    selectedGroupID: number;
    selectedStudentID: number;

    constructor(private routeParams: RouteParams, private _router: Router, private _studentsService: StudentsService) { }

    ngOnInit() {
        this.selectedGroupID = 2;
        //puca aplikacija kada dodam routParams
        this.selectedGroupID = +this.routeParams.get('id');
        this.getStudents();
    }

    getStudents() {
        this._studentsService.getGroups(this.selectedGroupID)
            .then(
            studs => this.students = studs,
            error => this.errorMessage = <any>error);
    }

    onSelect(studentID: number) {
        this.selectedStudentID = studentID;
        this._router.navigate(['Student', { id: studentID }]);
    }

    onDeselect() {
        this.selectedStudentID = -1;
        this._router.navigate(['GroupOptions']);
    }

    isSelected(student: Student) {
        return student.studentID === this.selectedStudentID;
    }

}
