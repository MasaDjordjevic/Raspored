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
import {R_BUTTON} from "../ui/r-button.component";
import {R_DIALOG} from "../ui/r-dialog";
import {
    GlobalService
} from "../services/global.service";
import {ToastComponent} from "../global/toast.component";
import {AddAnnouncementComponent} from "./dialogs/add-announcement.component";

@Component({
    selector: "r-assistant-panel",
    directives: [
        AssistantPanelOptionsComponent,
        DepartmentsListComponent, DepartmentOptionsComponent,
        DivisionsListComponent, DivisionOptionsComponent,
        GroupsListComponent, GroupOptionsComponent,
        StudentsListComponent, StudentOptionsComponent,
        R_BUTTON, R_DIALOG, AssistantEditComponent,
        ToastComponent, AddAnnouncementComponent
    ],
    templateUrl: 'app/assistant-panel/assistant-panel.html',
    styleUrls: ['app/assistant-panel/assistant-panel.css'],
    providers: [GlobalService]
})

export class AssistantPanelComponent {

    public get departmentPrimaryColor(): string {
        return this.currentTheme.departmentPrimaryColor;
    }

    public get divisionPrimaryColor(): string {
        return this.currentTheme.divisionPrimaryColor;
    }

    public get groupPrimaryColor(): string {
        return this.currentTheme.groupPrimaryColor;
    }

    public get studentPrimaryColor(): string {
        return this.currentTheme.studentPrimaryColor;
    }

    // TODO
    private assistant = {
        "uniMemberID": 1,
        "address": "331",
        "avatar": null,
        "email": "wlada@elfak.ni.ac.rs",
        "name": "Vlada",
        "password": "wlada",
        "studentID": null,
        "surname": "Mihajlović",
        "username": "wlada",
        "Activities": [],
        "AssistantsCourses": [],
        "Divisions": [],
        "GroupsAssistants": [],
        "UniMembersRoles": [],
        "student": null,
    };

    private _selectedDepartmentId = -1;
    private _selectedDivisionId = -1;
    private _selectedGroupId = -1;
    private _selectedStudentId = -1;

    errorMessage: string;

    constructor(
        public _globalService: GlobalService
    ) {
        //region Themes
        this._themes = [];
        this._themes["material"] = {
            departmentPrimaryColor: "MaterialOrange", // #FFC107
            divisionPrimaryColor: "MaterialBlue", // #03A9F4
            groupPrimaryColor: "MaterialRed", // #f44336
            studentPrimaryColor: "MaterialGreen", // #4CAF50
        };
        this._themes["sunset"] = {
            departmentPrimaryColor: "_Sunset-Purple", // #811d5e
            divisionPrimaryColor: "_Sunset-Red", // #fd2f24
            groupPrimaryColor: "_Sunset-Orange", // #ff6f01
            studentPrimaryColor: "_Sunset-Yellow", // #fed800
        };
        this._themes["ice"] = {
            departmentPrimaryColor: "_Ice-Darkest", // #012e40
            divisionPrimaryColor: "_Ice-Darker", // #025e73
            groupPrimaryColor: "_Ice-Melted", // #037f8c
            studentPrimaryColor: "_Ice-Green", // #038c8c
        };
        this._themes["neon"] = {
            departmentPrimaryColor: "_Neon-Empty", // #0E0B16
            divisionPrimaryColor: "_Neon-Diamond", // #A239CA
            groupPrimaryColor: "_Neon-Gemstone", // #4717F6
            studentPrimaryColor: "_Neon-Poison", // #18DD00
        };
        this.theme = "material";
        //endregion
        
        //region Service subscriptions
        this._globalService
            .refreshAssistantPanelAll$
            .subscribe(item => this.refresh(null));
        
        this._globalService
            .refreshAssistantPanelMoveMinusOne$
            .subscribe(item => this.refresh({shiftMinusOne: true}));
        //endregion
        
    }

    // Osvezava referencu da bi se prosledili ID-jevi kroz inpute (i da se opet pozove AJAX)
    public refresh($options) {
        // Ako uopste nisu prosledjene opcije, samo uradi refresh
        if (!$options) {
            this._selectedStudentId = <any>(new Number(this._selectedStudentId));
            this._selectedGroupId = <any>(new Number(this._selectedGroupId));
            this._selectedDivisionId = <any>(new Number(this._selectedDivisionId));
            this._selectedDepartmentId = <any>(new Number(this._selectedDepartmentId));
            // this._selectedStudentId = +(this._selectedStudentId + ""); // TODO ovako
        } else {
            // Inace, u zavisnosti od prosledjene opcije uradi odgovarajuce manipulacije
            if ( $options.shiftMinusOne) {
                this._selectedDepartmentId = this._selectedDivisionId === -1 ? -1 : <any>(new Number(this._selectedDepartmentId));
                this._selectedDivisionId = this._selectedGroupId === -1 ? -1 : <any>(new Number(this._selectedDivisionId));
                this._selectedGroupId = this._selectedStudentId === -1 ? -1 : <any>(new Number(this._selectedGroupId));
                this._selectedStudentId = -1;
            } else if ($options.allMinusOne) {
                this._selectedStudentId = -1;
                this._selectedGroupId = -1;
                this._selectedDivisionId = -1;
                this._selectedDepartmentId = -1;
            }
        }

    }

    //region Language stuff
    private lang = this._globalService.currentLanguage;

    private _language: string;

    public get language() {
        return this._language;
    }

    private dayNames: string[] = [];

    public setDayNames() {
        this.dayNames = [
            this._globalService.translate('monday'),
            this._globalService.translate('tuesday'),
            this._globalService.translate('wednesday'),
            this._globalService.translate('thursday'),
            this._globalService.translate('friday'),
            this._globalService.translate('saturday'),
            this._globalService.translate('sunday'),
        ];
    }

    public set language(lan) {
        this._language = lan;
        this._globalService.currentLanguage = lan;
        this.setDayNames();
    }
    //endregion

    public theme: string = "material";

    private _themes;

    public get currentTheme() {
        if (this._themes[this.theme]) {
            return this._themes[this.theme];
        } else {
            return this._themes["material"];
        }
    }
    
    private themePickerOpened = false;
    private languagePickerOpened = false;

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



}