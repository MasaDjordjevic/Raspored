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
    template: `
    <div *ngIf="department" style="display: flex; flex-flow: column; height: 100%">

        <h1>{{department.departmentName}}</h1>
        <dl r-dl>
            <dt>ID</dt>
            <dd>{{department.departmentID}}</dd>
            <dt>Ime</dt>
            <dd>{{department.departmentName}}</dd>
            <dt>Godina</dt>
            <dd>{{department.year}}</dd>
        </dl>

        <div style="flex: 1 1 auto"></div>

        <r-dialog #newDivisionDialog [source]="newDivisionButton">
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

        <r-dialog #debuggingDialog [source]="debuggingButton">
            <pre style='padding: 3em; width: 60%; font-family: "Source Code Pro", Consolas, Consolas, "Liberation Mono", Menlo, Courier, monospace '>{{department | json | trim}}</pre>
        </r-dialog>

        <div class="footer-buttons" style="display: flex">

            <button r-button flat #debuggingButton
                text="JSON" (click)="debuggingDialog.open()">
            </button>

            <div style="flex: 1 1 auto"></div>

            <button r-button raised #newDivisionButton
                [text]="'Nova raspodela'"
                (click)="newDivisionDialog.open()">
            </button>
        </div>
    </div>
    <p>{{errorMessage}}</p>
    `,
    styleUrls: ['app/assistant-panel/options/assistant-panel-options.css'],
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