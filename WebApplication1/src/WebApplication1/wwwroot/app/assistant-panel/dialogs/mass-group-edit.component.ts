import {Component, Input} from "angular2/core";
import {R_DROPDOWN} from "../../ui/r-dropdown";
import {R_INPUT} from "../../ui/r-input-text.component";
import {ClassroomsService} from "../../services/classrooms.service";
import {R_BUTTON} from "../../ui/r-button.component";
import {TimeSpan} from "../../models/TimeSpan";
import {GroupsService} from "../../services/groups.service";


import * as moment_ from "../../../js/moment.js";
const moment = moment_["default"];

@Component({
    selector: 'r-mass-group-edit',
    template: `
    <!--<h1>Masovna izmena grupa raspodele <i>{{division.name}}</i></h1>-->
    <template [ngIf]="editedDivision.length">
        <div *ngFor="let group of division.Groups, let i = index">
            <div class="name">{{group.name}}</div>
            <div class="classroom">
                <r-dropdown [label]="'Učionica'" [(val)]="editedDivision[i] && editedDivision[i].classroomId">
                    <r-dropdown-item *ngFor="let classroom of classrooms" [value]="classroom.classroomID">
                        {{classroom.number}}
                    </r-dropdown-item>
                </r-dropdown>
            </div>
            <div class="timespan">
                <r-dropdown [label]="'Perioda'" [(val)]="editedDivision[i].period" [dropdownType]="i > division.Groups.length / 2 ? 'up' : 'down'">
                    <r-dropdown-item [value]="1">Svake nedelje</r-dropdown-item>
                    <r-dropdown-item [value]="2">Na dve nedelje</r-dropdown-item>
                    <r-dropdown-item [value]="4">Na četiri nedelje</r-dropdown-item>
                    <r-dropdown-item [value]="0">Jednom</r-dropdown-item>
                </r-dropdown>
                <template [ngIf]="editedDivision[i].period && editedDivision[i].period !== 0">
                    <r-dropdown [label]="'Dan u nedelji'" [(val)]="editedDivision[i].dayOfWeek" [dropdownType]="i > division.Groups.length / 2 ? 'up' : 'down'">
                        <r-dropdown-item [value]="0">Ponedeljak</r-dropdown-item>
                        <r-dropdown-item [value]="1">Utorak</r-dropdown-item>
                        <r-dropdown-item [value]="2">Sreda</r-dropdown-item>
                        <r-dropdown-item [value]="3">Četvrtak</r-dropdown-item>
                        <r-dropdown-item [value]="4">Petak</r-dropdown-item>
                        <r-dropdown-item [value]="5">Subota</r-dropdown-item>
                        <r-dropdown-item [value]="6">Nedelja</r-dropdown-item>
                    </r-dropdown>
                    <r-input class="light-theme" [label]="'Početak (HH:MM)'" [(val)]="editedDivision[i].timeStart"></r-input>
                    <r-input class="light-theme" [label]="'Kraj (HH:MM)'" [(val)]="editedDivision[i].timeEnd"></r-input>
                </template>
                <template [ngIf]="editedDivision[i].period == 0">
                    <r-input class="light-theme" [label]="'Početak (YYYY-MM-DD HH:MM)'" [(val)]="editedDivision[i].dateTimeStart"></r-input>
                    <r-input class="light-theme" [label]="'Kraj (YYYY-MM-DD HH:MM)'" [(val)]="editedDivision[i].dateTimeEnd"></r-input>
                </template>
                <!--{{editedDivision[i] | json}}-->
            </div>
        </div>
        <div class="controls">
            <button r-button raised [text]="'Sačuvaj izmene'" (click)="save()">Sačuvaj izmene</button>
        </div>
    </template>
    `,
    styleUrls: ['app/assistant-panel/dialogs/mass-group-edit.css'],
    directives: [R_DROPDOWN, R_INPUT, R_BUTTON],
    providers: [ClassroomsService]
})

export class MassGroupEditComponent {
    private _division: any;
    private classrooms: any;
    private errorMessage: string;

    public get division() {
        return this._division;
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
        private _groupsService: GroupsService
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
        debugger;
        // za svaku grupu, uradi čuvanje
        for (let i = 0; i < this.editedDivision.length; i++) {
            // pripremanje parametara za slanje
            let groupId = this.editedDivision[i].groupId; // ne menja se
            let divisionId = this.division.divisionID; // ne menja se
            let assistantId = this.division.Groups[i].assistantID; // ne menja se
            let name = this.division.Groups[i].name; // ne menja se
            let classroomId = this.editedDivision[i].classroomId;
            let timespan = {
                startDate: new Date(this.editedDivision[i].dateTimeStart),
                endDate: new Date(this.editedDivision[i].dateTimeEnd),
                period: +this.editedDivision[i].period,
                dayOfWeek: this.editedDivision[i].dayOfWeek,
                timeStart: this.editedDivision[i].timeStart,
                timeEnd: this.editedDivision[i].timeEnd
            };
            let students = this.division.Groups[i].GroupsStudents.map(el => el.studentID);

            // cuvanje svake posebno
            this._groupsService.updateGroup(
                groupId, divisionId, assistantId, name,
                classroomId, timespan, students
            )
                .then(status => console.log(status));
        }
    }

}
