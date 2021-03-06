﻿// Angular 2
import {Component, OnInit} from "angular2/core";
import {CORE_DIRECTIVES} from "angular2/src/common/directives/core_directives";

// Services
import {CoursesService} from '../services/courses.service';
import {DepartmentService} from '../services/department.service';

// Models
import {Course} from '../models/Course';
import {Department} from '../models/Department';
import {YearDepartments} from '../models/YearDepartments';


@Component({
    selector: "r-admin-courses",
    templateUrl: "app/admin/admin.courses.component.html",
    providers: [CoursesService, DepartmentService],
    directives: CORE_DIRECTIVES
})

export class AdminCoursesComponent implements OnInit {
    courses: Course[] = [];
    newCourse: Course;
    allDepartments: Department[];  //ne koristi se

    errorMessage: string;

    yearDepartments:YearDepartments[];
    depsOfSelected: Department[];
    selectedDepartmentID: number;

    constructor(private _coursesService: CoursesService, private _departmentsService: DepartmentService) { }

    ngOnInit() {
        //this.getDepartments();
        this.resetNewCourse();
        this.getDepartmentsByYear();
    }

    getDepartmentsFront(index:number) {
        this.depsOfSelected = this.yearDepartments[index].departments;
        this.selectDepartment(this.depsOfSelected[0].departmentID);
    }

    getCoursesOfDepartment(departmentID: number) {
        this._coursesService.getCoursesOfDepartment(departmentID)
            .then(
                courses => this.courses = courses, 
                error => this.errorMessage = <any>error);
    }

    selectDepartment(id: number) {
        this.selectedDepartmentID = id;
        this.getCoursesOfDepartment(id);
    }

    addCourse() {
        // Display errors if wrong parameters.
        if (this.newCourse.name == "") {
            alert("Department mora imati ime!");
            return;
        }

        this._coursesService.addCourse(this.newCourse.code, this.newCourse.alias, this.newCourse.name, this.selectedDepartmentID, this.newCourse.semester)
            .then(
                course => this.courses.push(course),
                error => this.errorMessage = <any>error)
            .then(
                a => this.resetNewCourse());
    }

    onDelete(courseID: number) {
        this.deleteCourse(courseID);
    }

    deleteCourse(courseID: number) {
        this._coursesService.deleteCourse(courseID)
            .then(
            course => this.courses = this.courses.filter(obj => obj.courseID !== course.courseID),
            error => this.errorMessage = <any>error
            );
    }


    getDepartments() {
        this._departmentsService.getDepartments()
            .then(
                deps => this.allDepartments = deps,
                error => this.errorMessage = <any>error);

    }

    getDepartmentsByYear() {
        this._departmentsService.getDepartmentsByYear()
            .then(
            deps => this.yearDepartments = deps,
                error => this.errorMessage = <any>error);
    }

    resetNewCourse() {
        this.newCourse = new Course();
    }
}