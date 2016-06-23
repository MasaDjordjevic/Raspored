import {Component, Input} from "angular2/core";
import {R_DROPDOWN} from "../../ui/r-dropdown";
import {R_INPUT} from "../../ui/r-input-text.component";
import {ClassroomsService} from "../../services/classrooms.service";
import {R_BUTTON} from "../../ui/r-button.component";


@Component({
    selector: 'r-mass-group-edit',
    template: `
    <!--<h1>Masovna izmena grupa raspodele <i>{{division.name}}</i></h1>-->
    <template [ngIf]="editedDivision.length">
        <div *ngFor="let group of division.Groups, let i = index">
            <div class="name">{{group.name}}</div>
            <div class="classroom">
                <r-dropdown [label]="'Učionica'" [(val)]="editedDivision[i].classroomId">
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
            this.editedDivision.push({
                classroomId: this.division.Groups[i].classroomID,
                //timeSpanId: this.division.Groups[i].timeSpanID
                // TODO
                period: null,
                dayOfWeek: null,
                timeStart: null,
                timeEnd: null,
                dateTimeStart: null,
                dateTimeEnd: null,
            });
        }
    };

    constructor(private _classroomsService: ClassroomsService) {
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
        alert("TODO"); // TODO
    }

}