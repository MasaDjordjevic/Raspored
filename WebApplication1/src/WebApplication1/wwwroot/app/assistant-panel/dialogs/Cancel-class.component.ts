import {Component, Input, Pipe, PipeTransform, AfterContentInit} from "angular2/core";
import {TimeSpan} from "../../models/TimeSpan";
import {GroupsService} from "../../services/groups.service";




@Pipe({
    name:'addWeeks',
    purse:false
})
class AddWeeksPipe implements PipeTransform {
    transform(date, weekNumber) {
        //nije htelo normalno pa sam morala ovako da ga ukomplikujem
        //TODO ovo dodaje na taj datum, treba da nadje refentni tom datumu u tekucoj nedelji pa da doda na to
        var ret = new Date((new Date).setDate((new Date(date)).getDate() + 7*weekNumber));
        return ret;
    }
}

@Component({
    selector: 'cancel-class',
    template: `
    <form #form="ngForm" (ngSubmit)="cancelClass(form.value)">
        <label>Za koiko nedelja?</label>
                <input type="text" value="0" #week [(ngModel)]="weekNumber">
                <br>
                <label *ngIf="timespan">To je datum: {{ timespan.startDate | addWeeks : weekNumber}}</label>
                <br>
                ova labela mozda treba da bude input
                <br>
                 
                <input type="text" placeholder="Naslov" ngControl="title">
                <input type="text" placeholder="Sadrzaj" ngControl="content">
               
                <button type="submit">Otkazi</button>
                <!-- TODO na ne da se minimizira dialog -->
                <button r-button flat text="odustani"></button>
    </form>
    `,
    pipes: [AddWeeksPipe],
    providers: [GroupsService],
})
export class CancelClassComponent implements AfterContentInit{
    @Input() timespan: any;
    @Input() groupID: number;
    //zato sto pipe ne okida ako inputu setjem id pa pozivam value od input
    //input kod otkazivanja casa
    weekNumber:number = 0;

    constructor( private _service: GroupsService ) {}

    ngAfterContentInit() {
        //debugger;
    }

    cancelClass(value) {
        this._service.cancelClass(this.groupID, value.title, value.content, this.weekNumber);
    }
}
