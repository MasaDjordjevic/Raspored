import {Component, Input, AfterViewInit} from 'angular2/core';
import {DivisionsService} from "../../services/divisions.service";
import {Division} from "../../models/Division";
import {R_INPUT} from "../../ui/r-input-text.component";
import {CORE_DIRECTIVES, Control} from "angular2/common";
import {CoursesService} from "../../services/courses.service";
import {DivisionType} from "../../models/DivisionType";
import {Course} from "../../models/Course";
import {StudentsService} from "../../services/students.service";
import {R_DROPDOWN} from "../../ui/r-dropdown";
import {R_BUTTON} from "../../ui/r-button.component";

import * as moment_ from "../../../js/moment.js";
import {
    GlobalService
} from "../../services/global.service";
const moment = moment_["default"];

@Component({
    selector: 'division-edit', 
    templateUrl: 'app/assistant-panel/dialogs/division-edit.component.html',
    styleUrls: ['app/assistant-panel/dialogs/division-edit.css'],
    providers: [DivisionsService, CoursesService, StudentsService],
    directives: [R_INPUT, R_DROPDOWN, R_BUTTON],
})

//komponenta se koristi i u slucaju kada se kopira raspodela, u tom slucaju se samo ne salje ID, tj. division.divisionID je null (unknown ili tako nesto)
export class DivisionEditComponent implements AfterViewInit {
    
    @Input() primaryColor: string = "MaterialRed";
    @Input() secondaryColor: string = "MaterialOrange";

    _division: any;
    @Input() new: boolean;
    oldDivision: any;

    public get division() { return this._division }

    @Input() public set division(d) {
        this._division = d;
        if (!d) {
            this.editedDivision = null;
        } else {
            this.cloneToEdit(d);
        }
    }

    private cloneToEdit(division) {
        this.editedDivision.name = division.name;
        this.editedDivision.beginning = moment(division.beginning).format("YYYY-MM-DD");
        this.editedDivision.ending = moment(division.ending).format("YYYY-MM-DD");
        this.editedDivision.divisionTypeID = division.divisionTypeID;
        this.editedDivision.courseID = division.courseID;
    }

    private reset = () => this.cloneToEdit(this.division);

    private editedDivision: any = {};

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
        private _studentsService: StudentsService,
        private _globalService: GlobalService
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
        //console.log(this.divisionTypes);
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
        if (this.division.courseID == null)
            return;

        this._studentsService.getStudentsOfCourse(this.division.courseID)
            .then(
                studs => this.studentsOfCourse = studs,
                error => this.errorMessage = error);
    }

    update() {
        //console.log(this.division.courseID);
        ///*debugger;*/
        if (this.new) {
            //this.division.divisionID = -1;
        }

        // TODO ovo je krajnje retardirano
        // vracamo edited stvari nazad u pocetni objekat da bismo mogli da posaljemo

        var sendId = this.division.divisionID;
        var sendName = this.editedDivision.name;
        var sendBeginning = this.editedDivision.beginning;
        var sendEnding = this.editedDivision.ending;
        var sendDivisionTypeID = this.editedDivision.divisionTypeID;
        var sendCourseID = this.editedDivision.courseID;

        console.log(sendId, sendName, sendBeginning, sendEnding, sendDivisionTypeID, sendCourseID);
        /*debugger;*/

        //TODO nesto pametnije sa odgovorom
        this._divisionsService.updateDivision(sendId, sendName, sendBeginning, sendEnding, sendDivisionTypeID, sendCourseID)
            .then(any => console.log(any))
            .then(() => this._globalService.refreshAssistantPanelAll());

    }

}
