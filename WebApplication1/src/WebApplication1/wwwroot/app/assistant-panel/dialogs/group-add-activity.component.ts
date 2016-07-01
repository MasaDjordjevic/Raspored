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

@Component({
    selector: 'add-activity',
    templateUrl: 'app/assistant-panel/dialogs/group-add-activity.html',
    styleUrls: ['app/assistant-panel/dialogs/group-add-activity.css'],
    directives: [R_INPUT, R_DROPDOWN, R_BUTTON],
    providers: [ClassroomsService, GroupsService],
})
export class AddActivityComponent {

    @Input() primaryColor: string = "MaterialBlue";
    @Input() secondaryColor: string = "MaterialOrange";


    @Output() close: EventEmitter<any> = new EventEmitter<any>();

    weekNumber: number = 0;

    public closeMe() {
        this.close.emit("close!");
    }

    group: any;
    private classrooms;
    courses: Course[];
    private errorMessage;

    dateChoices: string[];

    private _groupId: number = 0;

    announcement: {title: string, content: string, startDate: any, endDate: any} = <any>{};

    resetAnnouncement() {
        this.announcement = {
            content: "",
            title: "",
            startDate: null,
            endDate: null
        };
    }

    @Input() set groupId(n: number) {
        this._groupId = n;
        this.resetAnnouncement();
        this.getGroup();
    }

    get groupId() {
        return this._groupId;
    }

    getGroup(): void {
        this._groupsService.getGroup(this.groupId).then(
            group => this.group = group,
            error => this.errorMessage = <any>error
        )
            .then(() => this.group.timeSpan
                && this.listDateChoices(this.group.timeSpan, this.group.timeSpan.period));
    }

    constructor(
        private _classroomsService: ClassroomsService,
        private _groupsService: GroupsService,
        private _globalService: GlobalService
    ) {
        this.getClassrooms();
        this.resetAnnouncement();
    }


    save() {
        var timespan:TimeSpan = new TimeSpan;
        timespan.startDate = this.announcement.startDate;
        timespan.endDate = this.announcement.startDate;
        timespan.period = 0;

        this._groupsService.addActivity(
            this.group.groupID,
            null, // classroom
            null, // place
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
                error => this.errorMessage = <any>error);
    }

    // iskopirano iz cancel-class.componenet
    public listDateChoices(date, period) {
        var ret: string[] = [];
        if (period === 0) {
            // cas se samo jednom odrzava, ponudi mu samo taj jedan izbor
            ret.push(moment(date).format("YYYY-MM-DD"));
        } else {
            // cas se odrzava periodicno, ponudi mu 4 sledece instance casa

            // trazimo koji je dan u nedelji un pitanju: 0 = nedelja, 1 = ponedeljak, ..., 6 = subota
            let dayOfWeek = moment(date).format("d");

            // trazimo koji je prvi sledeci dan kada je taj dan u nedelji, pocev od danas (ukljucujuci i danas)
            let choice = moment();
            while (choice.format("d") !== dayOfWeek) {
                choice.add(1, "day");
            }

            // u niz guramo 4 datuma
            for (let i = 0; i < 4; i++) {
                ret.push(choice.clone().format("YYYY-MM-DD"));
                choice.add(+period, "week");
            }
        }
        this.dateChoices = ret;
        this.announcement.startDate = this.dateChoices[0];
        return ret;
    }
}