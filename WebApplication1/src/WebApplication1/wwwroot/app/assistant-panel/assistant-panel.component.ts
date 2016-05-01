// Angular2
import {Component, OnInit, AfterViewInit, ChangeDetectorRef} from "angular2/core";
import {ROUTER_DIRECTIVES, Route, RouteConfig} from 'angular2/router';
import {Router, RouteParams} from 'angular2/router';

//Components
import {AssistantPanelOptionsComponent} from "./assistant-panel-options.component";
import {AssistantEditComponent} from "./assistant-edit.component";
import {DivisionsListComponent} from "./divisions-list.component";

// Services
import {DepartmentService} from "../services/department.service";

// Models
import {Department} from "../models/Department";
import {YearDepartments} from '../models/YearDepartments';
import {Assistant} from "../models/Assistant";

// R-UI
import {R_NESTED_LIST_DIRECTIVES} from "../ui/r-nested-list";

// Interfaces
import {INestedList, NestedList} from "../INestedList";


@RouteConfig([
    {
        path: '/',
        name: 'AssistantPanelOptions',
        component: AssistantPanelOptionsComponent,
        useAsDefault: true,
    },
    {
        path: '/department/:depid/...',
        name: 'DivisionList',
        component: DivisionsListComponent,
    }
])

@Component({
    selector: "r-assistant-panel",
    directives: [ROUTER_DIRECTIVES, R_NESTED_LIST_DIRECTIVES],
    templateUrl: 'app/assistant-panel/assistant-panel.html',
    styleUrls: ['app/assistant-panel/assistant-panel.css'],
    providers: [DepartmentService],
})

export class AssistantPanelComponent implements OnInit {
    titleString: string = "Smerovi";
    assistant: Assistant;
    yearDepartments: YearDepartments[];
    errorMessage: string;
    selectedDepartmentID: number;

    private _nestedListData = null;

    constructor(
        private _departmentsService: DepartmentService,
        private _router: Router,
        private _cdr: ChangeDetectorRef) { }

    ngOnInit() {
        this.getDepartmentsByYear();
    }

    ngAfterViewInit() {
       this._cdr.detectChanges();
    }

    get nestedListData() {
        if (!this.yearDepartments) return;
        if (!this._nestedListData) this._nestedListData = new Array<NestedList>();
        for (let i = 0; i < this.yearDepartments.length; i++) {
            if (!this._nestedListData[i]) this._nestedListData[i] = new NestedList;
            this._nestedListData[i].outer = {
                s: "" + this.yearDepartments[i].year + " godina",
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
        this._departmentsService.getDepartmentsByYear()
            .then(
            deps => this.yearDepartments = deps,
            error => this.errorMessage = <any>error);
    }

    onSelect($event) {
        this.selectedDepartmentID = $event;
        this._router.navigate(['DivisionList', { depid: this.selectedDepartmentID }]);
    }

    onDeselect() {
        this.selectedDepartmentID = -1;
        this._router.navigate(['AssistantPanelOptions']);
    }

    isSelected(departmentID: number) {
        return departmentID === this.selectedDepartmentID;
    }
}