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
import {CancelClassComponent} from "../dialogs/Cancel-class.component";

import * as moment_ from "../../../js/moment.js";
import {TimetableComponent} from "../../timetable/r-timetable.component";
import {AssistantService} from "../../services/assistant.service";
const moment = moment_["default"];

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

    group: Group;
    errorMessage: string;

    private _groupId: number = 0;

    @Input() set groupId(n: number) {
        this._groupId = n;
        this.getGroup();
    }

    get groupId() {
        return this._groupId;
    }

    constructor( private _service: GroupsService ) {}
    
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
            let modifier = period === 1 ? "" : period === 2 ? "druge" : "četvrte";
            let dayName =
                day === 0 ? "nedelju" :
                    day === 1 ? "ponedeljak" :
                        day === 2 ? "utorak" :
                            day === 3 ? "sredu" :
                                day === 4 ? "četvrtak" :
                                    day === 5 ? "petak" : "subotu";

            return `Svake ${modifier} nedelje u ${dayName} od ${start.format("HH:mm")} do ${end.format("HH:mm")}`;
        }

    }

    getGroup(): void {
        this._service.getGroup(this.groupId).then(
            group => this.group = group,
            error => this.errorMessage = <any>error
        )
    }
    
    removeGroup() {
        //TODO uradi nesto pametnije sa odgovorom
        this._service.removeGroup(this.groupId).then(any => console.log(any));
    }

    

}