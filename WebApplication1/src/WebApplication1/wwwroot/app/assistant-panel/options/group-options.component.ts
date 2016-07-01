import {Component, Input, Pipe, PipeTransform} from "angular2/core";
import {GroupsService} from "../../services/groups.service";
import {Group} from "../../models/Group";
import {R_DIALOG} from "../../ui/r-dialog";
import {R_BUTTON} from "../../ui/r-button.component";
import {R_STEPPER} from "../../ui/r-stepper.component";
import {R_DL} from "../../ui/r-dl";
import {TrimPipe} from "../../pipes/trim.pipe";
import {GroupEditComponent} from "../dialogs/group-edit.component";
import {AddActivityComponent} from "../dialogs/group-add-activity.component";
import {CancelClassComponent} from "../dialogs/cancel-class.component";
import {TimetableComponent} from "../../timetable/r-timetable.component";
import {AssistantService} from "../../services/assistant.service";
import {GlobalService} from "../../services/global.service";
import {moment} from "../../global/moment.import"; 

@Component({
    selector: 'r-group-options',
    templateUrl: 'app/assistant-panel/options/group-options.html',
    styleUrls: [
        'app/assistant-panel/options/assistant-panel-options.css',
        'app/assistant-panel/options/group-options.css',
    ],
    providers: [GroupsService, AssistantService],
    directives: [R_DIALOG, R_BUTTON, R_STEPPER, R_DL, GroupEditComponent, AddActivityComponent, CancelClassComponent, TimetableComponent],
    pipes: [TrimPipe],
})

export class GroupOptionsComponent {

    @Input() primaryColor: string = "MaterialBlue";
    @Input() secondaryColor: string = "MaterialOrange";

    group: any;
    errorMessage: string;

    private _groupId: number = 0;

    @Input() set groupId(n: number) {
        this._groupId = n;
        this.getGroup();
    }

    get groupId() {
        return this._groupId;
    }

    constructor(
        private _service: GroupsService,
        private _globalService: GlobalService
    ) {}
    
    get descriptiveString() {
        if (!this.group.timeSpan) {
            return "Nije dodeljeno vreme trajanja.";
        }

        var period = +this.group.timeSpan.period;

        // cas se desava samo jednom
        if (period === 0) {
            let start = moment(this.group.timeSpan.startDate);
            let end = moment(this.group.timeSpan.endDate);

            return `${start.format("YYYY-MM-DD, HH:mm")} — ${end.format("YYYY-MM-DD, HH:mm")}`;
        } else {
            // cas se desava periodicno
            let start = moment(this.group.timeSpan.startDate);
            let end = moment(this.group.timeSpan.endDate);

            // tražimo dan
            let day = start.day(); // 0 nedelja, 1 ponedeljak, ..., 6 subota
            let modifier = period === 1 ? "" :
                period === 2 ? this._globalService.translate('second__acc') :
                    this._globalService.translate('fourth__acc');
            
            let dayName =
                day === 0 ? this._globalService.translate('sunday') :
                    day === 1 ? this._globalService.translate('monday__acc') :
                        day === 2 ? this._globalService.translate('tuesday__acc') :
                            day === 3 ? this._globalService.translate('wednesday__acc') :
                                day === 4 ? this._globalService.translate('thursday__acc') :
                                    day === 5 ? this._globalService.translate('friday__acc') :
                                        this._globalService.translate('saturday__acc');

            return this._globalService.translate('duration_descriptive_string__1') + 
                modifier + 
                this._globalService.translate('duration_descriptive_string__2') + 
                dayName + 
                this._globalService.translate('duration_descriptive_string__3') + 
                start.format("HH:mm") + 
                this._globalService.translate('duration_descriptive_string__4') + 
                end.format("HH:mm");
        }

    }

    getGroup(): void {
        this._service.getGroup(this.groupId).then(
            group => this.group = group,
            error => this.errorMessage = <any>error
        )
    }
    
    removeGroup() {
        this._service.removeGroup(this.groupId)
            .then(response => {
                switch(response.status) {
                    case "uspelo":
                        this._globalService.toast(this._globalService.translate('group_delete_successful__1') +
                            ' *' + this.group.name + '*'
                            + this._globalService.translate('group_delete_successful__2'));
                        break;
                    default:
                        this._globalService.toast(this._globalService.translate('error') + ' '
                            + this._globalService.translate('group_delete_unsuccessful__1') +
                            ' *' + this.group.name + '*' +
                            + this._globalService.translate('group_delete_unsuccessful__2'));
                        debugger;
                        break;
                }
            })
            .then(() => {
                this._globalService.refreshAssistantPanelMoveMinusOne();
            });
    }

}