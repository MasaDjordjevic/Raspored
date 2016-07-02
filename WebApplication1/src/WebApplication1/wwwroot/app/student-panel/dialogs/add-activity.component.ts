import {Component, Input, Output, EventEmitter, AfterViewInit} from "angular2/core";
import {ClassroomsService} from "../../services/classrooms.service";
import {GroupsService} from "../../services/groups.service";
import {TimeSpan} from "../../models/TimeSpan";
import {Course} from "../../models/Course";
import {CoursesService} from "../../services/courses.service";
import {Group} from "../../models/Group";
import {R_BUTTON} from "../../ui/r-button.component";
import {R_DROPDOWN} from "../../ui/r-dropdown";
import {R_INPUT} from "../../ui/r-input-text.component";
import {GlobalService} from "../../services/global.service";
import {moment} from "../../global/moment.import";
import {StudentsService} from "../../services/students.service";



@Component({
    selector: 'add-personal-activity',
    templateUrl: 'app/student-panel/dialogs/add-activity.html',
    directives: [R_INPUT, R_DROPDOWN, R_BUTTON],
    providers: [ClassroomsService, StudentsService],
})

export class AddPersonalActivityComponent {


    @Input() primaryColor: string = "MaterialBlue";
    @Input() secondaryColor: string = "MaterialOrange";

    @Output() close: EventEmitter<any> = new EventEmitter<any>();

    public closeMe() {
        this.close.emit("close!");
    }

    private classrooms;
    courses: Course[];
    private errorMessage;

    announcement: {title: string, content: string, startDate: any, endDate: any, classroom: number, place: string}
        = <any>{};
    editedPeriod: any;
    editedDayOfWeek: any;
    editedTimeStart: any;
    editedTimeEnd: any;
    editedDateTimeStart: any;
    editedDateTimeEnd: any;


    resetActivity() {
        this.announcement = {
            content: "",
            title: "",
            startDate: null,
            endDate: null,
            classroom: null,
            place: ""
        };
    }


    constructor(
        private _classroomsService: ClassroomsService,
        private _globalService: GlobalService,
        private _studentsService: StudentsService
    ) {
        this.getClassrooms();
        this.resetActivity();
    }


    save() {
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

        debugger;

        this._studentsService.addActivity(
            null, // groupID
            this.announcement.classroom, // classroom
            this.announcement.place, // place
            this.announcement.title,
            this.announcement.content,
            timespan
            )
            .then(response => {
                switch(response.status) {
                    case "uspelo":
                        this._globalService.toast(
                            this._globalService.translate("successfully_added_announcement"));
                        break;
                    default:
                        this._globalService.toast(this._globalService.translate("error") + ' '
                            + this._globalService.translate("announcement_not_added"));
                        debugger;
                        break;
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
        this._classroomsService.getClassrooms()
            .then(
                cls => this.classrooms = cls,
                error => this.errorMessage = <any>error
                    .then(()=> this.announcement.classroom = this.classrooms[0]));
    }


}