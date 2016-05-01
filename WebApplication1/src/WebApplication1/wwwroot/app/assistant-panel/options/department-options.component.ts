// Angular2
import {Component, Input, Output} from "angular2/core";

// Services
import {DepartmentService} from "../../services/department.service";

// Models
import {Department} from "../../models/Department";


@Component({
    selector: 'r-department-options',
    template: `
    <div *ngIf="department">
        {{department | json}}
    </div>
    {{errorMessage}}
    `,
    styleUrls: ['app/assistant-panel/options/assistant-panel-options.css'],
    providers: [DepartmentService]
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