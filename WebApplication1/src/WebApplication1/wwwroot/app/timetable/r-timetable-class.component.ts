import {Component, Input, ElementRef} from "angular2/core";
import {ToTimestampPipe} from "../pipes/to-timestamp.pipe";
import {R_BUTTON} from "../ui/r-button.component";
import {Mode} from "./r-timetable.component";
import {StudentsService} from "../services/students.service";
import {GlobalService} from "../services/global.service";

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
        
            <!--{{mode}}
            official {{mode === _Mode.StudentOfficial}}
            global {{mode === _Mode.StudentGlobal}}
            personal {{mode === _Mode.StudentPersonal}}-->
            
            {{classId}}
            {{notifications | json}}
            
        
            <button *ngIf="mode === _Mode.StudentOfficial || mode === _Mode.StudentGlobal && isClass"
                    r-button raised text="Dodaj čas u lični"
                    (click)="addToPersonal()">Dodaj u lični</button>
                    
            <button *ngIf="mode === _Mode.StudentPersonal && !isClass"
                    r-button raised text="Obriši aktivnost"
                    (click)="deleteActivity()">Obriši aktivnost</button>
                    
            <button *ngIf="mode === _Mode.StudentPersonal && isClass"
                    r-button raised text="Sakrij čas"
                    (click)="hideClass()">Sakrij čas</button>
                    
            <button *ngIf="mode === _Mode.StudentPersonal"
                    r-button raised text="Dodaj task"
                    (click)="addTask()">Dodaj task</button>
            
            <button *ngIf="mode === _Mode.AssistantOfficial"
                    r-button raised text="Dodaj obaveštenje"
                    (click)="addAnnouncement()">Dodaj obaveštenje</button>
                    
            <button *ngIf="mode === _Mode.AssistantOfficial"
                    r-button raised text="Otkaži čas"
                    (click)="cancelClass()">Otkaži čas</button>
            
            <button r-button raised text="Oglasna tabla">Oglasna tabla</button>
            <button r-button flat text="Odzumiraj" (click)="toggle()">Odzumiraj</button>
            
        </div>
        
        <b>Message</b> {{message}}
        
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
        "[style.width]": "expanded ? expandedWidth : ''",
        "[style.height]": "expanded ? expandedHeight : ''",
        "[style.boxShadow]": "expanded ? '0 0 0 0.7em ' + color + ' inset' : ''",
        "[style.color]": "expanded ? 'black' : textColor",
        "(click)": "expand($event)",
    },
    pipes: [ToTimestampPipe],
    directives: [R_BUTTON]
})
export class TimetableClassComponent {
    
    @Input() mode: Mode;
    public _Mode = Mode;

    public message: string;

    // Vremena za računanje
    @Input() startMinutes: number; // npr. 07:15 je 435
    @Input() endMinutes: number; // npr. 07:15 je 435
    @Input() durationMinutes: number; // npr. 45

    // Opšti podaci o času
    @Input() classId: number;
    @Input() className: string; // "Objektno-orijentisano programiranje"
    @Input() isClass: boolean; // true = class, false = activity
    @Input() abbr: string; // "OOP"
    @Input() classroom: string; // "431", "A1"
    @Input() assistant: string; // "Vladan Mihajlovitj"
    @Input() announcement: string; // "Obavezno poneti 3D sliku na čas!"
    @Input() activityId: number;
    @Input() activityTitle: string; // "Teretana"
    @Input() activityContent: string; // "Samo džim bajo moj"
    @Input() active: boolean = true; // true: defaultno, false: zasivljeno
    @Input() type: string = "predavanje";
    @Input() notifications: any[];
    
    @Input() groupId: number;

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
    private expandedWidth: string;
    private expandedHeight: string;

    public expand($event = null) {
        // Da se ne pozove expandovanje odmah nakon collapse() klikom an dugme. Hakic.
        if ($event && $event.target.nodeName === "BUTTON") return;
        if (this.expanded) return;
        this.expanded = true;
        this.expandedLeft =
            "-" + (this.elementRef.nativeElement.getBoundingClientRect().left -
                    this.elementRef.nativeElement.parentElement.parentElement.parentElement.parentElement.getBoundingClientRect().left);
        if (this.expandedLeft.charAt(1) === "-")
            this.expandedLeft = this.expandedLeft.substring(2);
        this.expandedLeft += "px";
        this.expandedTop =
            "-" + (this.elementRef.nativeElement.getBoundingClientRect().top -
                    this.elementRef.nativeElement.parentElement.parentElement.parentElement.parentElement.getBoundingClientRect().top);
        if (this.expandedTop.charAt(1) === "-")
            this.expandedTop = this.expandedTop.substring(2);
        this.expandedTop += "px";

        this.expandedWidth = (this.elementRef.nativeElement.parentElement.parentElement.parentElement.parentElement
                .getBoundingClientRect().width - 20) + 'px';
        this.expandedHeight = (this.elementRef.nativeElement.parentElement.parentElement.parentElement.parentElement
                .getBoundingClientRect().height - 20) + 'px';
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
        this._studentsService.unhideClass(this.classId)
            .then(
                response => {
                    console.log("Response: ", response);
                    if (response.status === "uspelo") {

                    } else {
                        // status === "nije uspelo"
                        this.message = response.message;
                    }
                }
            );
    }

    // obrisi aktivnosti
    public deleteActivity() {
        this._studentsService.deleteActivity(this.activityId)
            .then(status => console.log(status));
    }

    // sakrij cas
    public hideClass() {
        // TODO smisli nesto pametno umesto tajmauta
        this._studentsService.hideClass(this.classId)
            .then(status => console.log(status))
            .then(() => setTimeout(() => this._globalService.refreshStudentPanelPersonal(), 1000));
    }

    // dodaj task
    public addTask() {
        //TODO
        /*this._studentsService.addActivity()
            .then(status => console.log(status));*/
    }

    // dodaj obavestenje
    public addAnnouncement() {
        // TODO
        alert("TODO");
    }

    // otkazi cas
    public cancelClass() {
        // TODO
        alert("TODO");
    }
    

    constructor(
        private elementRef: ElementRef,
        private _studentsService: StudentsService,
        private _globalService: GlobalService
    ) {

    }

}