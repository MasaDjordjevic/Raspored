import {Component, Input, AfterContentInit, Pipe, PipeTransform, ChangeDetectionStrategy, Output, EventEmitter} from "angular2/core";
import {Control} from "angular2/common";
import {Group} from "../../models/Group";
import {ClassroomsService} from "../../services/classrooms.service";
import {StudentsService} from "../../services/students.service";
import {GroupsService} from "../../services/groups.service";
import {AssistantService} from "../../services/assistant.service";
import {TimeSpan} from "../../models/TimeSpan";
import {R_DROPDOWN} from "../../ui/r-dropdown";
import {R_BUTTON} from "../../ui/r-button.component";
import {R_INPUT} from "../../ui/r-input-text.component";
import {R_MULTIPLE_SELECTOR} from "../../ui/multiple-selector.component";
import {R_STUDENT_SELECTOR} from "./students-selector.component";
import {GlobalService} from "../../services/global.service";
import {moment} from "../../global/moment.import";



@Pipe({
    name: 'withoutStudents',
    pure: false
})

class WithoutStudentsPipe implements PipeTransform {
    // students bez studenata iz groupStudents
    transform(students, groupStudents) {
        var ret = [];

        if (!students || !groupStudents) {
            return students;
        }

        outer:
        for (let i = 0; i < students.length; i++) {
            for (let j = 0; j < groupStudents.length; j++) {
                if (students[i].studentID == groupStudents[j].studentID)
                    continue outer;
            }
            ret.push(students[i]);
        }

        return ret;
    }
}



@Component({
    selector: 'group-edit',
    templateUrl: 'app/assistant-panel/dialogs/group-edit.html',
    styleUrls: ['app/assistant-panel/dialogs/group-edit.css'],
    providers: [ClassroomsService, StudentsService, AssistantService],
    pipes: [WithoutStudentsPipe],
    directives: [R_INPUT, R_DROPDOWN, R_BUTTON, R_MULTIPLE_SELECTOR, R_STUDENT_SELECTOR]
})

// Koristi se i za Editovanje postojece grupe i za kreiranje nove grupe.
export class GroupEditComponent {
    
    @Input() primaryColor: string = "MaterialBlue";
    @Input() secondaryColor: string = "MaterialOrange";

    private _group;

    get group() {
        return this._group;
    }

    @Input() set group(g) {
        this._group = g;
        console.log(g);
        this.editedGroupName = g.name;
        this.editedClassroom = g.classroomID;
        this.editedAssistant = g.assistant && g.assistant.uniMemberID;
        this.editedDateTimeStart = g.timeSpan && g.timeSpan.startDate;
        this.editedDateTimeEnd = g.timeSpan && g.timeSpan.endDate;
        this.editedPeriod = g.timeSpan && g.timeSpan.period;

        if(g.timeSpan != null) {
            this.editedDayOfWeek = moment(g.timeSpan.startDate).clone().day();
            this.editedTimeStart = moment(g.timeSpan.startDate).clone().format("HH:mm");
            this.editedTimeEnd = moment(g.timeSpan.endDate).clone().format("HH:mm");
        }

        this.afterGroupInit();
    }

    afterGroupInit() {
        this.getAllStudents();

        var ret = [];
        for (let i = 0; i < this.group.GroupsStudents.length; i++) {
            ret.push(this.group.GroupsStudents[i].student);
        }
        this.chosenStudents = ret;

        if(this.group.groupID) {
            this.getAssisatnts();
        }
    }

    @Output() close: EventEmitter<any> = new EventEmitter<any>();
    public closeMe() {
        this.close.emit({});
    }

    private classrooms;
    private assistants;
    private errorMessage;

    otherStudents;
    chosenStudents;

    // Todo probaj kroz bez ovoga
    selectedChosenStudents;
    selectedOtherStudents;

    constructor(
        private _service: ClassroomsService,
        private _groupsService: GroupsService,
        private _studentsService: StudentsService,
        private _assistantsService: AssistantService,
        private _globalService: GlobalService
    ) {
        this.getClassrooms();
    }

    editedAssistant: any;
    editedClassroom: any;
    editedGroupName: string;
    editedPeriod: any;
    editedDayOfWeek: any;
    editedTimeStart: any;
    editedTimeEnd: any;
    editedDateTimeStart: any;
    editedDateTimeEnd: any;

    getAssisatnts() {
        this._assistantsService.getAssistantsByGroupID(this.group.groupID).then(
            asst => this.assistants = asst,
            error => this.errorMessage = error
        );
    }
    getAllAssistants(){
        this._assistantsService.getAssistants().then(
            asst => this.concatAssistanst(asst),
            error => this.errorMessage = error
        );
    }

    concatAssistanst(asst) {
        this.assistants = this.assistants ? this.assistants.concat(asst) : asst;

        //brisanje duplikata
        this.assistants = this.uniq_fast(this.assistants)
    }

    uniq_fast(a) {
        var seen = {};
        var out = [];
        var len = a.length;
        var j = 0;
        for(var i = 0; i < len; i++) {
            var item = a[i];
            if(seen[item.uniMemberID] !== 1) {
                seen[item.uniMemberID] = 1;
                out[j++] = item;
            }
        }
        return out;
    }

    // prihvata niz studentID
    moveToOthers(arr) {
        if (!arr) return; // ako nista nije selektirano
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < this.chosenStudents.length; j++) {
                if (this.chosenStudents[j].studentID == arr[i]) {
                    this.chosenStudents.splice(j--, 1); // pomozi bog
                }
            }
        }
    }

    // prihvata niz studentID
    moveToChosen(arr) {
        if (!arr) return; // ako nista nije selektirano
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < this.otherStudents.length; j++) {
                if (this.otherStudents[j].studentID == arr[i]) {
                    this.chosenStudents.push(this.otherStudents[j]);
                }
            }
        }
    }
    
    save() {
        var pom: Array<number> = this.chosenStudents.map(i => i.studentID);
        var timespan: any = {};

        // ako nista nije odabrano
        if (this.editedPeriod == null) {
            timespan = null;
        } else {
            timespan.startDate = new Date(this.editedDateTimeStart);
            timespan.endDate = new Date(this.editedDateTimeEnd);
            timespan.period = +this.editedPeriod;
            timespan.dayOfWeek = this.editedDayOfWeek;
            timespan.timeStart = this.editedTimeStart;
            timespan.timeEnd = this.editedTimeEnd;
        }

        //console.log(timespan);
        this._groupsService.updateGroup(
            this.group.groupID, this.group.division.divisionID, this.editedAssistant,
            this.editedGroupName, this.editedClassroom, timespan,  pom
        )
            .then(response => {
                switch(response.status) {
                    case "uspelo":
                        this._globalService.toast(this._globalService.translate('successfully_edited_group__1') + 
                            '*' + this.editedGroupName + '*'
                            + this._globalService.translate('successfully_edited_group__2'));
                        break;
                    default:
                        this._globalService.toast(this._globalService.translate('error') + ' ' +
                            this._globalService.translate('group_not_edited'));
                        debugger;
                        break
                }
            })
            .then(() => {
                this.closeMe();
            })
            .then(() => {
                this._globalService.refreshAssistantPanelAll();
            });
    }



    getClassrooms() {
        this._service.getClassrooms()
            .then(
                cls => this.classrooms = cls,
                error => this.errorMessage = <any>error);
    }

    getAllStudents() {
        this._studentsService.getStudentsOfDepartment(this.group.division.departmentID)
            .then(otherStudents => this.otherStudents = otherStudents, error => this.errorMessage = <any>error);
    }

}
