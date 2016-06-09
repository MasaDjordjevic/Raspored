﻿import {Component, Input, EventEmitter, Output} from "angular2/core";
import {Division} from "../../models/Division";
import {DivisionsService} from "../../services/divisions.service";
import {R_DIALOG} from "../../ui/r-dialog";
import {R_BUTTON} from "../../ui/r-button.component";
import {R_STEPPER} from "../../ui/r-stepper.component";
import {R_DL} from "../../ui/r-dl";
import {DivisionCreatorComponent} from "../dialogs/division-creator.component";
import {TrimPipe} from "../../pipes/trim.pipe";
import {GroupEditComponent} from "../dialogs/group-edit.component";
import {GroupsService} from "../../services/groups.service";
import {DivisionEditComponent} from "../dialogs/division-edit.component";



@Component({
    selector: 'r-division-options',
    templateUrl: 'app/assistant-panel/options/division-options.html',
    styleUrls: [
        'app/assistant-panel/options/assistant-panel-options.css',
        'app/assistant-panel/options/division-options.css',
    ],
    providers: [DivisionsService, GroupsService],
    directives: [R_DIALOG, R_BUTTON, R_STEPPER, R_DL, DivisionCreatorComponent, GroupEditComponent, DivisionEditComponent],
    pipes: [TrimPipe]
})

export class DivisionOptionsComponent {

    @Input() primaryColor: string = "MaterialBlue";
    @Input() secondaryColor: string = "MaterialOrange";
    @Output() update: EventEmitter = new EventEmitter();

    division: any;
    errorMessage: string;
    emptyGroup: any; //sluzi za dodavanje nove grupe preko edit-group komponente

    private _divisionId: number = 0;

    @Input() set divisionId(n: number) {
        this._divisionId = n;
        this.getDivision();
    }

    get divisionId() {
        return this._divisionId;
    }

    constructor(private _service: DivisionsService) {
    }

    getDivision(): void {
        this._service.getDivision(this.divisionId).then(
            division => this.setDivision(division),
            error => this.errorMessage = <any>error
        );
    }

    //ovo je moglo i preko setera ali mi ulazi u beskonacku petlju sa setovanjem samog sebe
    setDivision (div) {
        this.division = div;
        this.emptyGroup = {name: "", classroomID: "-1", GroupsStudents: [], division: this.division };

    }

    // Nesto nije htelo u arrow
    public totalNumberOfStudents() {
        var sum = 0;
        for (let i = 0; i < this.division.Groups.length; i++) {
            sum += this.division.Groups[i].GroupsStudents.length;
        }
        return sum;
    }

    copyDivision() {
        var newDiv;
        console.log("haf");
        this._service.copyDivision(this.divisionId).then(obj => newDiv = obj.division).then(() => console.log(newDiv));
    }

    removeDivision() {
        this._service.deleteDivision(this.division.divisionID)
            .then(any => console.log(any))
            .then(() => this.refreshAssistantPanel({
                shiftMinusOne: true,
            }));
    }

    public refreshAssistantPanel($options) {
        this.update.emit($options);
    }

}