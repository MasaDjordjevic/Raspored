import {Component, Input, Output, EventEmitter} from "angular2/core";
import {ClassroomsService} from "../../services/classrooms.service";
import {GroupsService} from "../../services/groups.service";
import {TimeSpan} from "../../models/TimeSpan";
import {Course} from "../../models/Course";
import {CoursesService} from "../../services/courses.service";
import {Group} from "../../models/Group";

import * as moment_ from "../../../js/moment.js";
import {R_BUTTON} from "../../ui/r-button.component";
import {R_DROPDOWN} from "../../ui/r-dropdown";
import {R_INPUT} from "../../ui/r-input-text.component";
const moment = moment_["default"];

@Component({
    selector: 'add-activity',
    template: `    
    
    
    <span *ngIf="dateChoices && dateChoices.length === 1">
        Dodavanje obaveštenja za čas zakazan za {{dateChoices[0]}}.    
    </span>
    <r-dropdown *ngIf="dateChoices && dateChoices.length > 1"
    [label]="'Dodajem obaveštenje za čas koji treba da bude održan...'" [(val)]="weekNumber" [primaryColor]="primaryColor">
        <r-dropdown-item *ngFor="let dateChoice of dateChoices; let i = index" [value]="i">{{dateChoice}}</r-dropdown-item>  
    </r-dropdown>

    <r-input [label]="'Naslov'"
             [(val)]="announcement.title"
             [primaryColor]="primaryColor">
    </r-input>
    
    <textarea [value]="announcement.content">
    </textarea>
           
    <div class="controls">
        <button r-button flat [text]="'Odustani'" (click)="closeMe()" [primaryColor]="primaryColor">Odustani</button>
        <button r-button raised [text]="'Dodaj obaveštenje'" (click)="save()" [primaryColor]="primaryColor">Dodaj obaveštenje</button> 
    </div>
    `,
    providers: [ClassroomsService, GroupsService],
    directives: [R_INPUT, R_DROPDOWN, R_BUTTON],
    styleUrls: ['app/assistant-panel/dialogs/group-add-activity.css']
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

    announcement:any = {
        title: "",
        content: "",
    };

    @Input() set groupId(n: number) {
        this._groupId = n;
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
            .then(() => this.listDateChoices(this.group.timeSpan.startDate, this.group.timeSpan.period));
    }

    constructor(private _classroomsService: ClassroomsService,
                private _groupsService: GroupsService) {
        this.getClassrooms();

    }


    save(value) {
        var timespan:TimeSpan = new TimeSpan;
        timespan.startDate = value.timeStart;
        timespan.endDate = value.timeEnd;
        timespan.period = value.period;

        this._groupsService.addActivity(
            this.group.groupID,
            null, // classroom
            null, // place
            this.announcement.title,
            this.announcement.content,
            null // timespan // TODO ovde treba da se prosledi weekNumber i da se to ocekuje na backendu
        );
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
        return ret;
    }
}