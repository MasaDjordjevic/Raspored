import {Component, OnInit, Input, Output, EventEmitter} from "angular2/core";
import {DivisionsListComponent} from "./divisions-list.component";
import {AssistantPanelOptionsComponent} from "./../options/assistant-panel-options.component";
import {YearDepartments} from "../../models/YearDepartments";
import {DepartmentService} from "../../services/department.service";
import {Department} from "../../models/Department";
import {NestedList} from "../../INestedList";
import {RNestedList} from "../../ui/r-nested-list";


@Component({
    selector: 'r-departments-list',
    template: `
    <r-nested-list
        [titleString]="titleString"
        [data]="nestedListData"
        (selectItem)="onSelect($event)">
    </r-nested-list>
    `,
    styleUrls: ['app/assistant-panel/list/assistant-panel-list.css'],
    directives: [RNestedList],
    providers: [DepartmentService]
})

export class DepartmentsListComponent implements OnInit {

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

    get nestedListData() {
        if (!this.yearDepartments) return;
        if (!this._nestedListData) this._nestedListData = new Array<NestedList>();
        for (let i = 0; i < this.yearDepartments.length; i++) {
            if (!this._nestedListData[i]) this._nestedListData[i] = new NestedList;
            this._nestedListData[i].outer = {
                s: this.yearDepartments[i].year + " godina",
                id: this.yearDepartments[i].year
            };
            if (!this._nestedListData[i].inner) this._nestedListData[i].inner = [];
            for (let j = 0; j < this.yearDepartments[i].departments.length; j++) {
                this._nestedListData[i].inner[j] = {
                    s: this.yearDepartments[i].departments[j].departmentName,
                    id: this.yearDepartments[i].departments[j].departmentID
                };
            }
        }
        return this._nestedListData;
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