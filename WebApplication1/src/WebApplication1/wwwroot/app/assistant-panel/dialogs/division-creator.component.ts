import {Component, OnInit, Input, AfterViewInit, Output, EventEmitter} from "angular2/core";
import {R_STEPPER} from "../../ui/r-stepper.component";
import {R_BUTTON} from "../../ui/r-button.component";
import {R_INPUT} from "../../ui/r-input-text.component";
import {R_DROPDOWN} from "../../ui/r-dropdown";
import {Control} from "angular2/common";
import {Course} from "../../models/Course";
import {CoursesService} from "../../services/courses.service";
import {DivisionsService} from "../../services/divisions.service";
import {Group} from "../../models/Group";
import {Student} from "../../models/Student";
import {TypeDivisions} from "../../models/TypeDivisions";
import {DivisionType} from "../../models/DivisionType";
import {R_DL} from "../../ui/r-dl";
import {GlobalService} from "../../services/global.service";



@Component({
    selector: 'r-division-creator',
    templateUrl: 'app/assistant-panel/dialogs/division-creator.html',
    styleUrls: ['app/assistant-panel/dialogs/division-creator.css'],
    directives: [R_STEPPER, R_INPUT, R_DROPDOWN, R_BUTTON, R_DL],
    providers: [CoursesService, DivisionsService]
})

export class DivisionCreatorComponent implements AfterViewInit {

    @Input() primaryColor: string = "MaterialRed";
    @Input() secondaryColor: string = "MaterialOrange";

    @Output() close: EventEmitter<any> = new EventEmitter<any>();
    public closeMe() {
        this.close.emit({});
    }

    //region Podaci o novoj raspodeli koja se kreira
    public newDivisionName: string;
    public newDivisionClassId: string;
    public newDivisionClassName = (id = this.newDivisionClassId) =>
        this.courses.filter(i => i.courseID === +id)[0].name;
    public newDivisionBeginningDate: string;
    public newDivisionBeginningDateToDate = () => new Date(this.newDivisionBeginningDate);
    public newDivisionEndingDate: string;
    public newDivisionEndingDateToDate = () => new Date(this.newDivisionEndingDate);
    public newDivisionTypeId: string;
    public newDivisionTypeName = (id = this.newDivisionTypeId) =>
        (<any>this.divisionTypes).filter(i => i.divisionTypeID == id)[0].type;

    public newDivisionCreationWay: 'on_x' | 'with_x' | 'manual';
    public newDivisionCreationNumberX: string;
    public newDivisionCreationOrderIsRandom: '0' | '1';
    public newDivisionCreationOrderName = (i = this.newDivisionCreationOrderIsRandom) =>
        i === '0' ? this._globalService.translate("by_index_number") : this._globalService.translate("random");
    //endregion

    //region Validacije, read-only
    public get $$newDivisionName(): boolean {
        var ret: boolean = !!this.newDivisionName; // da ne bude null
        ret = ret && !!this.newDivisionName.trim().match(/.+/); // da ima bar jedno... nesto
        // stavio bih ja \w da bude alfanumericki znak ali onda ne gadja šđčćž, sto i nije problem jer sumnjam
        // da bi se raspodela (division) zvala iskljucivo od slova sa kvacicama, ali ajde neka ga ovako. ovako
        // moze da se zove sa tackom. moze i da bude srculence. mora probamo.
        return ret;
    }
    public get $$newDivisionClassId(): boolean {
        return true;
    }
    public get $$newDivisionTypeId(): boolean {
        return true;
    }
    public get $$newDivisionBeginningDate(): boolean {
        var ret: boolean = !!this.newDivisionBeginningDate;
        // godina mora 4, ostalo 1 ili 2. dozvoljava -, . ili / kao odvajanje izmedju brojki
        ret = ret && !!this.newDivisionBeginningDate.match(/\d{4}[-/\.]\d{1,2}[-/\.]\d{1,2}/);
        // mora da bude validan datum, da ne bude trinesti mesc ili 30. febuar
        ret = ret && new Date(this.newDivisionBeginningDate).toString() !== "Invalid Date";
        return !!ret;
    }
    public get $$newDivisionEndingDate(): boolean {
        var ret: boolean = !!this.newDivisionEndingDate;
        // godina mora 4, ostalo 1 ili 2. dozvoljava -, . ili / kao odvajanje izmedju brojki
        ret = ret && !!this.newDivisionEndingDate.match(/\d{4}[-/\.]\d{1,2}[-/\.]\d{1,2}/);
        // mora da bude validan datum, da ne bude trinesti mesc ili 30. febuar
        ret = ret && new Date(this.newDivisionEndingDate).toString() !== "Invalid Date";
        return !!ret;
    }

    public get $$newDivisionCreationWay(): boolean {
        return this.newDivisionCreationWay != "";
    }
    public get $$newDivisionCreationNumberX(): boolean {
        var ret: boolean = !!this.newDivisionCreationNumberX;
        ret = ret && !!this.newDivisionCreationNumberX.match(/^\d+$/); // integer
        return ret;
    }
    public get $$newDivisionCreationOrderIsRandom(): boolean {
        return this.newDivisionCreationOrderIsRandom != "";
    }

    // 0 se misli da je sve validno, zajedno
    // 1 - n su koraci od 1 do n
    // sve ostalo vraca false
    public isValid(i: number = 0) {

        switch(i) {
            case 1:
                return !!(this.$$newDivisionName && this.$$newDivisionClassId && this.$$newDivisionTypeId && this.$$newDivisionBeginningDate && this.$$newDivisionEndingDate);

            case 2:
                return !!(this.$$newDivisionCreationWay && this.$$newDivisionCreationNumberX && this.$$newDivisionCreationOrderIsRandom &&
                (!!this.createdGroups || this.newDivisionCreationWay == 'manual'));

            case 3:
                return true; // nista se ne menja, samo pregled

            default:
                return false;

        }

    }
    //endregion

    courses: Course[];
    errorMessage: string;

    createdGroups: Array<Array<Student>>;
    divisionTypes: DivisionType;

    private _departmentID: number;

    @Input() set departmentID(departmentID: number) {
        this.resetAll();
        this._departmentID = departmentID;
        this.getCoursesOfDepartment();
    }

    get departmentID(): number {
        return this._departmentID;
    }
    
    constructor(
        private _coursesService: CoursesService,
        private _divisionsService: DivisionsService,
        private _globalService: GlobalService
    ) {
        this.resetAll();
    }

    private resetAll() {
        this.courses = null;
        this.createdGroups = null;
        this.errorMessage = null;
        this.newDivisionName = "";
        this.newDivisionClassId = null;
        this.newDivisionBeginningDate = "2016-05-04"; //TODO
        this.newDivisionEndingDate = "2020-04-20"; //TODO
        this.newDivisionTypeId = null;
        this.newDivisionCreationWay = null;
        this.newDivisionCreationNumberX = "12";
        this.newDivisionCreationOrderIsRandom = null;
    }

    ngAfterViewInit() {
        this.getCoursesOfDepartment();
        this.getAllDivisionTypes();
        console.log(this.divisionTypes);
    }

    getCoursesOfDepartment() {
        this._coursesService.getCoursesOfDepartment(this.departmentID)
            .then(
                crs => this.courses = crs,
                error => this.errorMessage = <any>error);
    }

    /**
     * Vrati listu studenata po grupama za prikaz kako ce se grupe napraviti kada se klikne na Submit.
     * Dakle, ovo je za preview. Samo se čitaju studenti iz baze.
     *
     * @param courseId - ID kursa na osnovu kog treba uzeti studente.
     * @param creationWay - Način kreiranja raspodele.
     * @param numberX - Koliko grupa ili koliko studenata, u zavisnosti od creationWay.
     *                  Vrednost se ignorise ukoliko je creationWay postavljen na manual.
     * @param studentsOrder - 0 za redom i 1 za nasumice
     */
    getList(courseId: string, creationWay: string, numberX: string, studentsOrder: '0' | '1'): any {
        console.log("Parametri:", courseId, creationWay, numberX, studentsOrder);
        if (creationWay === "with_x") {
            this._divisionsService.getGroupsWithX(+courseId, +numberX, +studentsOrder)
                .then(groups => this.createdGroups = groups, error => this.errorMessage = <any>error);
        } else if (creationWay === "on_x") {
            this._divisionsService.getGroupsOnX(+courseId, +numberX, +studentsOrder)
                .then(groups => this.createdGroups = groups, error => this.errorMessage = <any>error);
        } else {
            this._globalService.toast(this._globalService.translate("selected_manual_no_list_to_display"));
        }
    }

    // Iz look-up tabele
    public getAllDivisionTypes() {
        this._divisionsService.getAllDivisionTypes()
            .then(type => this.divisionTypes = type, error => this.errorMessage = <any>error);
    }

    private getNamedGroups() {
        var ret: Array<any> = [];
        for (let i = 0; i < this.createdGroups.length; i++) {
            ret[i] = {
                name: this._globalService.translate("group") + " " + (i + 1),
                students: this.createdGroups[i]
            };
        }
        return ret;
    }

    createInitialDivision() {
        this._divisionsService.createInitialDivision(
            this.newDivisionName,
            this.departmentID,
            +this.newDivisionClassId,
            +this.newDivisionTypeId,
            this.newDivisionBeginningDateToDate(),
            this.newDivisionEndingDateToDate(),
            this.getNamedGroups()
        )
            .then(response => {
                switch(response.status) {
                    case "uspelo":
                        this._globalService.toast(
                            this._globalService.translate("successfully_created_division__1") +
                            "*" + this.newDivisionName + "*" +
                            this._globalService.translate("successfully_created_division__2"));
                        break;
                    default:
                        this._globalService.toast(this._globalService.translate("error") + " " +
                            this._globalService.translate("division_not_created"));
                        debugger;
                        break;
                }
            })
            .then(() => {
                this.closeMe();
                this._globalService.refreshAssistantPanelAll();
            });
    }

    public numberOfStudents = () => this.createdGroups.map(s => s.length).reduce((p, c) => p + c);
    public averageNumberOfStudents = () => this.numberOfStudents() / this.createdGroups.length;

    public groupPreview = (i, n) => (this.createdGroups[i].slice(0, n)
        .map(e => e.name + ' ' + e.surname + ' (' + e.indexNumber + ')').join(', ').concat('...'));

}
