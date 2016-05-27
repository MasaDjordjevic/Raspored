import {Component, Input} from "angular2/core";
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
                        'height': ((c.durationMinutes) * scale) + 'px'}">
            <r-timetable-class    
                [className]="c.className"
                [abbr]="c.abbr"
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
export class TimetableColumnComponent {

    @Input() classes: any[]; // niz časova
    // mora da ima startMinutes, durationMinutes

    @Input() title: string; // npr. "ponedeljak"
    @Input() titleAbbr: string; // npr. "pon"

    @Input() beginningMinutes: number; // npr. 07:00 je 420
    @Input() showEvery: number; // npr. prikaži liniju na svakih 15 minuta
    @Input() scale: number; // koliko piksela je jedan minut
    
    constructor() { }

}