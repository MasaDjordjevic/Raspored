import {Component, Input} from "angular2/core";
import {StudentsService} from "../../services/students.service";
import {Student} from "../../models/Student";


@Component({
    selector: 'r-student-options',
    template: `
    <div *ngIf="student">
        {{student | json}}
    </div>
    {{errorMessage}}
    `,
    styleUrls: ['app/assistant-panel/options/assistant-panel-options.css'],
    providers: [StudentsService]
})

export class StudentOptionsComponent {

    student: Student;
    errorMessage: string;

    private _studentId: number = 0;

    @Input() set studentId(n: number) {
        this._studentId = n;
        this.getStudent();
    }

    get studentId() {
        return this._studentId;
    }

    constructor(private _service: StudentsService) { }

    getStudent(): void {
        this._service.getStudent(this.studentId).then(
            student => this.student = student,
            error => this.errorMessage = <any>error
        );
    }

}