import {Component, Input, Output} from "angular2/core";
import {DepartmentService} from "../../services/department.service";
import {Department} from "../../models/Department";
import {R_DIALOG} from "../../ui/r-dialog";
import {R_BUTTON} from "../../ui/r-button.component";
import {R_STEPPER} from "../../ui/r-stepper.component";
import {R_DL} from "../../ui/r-dl";
import {DivisionCreatorComponent} from "../dialogs/division-creator.component";
import {TrimPipe} from "../../pipes/trim.pipe";
import {Student} from "../../models/Student";
import {StudentsService} from "../../services/students.service";
import {StudentSearchComponent} from "../dialogs/student-search.component";
import {R_MULTIPLE_SELECTOR} from "../../ui/multiple-selector.component";



@Component({
    selector: 'r-department-options',
    templateUrl: 'app/assistant-panel/options/department-options.html',
    styleUrls: [
        'app/assistant-panel/options/assistant-panel-options.css',
        'app/assistant-panel/options/department-options.css',
    ],
    providers: [DepartmentService, StudentsService],
    directives: [R_DIALOG, R_BUTTON, R_STEPPER, R_DL, R_MULTIPLE_SELECTOR, DivisionCreatorComponent, StudentSearchComponent],
    pipes: [TrimPipe]
})

export class DepartmentOptionsComponent {

    @Input() primaryColor: string = "MaterialBlue";
    @Input() secondaryColor: string = "MaterialOrange";

    department: Department;
    errorMessage: string;

    // Studenti koji se prikazuju klikom na "STUDENTI"
    students: Student[];

    // Brojevi indeksa selektiranih studenata iz this.students
    selectedStudents: any[] = [];

    private _departmentId: number = 0;

    @Input() set departmentId(n: number) {
        this._departmentId = n;
        this.getDepartment();
        this.getStudents();
    }

    get departmentId() {
        return this._departmentId;
    }

    constructor(
        private _service: DepartmentService,
        private _studentService: StudentsService
    ) {  }

    getDepartment(): void {
        this._service.getDepartment(this.departmentId).then(
            department => this.department = department,
            error => this.errorMessage = <any>error
        );
    }

    getStudents(): void {
        this._studentService.getStudentsOfDepartment(this.departmentId).then(
            students => this.students = students,
            error => this.errorMessage = <any>error
        );
    }

}