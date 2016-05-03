// Angular2
import {Component, Input, Output} from "angular2/core";

// Services
import {DepartmentService} from "../../services/department.service";

// Models
import {Department} from "../../models/Department";
import {R_DIALOG} from "../../ui/r-dialog";
import {R_BUTTON} from "../../ui/r-button.component";
import {R_STEPPER} from "../../ui/r-stepper.component";


@Component({
    selector: 'r-department-options',
    template: `
    <div *ngIf="department">
        <h1>{{department.departmentName}}</h1>
        <dl>
            <dt>ID</dt>
            <dd>{{department.departmentID}}</dd>
            <dt>Ime</dt>
            <dd>{{department.departmentName}}</dd>
            <dt>Godina</dt>
            <dt>{{department.year}}</dt>
        </dl>
        <button r-button raised #testDialogSource
            [text]="'Nova raspodela'"
            (click)="testDialog.open()"></button>
        <r-dialog #testDialog [source]="testDialogSource">
            <r-stepper>
                <r-step [stepTitle]="'Prvi korak'">
                    <p>Ovo je prvi korak.</p>
                </r-step>
                <r-step [stepTitle]="'Drugi korak'">
                    <p>Ovo je drugi korak.</p>
                </r-step>
                <r-step [stepTitle]="'Treci korak'">
                    <p>Ovo je treci korak.</p>
                </r-step>
            </r-stepper>
        </r-dialog>
        <p>{{department | json}}</p>
    </div>
    <p>{{errorMessage}}</p>
    `,
    styleUrls: ['app/assistant-panel/options/assistant-panel-options.css'],
    providers: [DepartmentService],
    directives: [R_DIALOG, R_BUTTON, R_STEPPER],
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