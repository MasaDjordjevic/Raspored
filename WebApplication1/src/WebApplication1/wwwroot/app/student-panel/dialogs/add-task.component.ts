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
import {StudentsService} from "../../services/students.service";
import {GlobalService} from "../../services/global.service";
const moment = moment_["default"];

@Component({
    selector: 'r-add-task',
    template: `
<template [ngIf]="groupId">
    <span *ngIf="dateChoices && dateChoices.length === 1">
        Dodavanje zadatka za čas zakazan za {{dateChoices[0]}}.    
    </span>
    <r-dropdown *ngIf="dateChoices && dateChoices.length > 1"
    [label]="'Dodajem zadatak za čas koji treba da bude održan...'" [(val)]="task.startDate" [primaryColor]="primaryColor">
        <r-dropdown-item *ngFor="let dateChoice of dateChoices; let i = index" [value]="dateChoice">{{dateChoice}}</r-dropdown-item>  
    </r-dropdown>

    <r-input [label]="'Naslov'"
             [(val)]="task.title"
             [primaryColor]="primaryColor">
    </r-input>
    
    <div class="classroom-place">
        <div><r-dropdown [primaryColor]="primaryColor"
                    [secondaryColor]="secondaryColor"             
                    [(val)]="classroomId"
                    [label]="'Učionica'"
                    *ngIf="classrooms && classrooms.length"
        >
            <r-dropdown-item
                *ngFor="let classroom of classrooms"
                [value]="classroom.classroomID"
            >
                {{classroom.number}}
            </r-dropdown-item>
        </r-dropdown></div>
        
        <div><r-input [label]="'Mesto'" [(val)]="task.place" [primaryColor]="primaryColor"></r-input></div>
    </div>
    
    <textarea [(ngModel)]="task.content">
    </textarea>
           
    <div class="controls">
        <button r-button flat [text]="'Odustani'" (click)="closeMe()" [primaryColor]="primaryColor">Odustani</button>
        <button r-button raised [text]="'Dodaj obaveštenje'" (click)="save()" [primaryColor]="primaryColor">Dodaj obaveštenje</button> 
    </div>
</template>
    `,
    providers: [ClassroomsService, GroupsService],
    directives: [R_INPUT, R_DROPDOWN, R_BUTTON],
    styleUrls: ['app/assistant-panel/dialogs/group-add-activity.css'],
    styles: [
    `
        .classroom-place {
            display: flex;
            justify-content: space-between;
        }
        
        .classroom-place > div {
            width: 48%;
        }        
    `
    ]
})
export class AddTaskComponent {

    @Input() primaryColor: string = "MaterialBlue";
    @Input() secondaryColor: string = "MaterialOrange";

    weekNumber: number = 0;
    
    @Output() close: EventEmitter<any> = new EventEmitter<any>();
    public closeMe() {
        this.close.emit({});
    }

    group: any;
    private classrooms;
    courses: Course[];
    private errorMessage;

    dateChoices: string[];

    private _groupId: number = 0;

    task: any = {
        title: null,
        content: null,
        classroomId: null,
        place: null
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
            .then(() => {
                this.group.timeSpan && this.listDateChoices(this.group.timeSpan, this.group.timeSpan.period)
            });
    }

    constructor(
        private _classroomsService: ClassroomsService,
        private _groupsService: GroupsService,
        private _studentsService: StudentsService,
        private _globalService: GlobalService
    ) {
        this.getClassrooms();
    }


    save() {
        var timespan:TimeSpan = new TimeSpan;
        timespan.startDate = this.task.startDate;
        timespan.endDate = this.task.startDate;
        timespan.period = 0;

        this._studentsService.addActivity(
            this.task.classroomId, // classroom
            timespan,
            this.task.title,
            this.task.content,
            this.task.place,
            this.group.groupID            
        )
            .then(response => {
                console.log(response);
                switch(response.status) {
                    case "uspelo":
                        this._globalService.toast(`Uspelo dodavanje zadatka.`);
                        break;
                    default:
                        this._globalService.toast(`Došlo je do greške. Nije uspelo dodavanje novog zadatka.`);
                        debugger;
                        break;
                }
            })
            .then(() => {
                this.closeMe();
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
        this.task.startDate = this.dateChoices[0];
        return ret;
    }
}