// Angular2
import {Component, OnInit} from "angular2/core";
import {CORE_DIRECTIVES} from "angular2/src/common/directives/core_directives";

// Services
import {DepartmentService} from "../services/department.service";

// Models
import {Department} from "../models/Department";

@Component({
    selector: "r-admin-departments",
    templateUrl: "app/admin/admin.departments.component.html",
    providers: [DepartmentService],
    directives: CORE_DIRECTIVES
})
export class AdminDepartmentsComponent implements OnInit {
    data: Department[];
    errorMessage: string;
    newDepartment: {
        name: string,
        boolYears: Array<{ year: number, checked: boolean }>,
    };

    constructor(private _service: DepartmentService) {
        this.resetNewDepartment();
    }

    ngOnInit() {
        this.resetNewDepartment();
        this.getDepartments();
    }

    onDelete(departmentID: number) {
        this.deleteDepartment(departmentID);
    }

    resetNewDepartment() {
        this.newDepartment = {
            name: "",
            boolYears: [{ year: 1, checked: false }, { year: 2, checked: true }, { year: 3, checked: true }, { year: 4, checked: true }, { year: 5, checked: true }]
        }
    }

    getDepartments() {
        this._service.getDepartments()
            .then(
            deps => this.data = deps,
            error => this.errorMessage = <any>error); 
    }

    addDepartment() {

        // Display errors if wrong parameters.
        if (this.newDepartment.name == "") {
            alert("Department mora imati ime!");
            return;
        }
        var allFalse: boolean = false;
        for (let i = 0; i < this.newDepartment.boolYears.length; i++) {
            allFalse = allFalse || this.newDepartment.boolYears[i].checked;
        }
        if (!allFalse) {
            alert("Mora biti izabrana neka godina!");
            return;
        }

        // Creting an array of years based on boolean checkbox-values.
        var years: Array<number> = Array<number>(0);
        for (let i = 0; i < this.newDepartment.boolYears.length; i++) {
            if (this.newDepartment.boolYears[i].checked) years.push(i + 1);
        }

        // Call Service for each passed year.
        for (let i = 0; i < years.length; i++) {
            this._service.addDepartment(this.newDepartment.name, Number(years[i]))
            .then(
                dep => this.data.push(dep),
                error => this.errorMessage = <any>error
            );
        }

        this.resetNewDepartment();
    }

    deleteDepartment(departmentID: number) {
        this._service.deleteDepartment(departmentID)
            .then(
            dep => this.data = this.data.filter(obj => obj.departmentID !== dep.departmentID),
            error => this.errorMessage = <any>error
            );
    }
}