// Angular2
import {Component} from "angular2/core";
import {Router, RouteDefinition, RouteConfig, ROUTER_DIRECTIVES} from "angular2/router";
import {Location} from "angular2/platform/common";

// Services
import {DepartmentService} from "../services/department.service";

// Models
import {Department} from "../models/Department";

@Component({
    selector: 'r-department-options',
    template: `
    <div class="title">
        <span class="selector">smer</span>
        <span class="dep-name">{{department.departmentName}}</span>
        <span class="dep-id">({{department.departmentID}})</span>
        <span class="year">{{department.year}}</span>
    </div>
    <dl>
        <dt>Broj studenata: </dt>           <dd>120</dd>
        <dt>Lista predmeta: </dt>           <dd></dd>
    </dl>
    `,
    styleUrls: ['app/assistant-panel/assistant-panel-options.css'],
})
export class DepartmentOptionsComponent {

    department: Department;

    constructor(
        //TODO nekako ugrabi id iz url-a
    ) {
        this.getDepartment(1);
    }

    getDepartment(id: number): void {
        //TODO povezi sa servisom
        if (!this.department) this.department = new Department();
        this.department.departmentID = id;
        this.department.departmentName = "Mile voli Disko";
        this.department.year = 2;
    }



}