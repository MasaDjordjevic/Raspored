import {Component, Input, Output, EventEmitter} from "angular2/core";
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
    selector: 'add-announcement',
    templateUrl: 'app/assistant-panel/dialogs/add-announcement.html',
    styleUrls: ['app/assistant-panel/dialogs/add-announcement.css'],
    directives: [R_INPUT, R_DROPDOWN, R_BUTTON],
    providers: [ClassroomsService, GroupsService, StudentsService],
})

export class AddAnnouncementComponent {

    @Input() primaryColor: string = "MaterialBlue";
    @Input() secondaryColor: string = "MaterialOrange";

    @Input() assistant = true; // ako je assistent dodaje se preko groupService ako je student preko studentService

    @Output() close: EventEmitter<any> = new EventEmitter<any>();

    public closeMe() {
        this.close.emit("close!");
    }

    private classrooms;
    courses: Course[];
    private errorMessage;

    announcement: {title: string, content: string, startDate: any, endDate: any, classroom: number, place: string}
        = <any>{};

    resetAnnouncement() {
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
        private _groupsService: GroupsService,
        private _globalService: GlobalService,
        private _studentsService: StudentsService
    ) {
        this.getClassrooms();
        this.resetAnnouncement();
    }


    save() {
        var timespan:TimeSpan = new TimeSpan;
        timespan.startDate = new Date(this.announcement.startDate);
        timespan.endDate = new Date(this.announcement.endDate);
        timespan.period = 0;

        //nzm zasto ovo nece
        var func = this._groupsService.addActivity;
        if(!this.assistant)
            func = this._studentsService.addActivity;

        if(this.assistant) {
            this._groupsService.addActivity(
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
        else {
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

    }

    getClassrooms() {
        this._classroomsService.getClassrooms()
            .then(
                cls => this.classrooms = cls,
                error => this.errorMessage = <any>error
            .then(()=> this.announcement.classroom = this.classrooms[0]));
    }


}