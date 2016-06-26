import {Component, EventEmitter, Input, Output} from "angular2/core";
import {GroupsService} from "../../services/groups.service";
import {R_INPUT} from "../../ui/r-input-text.component";
import {R_DROPDOWN} from "../../ui/r-dropdown";
import {R_BUTTON} from "../../ui/r-button.component";


@Component({
    selector: 'uncancel-class',
    template: `
    <span *ngIf="times && times.length === 1">
        Opozivanje otkazivanja časa za {{times[0].time}}.    
    </span>
    <r-dropdown *ngIf="times && times.length > 1" [label]="'Opozivam otkazivanje za datum'" [(val)]="selectedAcitvity" [primaryColor]="primaryColor">
        <r-dropdown-item *ngFor="let time of times" [value]="time.activityID">{{time.time}}</r-dropdown-item>  
    </r-dropdown>
    <div class="controls">
        <button r-button flat [text]="'Odustani'" [primaryColor]="primaryColor" (click)="closeMe()">Odustani</button>
        <button r-button raised [text]="'Otkaži otkazivanje'" [primaryColor]="primaryColor" (click)="uncancelClass()">Otkaži čas</button>    
    </div>
    `,
    providers: [GroupsService],
    directives: [R_INPUT, R_DROPDOWN, R_BUTTON],
})
export class UncancelClassComponent {
    @Input() primaryColor: string = "MaterialBlue";
    @Input() secondaryColor: string = "MaterialOrange";

    @Output() close: EventEmitter<any> = new EventEmitter<any>();

    public closeMe() {
        this.close.emit("close!");
    }

    constructor( private _groupsService: GroupsService ) {}

    private times: any[];
    private selectedAcitvity: number;
    private errorMessage;
    private _groupId: number = 0;

    @Input() set groupId(n: number) {
        this._groupId = n;
        this.getCanceledTimes();
    }

    get groupId() {
        return this._groupId;
    }

    getCanceledTimes() {
        this._groupsService.getCanceledTimes(this.groupId)
            .then(
                times => this.times = times,
                error => this.errorMessage = error)
            .then(
                () => this.selectedAcitvity = this.times && this.times[0]
            );
    }

    uncancelClass() {
        debugger;
        this._groupsService.unCancelClass(this.selectedAcitvity)
            .then(response => console.log(response));
    }
}