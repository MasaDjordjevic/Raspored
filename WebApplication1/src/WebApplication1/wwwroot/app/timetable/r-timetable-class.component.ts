import {Component, Input, ElementRef} from "angular2/core";
import {ToTimestampPipe} from "../pipes/to-timestamp.pipe";
import {R_BUTTON} from "../ui/r-button.component";

@Component({
    selector: 'r-timetable-class',
    template: `
    <span class="times">
        <span class="start">{{startMinutes | toTimestamp}}</span> — <span class="end">{{endMinutes | toTimestamp}}</span>
    </span>
    <template [ngIf]="abbr && classroom">
        <span class="title">
            <template [ngIf]="!expanded">{{abbr}}</template>
            <template [ngIf]="expanded">{{className}}</template>
            u
            {{classroom}}
        </span>
        <span class="type">{{type}}</span>
        <span class="assistant">{{assistant}}</span>
    </template>
    <template [ngIf]="activityContent && activityTitle">
        <span class="title">{{activityTitle}}</span>
        <span class="text">{{activityContent}}</span>
    </template>
    <template [ngIf]="announcement">
        <button r-button raised class="announcement-button" text="!" [title]="announcement">!</button>
    </template>
    <template [ngIf]="expanded">
        <div class="controls">
            <button r-button raised text="Dodaj u lični" (click)="addToPersonal()">Dodaj u lični</button>
            <button r-button flat text="Odzumiraj" (click)="toggle()">Odzumiraj</button>
        </div>
    </template>
    `,
    styleUrls: ['app/timetable/r-timetable-class.css'],
    host: {
        "[style.backgroundColor]": "color",
        //"[style.color]": "textColor",
        "[style.opacity]": "active ? 1 : 0.5",
        "[class.expanded]": "expanded",
        "[style.left]": "expanded ? expandedLeft : ''",
        "[style.top]": "expanded ? expandedTop : ''",
        "[style.boxShadow]": "expanded ? '0 0 0 0.7em ' + color + ' inset' : ''",
        "[style.color]": "expanded ? 'black' : textColor",
        "(click)": "expand($event)",
    },
    pipes: [ToTimestampPipe],
    directives: [R_BUTTON]
})
export class TimetableClassComponent {

    // Vremena za računanje
    @Input() startMinutes: number; // npr. 07:15 je 435
    @Input() endMinutes: number; // npr. 07:15 je 435
    @Input() durationMinutes: number; // npr. 45

    // Opšti podaci o času
    @Input() className: string; // "Objektno-orijentisano programiranje"
    @Input() abbr: string; // "OOP"
    @Input() classroom: string; // "431", "A1"
    @Input() assistant: string; // "Vladan Mihajlovitj"
    @Input() announcement: string; // "Obavezno poneti 3D sliku na čas!"
    @Input() activityTitle: string; // "Teretana"
    @Input() activityContent: string; // "Samo džim bajo moj"
    @Input() active: boolean = true; // true: defaultno, false: zasivljeno
    @Input() type: string = "predavanje";

    // Prikaz
    @Input() color: string;
    get textColor(): string {
        try {
            // Detektuje da li je boja pozadine previse tamna
            var c = this.color.substring(1); // skini # iz stringa boje pozadine
            var rgb = parseInt(c, 16);   // konvertuj rrggbb u decimalni
            var r = (rgb >> 16) & 0xff;  // uzmi crvenu (R)
            var g = (rgb >> 8) & 0xff;  // uzmi zelenu (G)
            var b = (rgb >> 0) & 0xff;  // uzmi plavu  (B)
            var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
            if (luma < 100) {
                return "white";
            } else {
                return "black";
            }
        } catch (e) {
            return "black";
        }
    }

    private expanded: boolean = false;
    private expandedLeft: string;
    private expandedTop: string;

    public expand($event = null) {
        // Da se ne pozove expandovanje odmah nakon collapse() klikom an dugme. Hakic.
        if ($event && $event.target.nodeName === "BUTTON") return;
        if (this.expanded) return;
        this.expanded = true;
        this.expandedLeft = "-" + this.elementRef.nativeElement.getBoundingClientRect().left;
        if (this.expandedLeft.charAt(1) === "-")
            this.expandedLeft = this.expandedLeft.substring(2);
        this.expandedLeft += "px";
        this.expandedLeft = `calc(5vw + ${this.expandedLeft})`;
        this.expandedTop = "-" + this.elementRef.nativeElement.getBoundingClientRect().top;
        if (this.expandedTop.charAt(1) === "-")
            this.expandedTop = this.expandedTop.substring(2);
        this.expandedTop += "px";
        this.expandedTop = `calc(5vh + ${this.expandedTop})`;
    }

    public collapse() {
        this.expanded = false;
    }

    public toggle() {
        if (this.expanded) this.collapse();
        else this.expand();
    }

    // dodavanje u lični
    public addToPersonal() {
        // TODO
        alert("TODO");
    }

    constructor(
        private elementRef: ElementRef
    ) {

    }

}