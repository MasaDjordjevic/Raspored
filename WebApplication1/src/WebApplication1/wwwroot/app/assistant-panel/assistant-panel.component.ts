// Angular2
import {Component} from "angular2/core";

// Models
import {Department} from "../models/Department";
import {YearDepartments} from '../models/YearDepartments';
import {Assistant} from "../models/Assistant";

//Components
import {AssistantPanelOptionsComponent} from "./options/assistant-panel-options.component";
import {AssistantEditComponent} from "./dialogs/assistant-edit.component";
import {DivisionsListComponent} from "./list/divisions-list.component";
import {DepartmentsListComponent} from "./list/departments-list.component";
import {DepartmentOptionsComponent} from "./options/department-options.component";
import {DivisionOptionsComponent} from "./options/division-options.component";
import {GroupsListComponent} from "./list/groups-list.component";
import {GroupOptionsComponent} from "./options/group-options.component";
import {StudentsListComponent} from "./list/students-list.component";
import {StudentOptionsComponent} from "./options/student-options.component";

@Component({
    selector: "r-assistant-panel",
    directives: [
        AssistantPanelOptionsComponent,
        DepartmentsListComponent, DepartmentOptionsComponent,
        DivisionsListComponent, DivisionOptionsComponent,
        GroupsListComponent, GroupOptionsComponent,
        StudentsListComponent, StudentOptionsComponent
    ],
    templateUrl: 'app/assistant-panel/assistant-panel.html',
    styleUrls: ['app/assistant-panel/assistant-panel.css']
})

export class AssistantPanelComponent {

    public departmentPrimaryColor: string = "MaterialOrange";
    public divisionPrimaryColor: string = "MaterialBlue";
    public groupPrimaryColor: string = "MaterialRed";
    public studentPrimaryColor: string = "MaterialGreen";

    private _assistant: Assistant;
    private _selectedDepartmentId: number = -1;
    private _selectedDivisionId: number = -1;
    private _selectedGroupId: number = -1;
    private _selectedStudentId: number = -1;

    errorMessage: string;

    constructor( ) { }

    onDepartmentSelect($event) {
        this._selectedDepartmentId = $event;
        this._selectedDivisionId = -1;
        this._selectedGroupId = -1;
        this._selectedStudentId = -1;
    }

    onDivisionSelect($event) {
        this._selectedDivisionId = $event;
        this._selectedGroupId = -1;
        this._selectedStudentId = -1;
    }

    onGroupSelect($event) {
        this._selectedGroupId = $event;
        this._selectedStudentId = -1;
    }

    onStudentSelect($event) {
        this._selectedStudentId = $event;
    }

    get currentLevel() {
        // Jos nije izabran ni smer:
        if (this._selectedDepartmentId == -1) return 0;
        // Izabran je smer (department, prvi), a nije raspodela (division, drugi):
        if (this._selectedDivisionId == -1) return 1;
        if (this._selectedGroupId == -1) return 2;
        if (this._selectedStudentId == -1) return 3;
        // Sve je izabrano (stiglo se do studenta, i on je izabran):
        return 4;
    }
    get isAtRoot() { return this.currentLevel == 0; }
    get isAtDepartment() { return this.currentLevel == 1; }
    get isAtDivision() { return this.currentLevel == 2; }
    get isAtGroup() { return this.currentLevel == 3; }
    get isAtStudent() { return this.currentLevel == 4; }

    // Osvezava referencu da bi se prosledili ID-jevi kroz inpute (i da se opet pozove AJAX)
    public refresh($options) {

        console.log("primljen event");
        console.log($options);

        if ($options && $options.shiftMinusOne) {
            this._selectedDepartmentId = this._selectedDivisionId === -1 ? -1 : new Number(this._selectedDepartmentId);
            this._selectedDivisionId = this._selectedGroupId === -1 ? -1 : new Number(this._selectedDivisionId);
            this._selectedGroupId = this._selectedStudentId === -1 ? -1 : new Number(this._selectedGroupId);
            this._selectedStudentId = -1;
        } else {
            this._selectedStudentId = new Number(this._selectedStudentId);
            this._selectedGroupId = new Number(this._selectedGroupId);
            this._selectedDivisionId = new Number(this._selectedDivisionId);
            this._selectedDepartmentId = new Number(this._selectedDepartmentId);
        }

    }


}