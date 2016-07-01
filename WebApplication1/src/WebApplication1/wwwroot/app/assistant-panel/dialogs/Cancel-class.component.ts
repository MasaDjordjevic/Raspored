import {Component, Input, Output, EventEmitter} from "angular2/core";
import {TimeSpan} from "../../models/TimeSpan";
import {GroupsService} from "../../services/groups.service";
import {R_DROPDOWN} from "../../ui/r-dropdown";
import {R_INPUT} from "../../ui/r-input-text.component";
import {R_BUTTON} from "../../ui/r-button.component";
import {GlobalService} from "../../services/global.service";
import {moment} from "../../global/moment.import";



@Component({
    selector: 'cancel-class',
    templateUrl: 'app/assistant-panel/dialogs/cancel-class.html',
    styleUrls: ['app/assistant-panel/dialogs/cancel-class.css'],
    directives: [R_INPUT, R_DROPDOWN, R_BUTTON],
    providers: [GroupsService],
})

export class CancelClassComponent {

    @Input() primaryColor: string = "MaterialBlue";
    @Input() secondaryColor: string = "MaterialOrange";

    @Output() close: EventEmitter<any> = new EventEmitter<any>();
    public closeMe() {
        this.close.emit({});
    }

    group: any;
    private errorMessage;

    private _groupId: number = 0;

    @Input() set groupId(n: number) {
        this._groupId = n;
        this.getGroup();
    }

    get groupId() {
        return this._groupId;
    }

    getGroup(): void {
        this._groupsService.getGroup(this.groupId)
            .then(
                group => this.group = group,
                error => this.errorMessage = <any>error
            )
            .then(() => 
                this.group.timeSpan &&
                this.listDateChoices(this.group.timeSpan, this.group.timeSpan.period)
            );
    }
    
    constructor(
        private _groupsService: GroupsService,
        private _globalService: GlobalService
    ) {}

    cancel: any = {
        title: "",
        content: "",
    };
    dateChoices: string[];

    // iskopirano u group-add-activity.component.ts
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
        this.cancel.startDate = this.dateChoices[0];
        return ret;
    }

    cancelClass() {
        var timespan: TimeSpan = new TimeSpan;
        timespan.startDate = this.cancel.startDate;
        timespan.endDate = this.cancel.startDate;
        timespan.period = 0;
        this._groupsService.cancelClass(this.groupId, this.cancel.title, this.cancel.content, timespan)
            .then(response => {
                switch(response.status) {
                    case "uspelo":
                        this._globalService.toast(this._globalService.translate("class_successfully_canceled"));
                        break;
                    case "neuspelo":
                        switch(response.message) {
                            case "Čas je već otkazan.":
                                this._globalService.toast(this._globalService.translate("class_already_canceled"));
                                break;
                            default:
                                this._globalService.toast(`${this._globalService.translate("error")} ${this._globalService.translate("clas_not_canceled")}`);
                                debugger;
                                break;
                        }
                        break;
                    default:
                        this._globalService.toast(`${this._globalService.translate("error")} ${this._globalService.translate("class_not_canceled")}.`);
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
