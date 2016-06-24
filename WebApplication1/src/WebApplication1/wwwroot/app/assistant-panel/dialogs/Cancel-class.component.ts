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
    <r-dropdown *ngIf="dateChoices && dateChoices.length > 1" [label]="'Otkazujem čas koji treba da bude održan...'" [(val)]="weekNumber" [primaryColor]="primaryColor">
        <r-dropdown-item *ngFor="let dateChoice of dateChoices; let i = index" [value]="i">{{dateChoice}}</r-dropdown-item>  
    </r-dropdown>

    <r-input [label]="'Naslov'" [(val)]="title" [primaryColor]="primaryColor"></r-input>
    <textarea [value]="content"></textarea>
   
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

    private _timespan: any;
    @Input() groupId: number;

    @Input() set timespan(timespan) {
        this._timespan = timespan;
        this.listDateChoices(timespan.startDate, timespan.period);
    }

    get timespan() {
        return this._timespan;
    }

    // Mora da se pozove samo jednom da se Angular ne bi šlogirao
    today = new Date();

    weekNumber: number = 0;

    constructor( private _service: GroupsService ) {}

    title: string = "";
    content: string = "";
    dateChoices: string[];

    ngAfterContentInit() {

    }

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
                choice.add(1, "week");
            }
        }
        this.dateChoices = ret;
        return ret;
    }

    cancelClass() {
        alert('Testirati da li ovo ima veze s mozgom');
        this._service.cancelClass(this.groupId, this.title, this.content, this.weekNumber);
    }
}
