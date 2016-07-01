import {Component, Input, Output, EventEmitter} from "angular2/core";
import {R_DROPDOWN} from "../../ui/r-dropdown";
import {R_INPUT} from "../../ui/r-input-text.component";
import {ClassroomsService} from "../../services/classrooms.service";
import {R_BUTTON} from "../../ui/r-button.component";
import {TimeSpan} from "../../models/TimeSpan";
import {GroupsService} from "../../services/groups.service";
import {GlobalService} from "../../services/global.service";
import {moment} from "../../global/moment.import";

@Component({
    selector: 'r-mass-group-edit',
    template: `
    <!--<h1>Masovna izmena grupa raspodele <i>{{division.name}}</i></h1>-->
    <template [ngIf]="editedDivision.length">                                                                                     
        <div *ngFor="let group of division.Groups, let i = index">
            <div class="name">{{group.name}}</div>
            <div class="classroom">
                <r-dropdown [label]="_globalService.translate('classroom')" [(val)]="editedDivision[i] && editedDivision[i].classroomId">
                    <r-dropdown-item *ngFor="let classroom of classrooms" [value]="classroom.classroomID">
                        {{classroom.number}}
                    </r-dropdown-item>
                </r-dropdown>
            </div>
            <div class="timespan">
                <r-dropdown [label]="_globalService.translate('period')" [(val)]="editedDivision[i].period"
                            [dropdownType]="i > division.Groups.length / 2 ? 'up' : 'down'">
                    <r-dropdown-item [value]="1">{{_globalService.translate('every_week')}}</r-dropdown-item>
                    <r-dropdown-item [value]="2">{{_globalService.translate('every_second_week')}}</r-dropdown-item>
                    <r-dropdown-item [value]="4">{{_globalService.translate('every_fourth_week')}}</r-dropdown-item>
                    <r-dropdown-item [value]="0">{{_globalService.translate('just_once')}}</r-dropdown-item>
                </r-dropdown>
                <template [ngIf]="editedDivision[i].period && editedDivision[i].period !== 0">
                    <r-dropdown [label]="'Dan u nedelji'" [(val)]="editedDivision[i].dayOfWeek" [dropdownType]="i > division.Groups.length / 2 ? 'up' : 'down'">
                        <r-dropdown-item [value]="1">{{_globalService.translate('monday')}}</r-dropdown-item>
                        <r-dropdown-item [value]="2">{{_globalService.translate('tuesday')}}</r-dropdown-item>
                        <r-dropdown-item [value]="3">{{_globalService.translate('wednesday')}}</r-dropdown-item>
                        <r-dropdown-item [value]="4">{{_globalService.translate('thursday')}}</r-dropdown-item>
                        <r-dropdown-item [value]="5">{{_globalService.translate('friday')}}</r-dropdown-item>
                        <r-dropdown-item [value]="6">{{_globalService.translate('saturday')}}</r-dropdown-item>
                        <r-dropdown-item [value]="0">{{_globalService.translate('sunday')}}</r-dropdown-item>
                    </r-dropdown>
                    <r-input [label]="_globalService.translate('beginning') + ' (HH:MM)'"
                             [(val)]="editedDivision[i].timeStart"></r-input>
                    <r-input [label]="_globalService.translate('ending') + ' (HH:MM)'"
                             [(val)]="editedDivision[i].timeEnd"></r-input>
                </template>
                <template [ngIf]="editedDivision[i].period == 0">
                    <r-input [label]="_globalService.translate('beginning') + ' (YYYY-MM-DD HH:MM)'"
                             [(val)]="editedDivision[i].dateTimeStart"></r-input>
                    <r-input [label]="_globalService.translate('ending') + ' (YYYY-MM-DD HH:MM)'"
                             [(val)]="editedDivision[i].dateTimeEnd"></r-input>
                </template>
            </div>
        </div>
        <div class="controls">
            <button r-button raised [text]="_globalService.translate('save_changes')" (click)="save()">
                {{_globalService.translate('save_changes')}}
            </button>
        </div>
    </template>
    `,
    styleUrls: ['app/assistant-panel/dialogs/mass-group-edit.css'],
    directives: [R_DROPDOWN, R_INPUT, R_BUTTON],
    providers: [ClassroomsService]
})

export class MassGroupEditComponent {

    @Input() primaryColor: string = "MaterialBlue";
    @Input() secondaryColor: string = "MaterialOrange";

    private _division: any;
    private classrooms: any;
    private errorMessage: string;

    public get division() {
        return this._division;
    }

    @Output() close: EventEmitter<any> = new EventEmitter<any>();
    public closeMe() {
        this.close.emit({});
    }

    @Input() public set division(d) {
        this._division = d;
        this.editedDivision = [];
        for (let i = 0; i < this.division.Groups.length; i++) {
            // vrlo je bitno da idu istim redom zbog čuvanja kasnije
            if (this.division.Groups[i].timeSpan) {
                this.editedDivision.push({
                    groupId: this.division.Groups[i].groupID,
                    classroomId: this.division.Groups[i].classroomID,
                    period: this.division.Groups[i].timeSpan.period,
                    dayOfWeek: moment(this.division.Groups[i].timeSpan.startDate).clone().day(), // 0 nedelja, 1 ponedeljak, ... 6 subota
                    timeStart: this.division.Groups[i].timeSpan.period === 0 ? null :
                        moment(this.division.Groups[i].timeSpan.startDate).clone().format("HH:mm"),
                    timeEnd: this.division.Groups[i].timeSpan.period === 0 ? null :
                        moment(this.division.Groups[i].timeSpan.endDate).clone().format("HH:mm"),
                    dateTimeStart: this.division.Groups[i].timeSpan.period !== 0 ? null:
                        moment(this.division.Groups[i].timeSpan.startDate).clone().format("YYYY-MM-DD HH:mm"),
                    dateTimeEnd: this.division.Groups[i].timeSpan.period !== 0 ? null :
                        moment(this.division.Groups[i].timeSpan.endDate).clone().format("YYYY-MM-DD HH:mm"),
                });
            } else {
                this.editedDivision.push({
                    groupId: this.division.Groups[i].groupID,
                    classroomId: this.division.Groups[i].classroomID,
                    period: null,
                    dayOfWeek: null,
                    timeStart: null,
                    timeEnd: null,
                    dateTimeStart: null,
                    dateTimeEnd: null,
                })
            }
        }
    };

    constructor(
        private _classroomsService: ClassroomsService,
        private _groupsService: GroupsService,
        private _globalService: GlobalService
    ) {
        this.getClassrooms();
    }

    getClassrooms() {
        this._classroomsService.getClassrooms()
            .then(
                cls => this.classrooms = cls,
                error => this.errorMessage = <any>error);
    }

    private editedDivision = [];

    public save() {
        var sendData = [];
        for (let i = 0; i < this.editedDivision.length; i++) {
            // pripremanje parametara za slanje
            let sendObj: any = {
                groupId: this.editedDivision[i].groupId,
                classroomId: this.editedDivision[i].classroomId,
                timespan: null
            };
            // ostace null ukoliko nista nije izabrano
            if (this.editedDivision[i].period) {
                sendObj.timespan = {
                    startDate: new Date(this.editedDivision[i].dateTimeStart),
                    endDate: new Date(this.editedDivision[i].dateTimeEnd),
                    period: +this.editedDivision[i].period,
                    dayOfWeek: this.editedDivision[i].dayOfWeek,
                    timeStart: this.editedDivision[i].timeStart,
                    timeEnd: this.editedDivision[i].timeEnd
                };
            }
            sendData.push(sendObj);
        }

        this._groupsService.massGroupEdit(sendData)
            .then(response => {
                switch(response.status) {
                    case "uspelo":
                        this._globalService.toast(this._globalService.translate('successfully_edited_groups_from_division__1')
                            + '*' + this.division.name + '*' +
                            + this._globalService.translate('successfully_edited_groups_from_division__2'));
                        break;
                    default:
                        this._globalService.toast(this._globalService.translate('error')
                            + ' ' + this._globalService.translate('mass_edit_unsuccessful'));
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
