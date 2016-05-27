import {Component, Input, OnInit} from "angular2/core";
import {TimetableClassComponent} from "./r-timetable-class.component";
import {ToTimestampPipe} from "../pipes/to-timestamp.pipe";




@Component({
    selector: 'r-timetable-column',
    template: `
    <div class="day-title">{{title}}</div>
    <div class="container">
        <div class="class-wrapper"
            *ngFor="let c of classes"
            [ngStyle]="{'top': ((c.startMinutes - beginningMinutes) * scale) + 'px',
                        'height': ((c.durationMinutes) * scale) + 'px',
                        'left': (c.overlapIndex * 100 / c.overlapNumber) + '%',
                        'width': (100 / c.overlapNumber) + '%'}">
            <r-timetable-class    
                [className]="c.className" 
                [abbr]="c.overlapIndex + '/' + c.overlapNumber"
                [classroom]="c.classroom"
                [assistant]="c.assistant"
                [color]="c.color"
                [type]="c.type"
                [activityContent]="c.activityContent"
                [activityTitle]="c.activityTitle"
                [active]="c.active"
                [announcement]="c.announcement"
                [startMinutes]="c.startMinutes"
                [durationMinutes]="c.durationMinutes"
                [endMinutes]="c.startMinutes + c.durationMinutes"
            >
            </r-timetable-class>
        </div>
    </div>
    `,
    styles: [`
    :host {
        display: block;
        height: 100%;
        position: relative;
    }
    .day-title {
       text-align: center;
       background-color: white;
       position: absolute;
       z-index: 5;
       width: inherit;
       font-size: 1.2em;
       font-weight: bold;
    }
    .container {
        width: 95%;
        left: 2.5%;
        position: relative;
    }
    .class-wrapper {
        position: absolute;
        width: 100%;
    }
    `],
    directives: [TimetableClassComponent],
    pipes: [ToTimestampPipe]
})
export class TimetableColumnComponent implements OnInit {

    @Input() classes: any[]; // niz časova
    // mora da ima startMinutes, durationMinutes

    @Input() title: string; // npr. "ponedeljak"
    @Input() titleAbbr: string; // npr. "pon"

    @Input() beginningMinutes: number; // npr. 07:00 je 420
    @Input() showEvery: number; // npr. prikaži liniju na svakih 15 minuta
    @Input() scale: number; // koliko piksela je jedan minut
    
    constructor() {
    }

    ngOnInit() {

        if (this.classes.length === 0) return;

        // sortiranje
        this.classes.sort(function(a, b) {
            var keyA = a.startMinutes;
            var keyB = b.startMinutes;
            if (keyA < keyB) return -1;
            if (keyA > keyB) return  1;
            return 0;
        });

        // inicijalno su svi samostalni
        for (let i = 0; i < this.classes.length; i++) {
            this.classes[i].overlapNumber = 1;
            this.classes[i].overlapIndex = 0;
            this.classes[i].endMinutes =
                this.classes[i].startMinutes +
                    this.classes[i].durationMinutes;
        }

        var overlapGroupBeginIndex = 0;
        var overlapBegin = this.classes[0].startMinutes;
        var overlapEnd = this.classes[0].endMinutes;

        debugger;

        for (let i = 1; i < this.classes.length; i++) {
            // trenutni se preklapa sa grupom
            if (this.classes[i].startMinutes < overlapEnd) {
                overlapEnd = Math.max(this.classes[i].endMinutes, overlapEnd);
                // svima koji su u grupi, plus ovom na kom smo sad
                // postavljamo overlap podatke
                for (let j = overlapGroupBeginIndex; j <= i; j++) {
                    this.classes[j].overlapNumber = i - overlapGroupBeginIndex + 1;
                    this.classes[j].overlapIndex = j - overlapGroupBeginIndex;
                }
            } else { // nema poklapanja
                overlapGroupBeginIndex = i;
                overlapBegin = this.classes[i].startMinutes;
                overlapEnd = this.classes[i].endMinutes;
            }
        }

    }

}