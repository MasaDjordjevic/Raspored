// Angular2
import {Component, Input, Output} from "angular2/core";

// Services
import {DepartmentService} from "../../services/department.service";

// Models
import {Department} from "../../models/Department";
import {R_DIALOG} from "../../ui/r-dialog";
import {R_BUTTON} from "../../ui/r-button.component";
import {R_STEPPER} from "../../ui/r-stepper.component";
import {R_DL} from "../../ui/r-dl";

// Pipes
import {TrimPipe} from "../../pipes/trim.pipe";



@Component({
    selector: 'r-department-options',
    templateUrl: ['app/assistant-panel/options/department-options.html'],
    styleUrls: [
        'app/assistant-panel/options/assistant-panel-options.css',
        'app/assistant-panel/options/department-options.css'
    ],
    providers: [DepartmentService],
    directives: [R_DIALOG, R_BUTTON, R_STEPPER, R_DL],
    pipes: [TrimPipe]
})

export class DepartmentOptionsComponent {

    department: Department;
    errorMessage: string;

    private _departmentId: number = 0;

    @Input() set departmentId(n: number) {
        this._departmentId = n;
        this.getDepartment();
    }

    get departmentId() {
        return this._departmentId;
    }

    constructor(
        private _service: DepartmentService
    ) {  }

    getDepartment(): void {
        this._service.getDepartment(this.departmentId).then(
            department => this.department = department,
            error => this.errorMessage = <any>error
        );
    }

}