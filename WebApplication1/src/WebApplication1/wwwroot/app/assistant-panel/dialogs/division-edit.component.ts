import {Component, Input, AfterViewInit} from 'angular2/core';
import {DivisionsService} from "../../services/divisions.service";
import {Division} from "../../models/Division";
import {R_INPUT} from "../../ui/r-input-text.component";
import {CORE_DIRECTIVES, Control} from "angular2/common";
import {CoursesService} from "../../services/courses.service";
import {DivisionType} from "../../models/DivisionType";
import {Course} from "../../models/Course";
import {StudentsService} from "../../services/students.service";


@Component({
    selector: 'division-edit', 
    templateUrl: 'app/assistant-panel/dialogs/division-edit.component.html',
    providers: [DivisionsService, CoursesService, StudentsService],
    directives: [CORE_DIRECTIVES, R_INPUT],
})
//komponenta se koristi i u slucaju kada se kopira raspodela, u tom slucaju se samo ne salje ID, tj. division.divisionID je null (unknown ili tako nesto)
export class DivisionEditComponent implements AfterViewInit{
    @Input() division: any;
    oldDivision: any;

    courses: Course[];
    divisionTypes: DivisionType;
    studentsOfCourse: any[];

    // za r-input koji se treutno ne koristi
    control: Control;
    controlValue$: any;

    warningMessage: string = "";
    errorMessage: string = "";
    successMessage: string = "";
    _hasUnsavedChanges: boolean = false;


    constructor(
        private _coursesService: CoursesService,
        private _divisionsService: DivisionsService,
        private _studentsService: StudentsService
    ) {
        //this.control = new Control();
        //this.controlValue$ = this.control.valueChanges;
    }    
  

    onChangeAnything() {
        this._hasUnsavedChanges = true;
    }

    //TODO refaktorisajne:
    //sve ovo sam iskopirala iz division-creator-component

    ngAfterViewInit() {
        this.oldDivision = this.division;
        this.getCoursesOfDepartment();
        this.getAllDivisionTypes();
        console.log(this.divisionTypes);
    }

    getCoursesOfDepartment() {
        this._coursesService.getCoursesOfDepartment(this.division.departmentID) //izmenila sam ovaj parametar
            .then(
                crs => this.courses = crs,
                error => this.errorMessage = <any>error).then(() => this.getStudents());
    }

    // Iz look-up tabele
    public getAllDivisionTypes() {
        this._divisionsService.getAllDivisionTypes()
            .then(type => this.divisionTypes = type, error => this.errorMessage = <any>error);
    }

    getStudents(){        
        if(this.division.courseID == null)
            return;

        this._studentsService.getStudentsOfCourse(this.division.courseID)
            .then(
                studs => this.studentsOfCourse = studs,
                error => this.errorMessage = error);
    }

}
