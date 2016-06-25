import {Component, Input, Pipe, PipeTransform, AfterContentInit, Output, EventEmitter} from "angular2/core";
import {TimeSpan} from "../../models/TimeSpan";
import {GroupsService} from "../../services/groups.service";
import {R_DROPDOWN} from "../../ui/r-dropdown";
import {R_INPUT} from "../../ui/r-input-text.component";
import {R_BUTTON} from "../../ui/r-button.component";

import * as moment_ from "../../../js/moment.js";
const moment =  moment_["default"];


@Pipe({
    name: 'addWeeks',
    pure: false
})
class AddWeeksPipe implements PipeTransform {
    transform(date, weekNumber, today) {
        //nije htelo normalno pa sam morala ovako da ga ukomplikujem
        //TODO ovo dodaje na taj datum, treba da nadje refentni tom datumu u tekucoj nedelji pa da doda na to
        // ne treba da se doda na date, nego na datum koji odgovara dateu u tekucoj nedelji
        // pazi na periodu, dodaj 7*periodu dok ne predjes danasnji datum
        var ret = new Date(today.setDate((new Date(date)).getDate() + 7*weekNumber));
        return ret;
    }
}

@Component({
    selector: 'cancel-class',
    template: `
    <span *ngIf="dateChoices && dateChoices.length === 1">
        Otkazivanje časa zakazanog za {{dateChoices[0]}}.    
    </span>
    <r-dropdown *ngIf="dateChoices && dateChoices.length > 1" [label]="'Otkazujem čas koji treba da bude održan...'" [(val)]="cancel.startDate" [primaryColor]="primaryColor">
        <r-dropdown-item *ngFor="let dateChoice of dateChoices; let i = index" [value]="dateChoice">{{dateChoice}}</r-dropdown-item>  
    </r-dropdown>

    <r-input [label]="'Naslov'" [(val)]="cancel.title" [primaryColor]="primaryColor"></r-input>
    <textarea [(ngModel)]="cancel.content"></textarea>
   
    <div class="controls">
        <button r-button flat [text]="'Odustani'" [primaryColor]="primaryColor" (click)="closeMe()">Odustani</button>
        <button r-button raised [text]="'Otkaži čas'" [primaryColor]="primaryColor" (click)="cancelClass()">Otkaži čas</button>    
    </div>
    `,
    pipes: [AddWeeksPipe],
    providers: [GroupsService],
    directives: [R_INPUT, R_DROPDOWN, R_BUTTON],
    styleUrls: ['app/assistant-panel/dialogs/cancel-class.css'],
})
export class CancelClassComponent implements AfterContentInit{

    @Input() primaryColor: string = "MaterialBlue";
    @Input() secondaryColor: string = "MaterialOrange";

    @Output() close: EventEmitter<any> = new EventEmitter<any>();

    public closeMe() {
        this.close.emit("close!");
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
        this._groupsService.getGroup(this.groupId).then(
            group => this.group = group,
            error => this.errorMessage = <any>error
            )
            .then(() => 
                this.group.timeSpan && this.listDateChoices(this.group.timeSpan, this.group.timeSpan.period)
            );
    }



    constructor( private _groupsService: GroupsService ) {}

    cancel:any = {
        title: "",
        content: "",
    };
    dateChoices: string[];

    ngAfterContentInit() {

    }

    // iskopirano u grou-add-activity.component.ts
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
        var timespan:TimeSpan = new TimeSpan;
        timespan.startDate = this.cancel.startDate;
        timespan.endDate = this.cancel.startDate;
        timespan.period = 0;
        this._groupsService.cancelClass(this.groupId, this.cancel.title, this.cancel.content, timespan)
            .then(status => console.log(status));
    }
}
