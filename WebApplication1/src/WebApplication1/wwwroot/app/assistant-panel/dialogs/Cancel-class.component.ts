import {Component, Input, Pipe, PipeTransform, AfterContentInit} from "angular2/core";
import {TimeSpan} from "../../models/TimeSpan";
import {GroupsService} from "../../services/groups.service";
import {R_DROPDOWN} from "../../ui/r-dropdown";
import {R_INPUT} from "../../ui/r-input-text.component";
import {R_BUTTON} from "../../ui/r-button.component";




@Pipe({
    name:'addWeeks',
    purse:false
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
    {{timespan | json}}  
    <r-dropdown [label]="'Otkazujem čas koji treba da bude održan...'" [(val)]="weekNumber" [primaryColor]="primaryColor">
        <template ngFor let-i [ngForOf]="[0, 1, 2, 3]">
            <r-dropdown-item [val]="i">i (ne moze ovo s pajpom)</r-dropdown-item>  
        </template>  
    </r-dropdown>

    <r-input [label]="'Naslov'" [(val)]="title" [primaryColor]="primaryColor"></r-input>
    <textarea [value]="content"></textarea>
   
    <div class="controls">
        <button r-button flat [text]="'Odustani'" [primaryColor]="primaryColor">Odustani</button>
        <button r-button raised [text]="'Otkaži čas'" [primaryColor]="primaryColor">Otkaži čas</button>    
    </div>
    `,
    pipes: [AddWeeksPipe],
    providers: [GroupsService],
    directives: [R_INPUT, R_DROPDOWN, R_BUTTON],
    styleUrls: ['app/assistant-panel/dialogs/cancel-class.css'],
})
export class CancelClassComponent implements AfterContentInit{

    @Input() primaryColor: string = "MaterialGreen";
    @Input() secondaryColor: string = "MaterialOrange";

    @Input() timespan: any;
    @Input() groupID: number;

    // Mora da se pozove samo jednom da se Angular ne bi šlogirao
    today = new Date();

    weekNumber:number = 0;

    constructor( private _service: GroupsService ) {}

    title: string = "";
    content: string = "";

    ngAfterContentInit() {

    }

    cancelClass(value) {
        this._service.cancelClass(this.groupID, this.title, this.content, this.weekNumber);
    }
}
