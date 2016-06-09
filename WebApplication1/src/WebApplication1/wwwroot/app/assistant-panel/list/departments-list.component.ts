import {Component, OnInit, Input, Output, EventEmitter} from "angular2/core";
import {DivisionsListComponent} from "./divisions-list.component";
import {AssistantPanelOptionsComponent} from "./../options/assistant-panel-options.component";
import {YearDepartments} from "../../models/YearDepartments";
import {DepartmentService} from "../../services/department.service";
import {Department} from "../../models/Department";
import {NestedList} from "../../INestedList";
import {R_NESTED_LIST} from "../../ui/r-nested-list";
import {RomanNumeralsPipe} from "../../pipes/roman-numerals.pipe";


@Component({
    selector: 'r-departments-list',
    template: `
    <r-nested-list title="Smerovi" [primaryColor]="primaryColor" [secondaryColor]="secondaryColor">
        <r-nested-list-inner *ngFor="let yearDepartment of yearDepartments" [title]="'Godina '.concat(yearDepartment.year | roman)">
            <r-list-inner-item
                *ngFor="let department of yearDepartment.departments"
                [value]="department.departmentID"
                (click)="onSelect(department.departmentID)"
                [class.selected]="department.departmentID === selectedDepartmentID"
            >
                {{department.departmentName}}
            </r-list-inner-item>
        </r-nested-list-inner>
    </r-nested-list>
    `,
    styleUrls: ['app/assistant-panel/list/assistant-panel-list.css'],
    directives: [R_NESTED_LIST],
    providers: [DepartmentService],
    pipes: [RomanNumeralsPipe]
})

export class DepartmentsListComponent implements OnInit {

    @Input() primaryColor: string = "MaterialBlue";
    @Input() secondaryColor: string = "MaterialOrange";

    titleString: string = "Smerovi";
    private yearDepartments: YearDepartments[];
    selectedDepartmentID: number = -1;
    private errorMessage: string;

    // Nema @Input() jer se uvek prikazuju svi smerovi, ne zavisi ni od kakvog klika.
    @Output() selectDepartment: EventEmitter<any> = new EventEmitter();

    private _nestedListData = null;

    constructor(
        private _service: DepartmentService
    ) { }

    ngOnInit() {
        this.getDepartmentsByYear();
    }

    set nestedListData(data) {
        this._nestedListData = data;
    }

    getDepartmentsByYear() {
        this._service.getDepartmentsByYear()
            .then(
                deps => this.yearDepartments = deps,
                error => this.errorMessage = <any>error);
    }

    onSelect($event) {
        this.selectedDepartmentID = $event;
        this.selectDepartment.emit(this.selectedDepartmentID);
    }

    onDeselect() {
        this.selectedDepartmentID = -1;
        this.selectDepartment.emit(this.selectedDepartmentID);
    }

    isSelected(departmentID: number) {
        return departmentID === this.selectedDepartmentID;
    }

}