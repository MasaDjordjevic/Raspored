import {Component} from "angular2/core";
import {TimetableClassComponent} from "./r-timetable-class.component";
import {TimetableColumnComponent} from "./r-timetable-column.component";
import {ToTimestampPipe} from "../pipes/to-timestamp.pipe";
import {R_BUTTON} from "../ui/r-button.component";
import {R_DIALOG} from "../ui/r-dialog";
import {StudentsService} from "../services/students.service";


@Component({
    selector: 'r-timetable',
    template: `
    <template [ngIf]="classes">
    

        <div class="day-titles-fixed">
            <template ngFor let-i [ngForOf]="[0, 1, 2, 3, 4, 5, 6]">
                <div *ngIf="displayDay[i]">{{dayNames[i]}}</div>
            </template>
        </div>

        <div class="time-marks">
            <div *ngFor="let timeStamp of timeStamps"
                 [style.height]="showEvery * scale + 'px'">
                <span>{{timeStamp}}</span>
            </div>
        </div>
        
        <div class="gutter"></div>
        
        <button r-button fab
                text="&#x26A2;"
                id="options-button"
                #optionsButton
                (click)="optionsDialog.open()"></button>
        
        <r-dialog #optionsDialog [source]="optionsButton">
            <div style="padding:2em; height: 600px; width: 600px;">
                <form><fieldset style="padding:.5em">
                    <legend>Prikaz dana u nedelji</legend>
                    <label *ngFor="let day of dayNames; let i = index">
                        <input type="checkbox" [(ngModel)]="displayDay[i]"/>
                        {{day}}
                        <br/>
                    </label>
                </fieldset></form>
                <form><fieldset style="padding:.5em">
                    <legend>Advanced</legend>
                    <label>
                        Beginning minutes ({{beginningMinutes | toTimestamp}})
                        <input type="number" min="0" max="1440" step="5" [(ngModel)]="beginningMinutes"/>
                    </label><br/>
                    <label>
                        Ending minutes ({{endingMinutes | toTimestamp}})
                        <input type="number" min="0" max="1440" step="5" [(ngModel)]="endingMinutes"/>
                    </label><br/>
                    <label>
                        Show every ({{showEvery | toTimestamp}})
                        <input type="number" min="1" max="60" step="1" [(ngModel)]="showEvery"/>
                    </label><br/>
                    <label>
                        Scale
                        <input type="number" min="1" max="10" step=".1" [(ngModel)]="scale"/>
                    </label>
                </fieldset></form>
                <form #form="ngForm" (submit)="addNewActivity(form.value)"><fieldset style="padding:.5em">
                    <legend>Nova lična aktivnost</legend>
                    <label>Dan</label>
                    <select #newActivityDay ngControl="newActivityDay" required>
                        <option *ngFor="let dayName of dayNames; let i = index" [value]="i">{{dayName}}</option>
                    </select> {{newActivityDay.value}}<br/>
                    <label>Početak</label>
                    <input required type="number" min="0" max="1440" step="10" value="730" #newActivityStart ngControl="newActivityStart"/> {{newActivityStart.value | toTimestamp}} <br/>
                    <label>Trajanje</label>
                    <input required type="number" min="1" max="1439" step="1" value="60" #newActivityDuration ngControl="newActivityDuration"/> {{newActivityDuration.value | toTimestamp}} <br/>
                    <label>Naslov</label>
                    <input required type="text" value="Moja Aktivnost" #newActivityTitle ngControl="newActivityTitle"/> {{newActivityTitle.value}} <br/>
                    <label>Opis</label>
                    <textarea required #newActicityDesc ngControl="newActivityDesc">Opis moje aktivnosti.</textarea> {{newActicityDesc.value}} <br/>
                    <button type="submit">Dodaj</button>
                </fieldset></form>
            </div>
        </r-dialog>
        
        
        <template ngFor let-i [ngForOf]="[0, 1, 2, 3, 4, 5, 6]">
            <r-timetable-column
                *ngIf="displayDay[i] && classes[i]"
                [title]="dayNames[i]"
                [titleAbbr]="dayNamesAbbr[i]"
                [classes]="classes[i]"
                [beginningMinutes]="beginningMinutes"
                [showEvery]="showEvery"
                [scale]="scale">
            </r-timetable-column>
        </template>
        
    </template>
    `,
    styleUrls: ['app/timetable/r-timetable.css'],
    providers: [StudentsService],
    directives: [TimetableColumnComponent, R_BUTTON, R_DIALOG],
    pipes: [ToTimestampPipe]
})
export class TimetableComponent {

    beginningMinutes: number = 480; // npr. 07:00 je 420
    endingMinutes: number = 1200; // npr. 20:00 je 1200
    showEvery: number = 15; // npr. prikǎzi liniju na svakih 15 minuta
    scale: number = 2.2; // koliko piksela je jedan minut

    errorMessage: string;
    classes: any[];
    
    get timeStamps(): Array<string> {
        var ret = [];
        var toTimestampPipe = new ToTimestampPipe();
        // Da ne udje u beskonacnu petlju
        if (this.showEvery == 0) return ret;
        for (let min = this.beginningMinutes; min <= this.endingMinutes; min += this.showEvery) {
            ret.push(toTimestampPipe.transform(min));
        }
        return ret;
    };

    constructor(private _studentsService: StudentsService){
        this.getSchedule()
    }

    getSchedule(){
        //TODO prosledi lepo ID
        this._studentsService.getSchedule(2951)
            .then(
                sch => this.classes = sch,
                error => this.errorMessage = error
            ).then(() => this.pom());
    }

    pom(){
        console.log(this.classes);
    }

    dayNames: Array<string> = ["Ponedeljak", "Utorak", "Sreda", "Četvrtak", "Petak", "Subota", "Nedelja"];
    dayNamesAbbr: Array<string> = ["pon", "uto", "sre", "čet", "pet", "sub", "ned"];
    displayDay: Array<boolean> = [true, true, true, true, true, true, false];

    public addNewActivity(value) {
        alert("Sledi mock dodavanje. Implementirati AJAX poziv.");
        var newClass = {
            startMinutes: value.newActivityStart,
            durationMinutes: value.newActivityDuration,
            activityTitle: value.newActivityTitle,
            activityContent: value.newActivityDesc,
            active: true,
            color: "#FF00FF",
        }

        // TODO Ne znam zašto se dole buni Webstorm, TS lepo kompajlira i JS se lepo izvršava.
        var theDay = this.classes[+value.newActivityDay].push(newClass);
    } 

     /*public classes = [
        [
            // ponedeljak
            {startMinutes: 615, durationMinutes: 65, className: "Sistemi baza podataka", abbr: "SBP", classroom: "A2", assistant: "Vlada Mihajlovitj", type: "predavanje", color: "#f44336", active: true},
            {startMinutes: 675, durationMinutes: 45, className: "Sistemi baza podataka", abbr: "SBP", classroom: "A2", assistant: "Clada Mihajlovitj", type: "predavanje", color: "#f44336", active: false},
            {startMinutes: 500, durationMinutes: 90, activityTitle: "Teretana", activityContent: "Moji su bicepsi biseri rasuti po celom benču", color: "#E91E63", active: true},
            {startMinutes: 735, durationMinutes: 45, className: "Veštačka inteligencija", abbr: "VI", classroom: "431", assistant: "Vlada Mihajlovitj", type: "računske", color: "#673AB7", active: true},
            {startMinutes: 840, durationMinutes: 90, className: "Sistemi baza podataka", abbr: "SBP", classroom: "2xx", assistant: "Medica Dobrog Srca", type: "laboratorijske", color: "#f44336", active: true},
            {startMinutes: 930, durationMinutes: 90, className: "Veb programiranje", abbr: "WEB", classroom: "234", assistant: "Ivica Comic Sans", type: "laboratorijske", color: "#2196F3", active: true},
            {startMinutes: 795, durationMinutes: 45, className: "Veštačka inteligencija", abbr: "VI", classroom: "431", assistant: "Vlada Mihajlovitj", type: "računske", color: "#673AB7", active: true},

        ],
        [
            // utorak
            {startMinutes: 495, durationMinutes: 45, className: "Softversko inženjerstvo", abbr: "SWE", classroom: "A2", assistant: "Vlada Mihajlovitj", type: "predavanje", color: "#8BC34A", active: true},
            {startMinutes: 555, durationMinutes: 45, className: "Softversko inženjerstvo", abbr: "SWE", classroom: "A2", assistant: "Vlada Mihajlovitj", type: "predavanje", color: "#8BC34A", active: true},
            {startMinutes: 615, durationMinutes: 45, className: "Mikroračunarski sistemi", abbr: "MIKS", classroom: "222", assistant: "Vlada Mihajlovitj", type: "računske", color: "#FFC107", active: true, announcement: "OVO JE SPARTA!"},
            {startMinutes: 675, durationMinutes: 45, className: "Mikroračunarski sistemi", abbr: "MIKS", classroom: "222", assistant: "Vlada Mihajlovitj", type: "računske", color: "#FFC107", active: true},
            {startMinutes: 900, durationMinutes: 90, className: "Veštačka inteligencija", abbr: "VI", classroom: "2xx", assistant: "Vlada Mihajlovitj", type: "laboratorijske", color: "#673AB7", active: true},
        ],
        [
            // sreda
            {startMinutes: 555, durationMinutes: 45, className: "Veštačka inteligencija", abbr: "VI", classroom: "A2", assistant: "Vlada Mihajlovitj", type: "predavanje", color: "#673AB7", active: true},
            {startMinutes: 615, durationMinutes: 45, className: "Veštačka inteligencija", abbr: "VI", classroom: "A2", assistant: "Vlada Mihajlovitj", type: "predavanje", color: "#673AB7", active: true},
            {startMinutes: 675, durationMinutes: 45, className: "Mikroračunarski sistemi", abbr: "MIKS", classroom: "A3", assistant: "Vlada Mihajlovitj", type: "predavanje", color: "#FFC107", active: true},
            {startMinutes: 735, durationMinutes: 45, className: "Mikroračunarski sistemi", abbr: "MIKS", classroom: "A3", assistant: "Clada Mighahd", type: "predavanje", color: "#FFC107", active: true}
        ],
        [
            // četvrtak
            {startMinutes: 495, durationMinutes: 45, className: "Veb programiranje", abbr: "WEB", classroom: "525", assistant: "Petko Biceps <3", type: "predavanje", color: "#2196F3", active: true},
            {startMinutes: 555, durationMinutes: 45, className: "Veb programiranje", abbr: "WEB", classroom: "525", assistant: "Petko Biceps <3", type: "predavanje", color: "#2196F3", active: true},
            {startMinutes: 615, durationMinutes: 45, className: "Veb programiranje", abbr: "WEB", classroom: "525", assistant: "Petko Biceps <3", type: "računske", color: "#2196F3", active: true},
            {startMinutes: 675, durationMinutes: 45, className: "Veb programiranje", abbr: "WEB", classroom: "525", assistant: "Petko Biceps <3", type: "računske", color: "#2196F3", active: true},
        ],
        [
            // petak
            {startMinutes: 495, durationMinutes: 45, className: "Engleski jezik II", abbr: "ENG2", classroom: "A2", assistant: "Houp Dickovitj", type: "predavanje", color: "#FF5722", active: true},
            {startMinutes: 555, durationMinutes: 45, className: "Engleski jezik II", abbr: "ENG2", classroom: "A2", assistant: "Houp Dickovitj", type: "predavanje", color: "#FF5722", active: true}
        ],
        [
            // subota
        ],
        [
            // nedelja
        ],
    ]*/

}