import {Component, Input, ElementRef} from "angular2/core";
import {ToTimestampPipe} from "../pipes/to-timestamp.pipe";
import {R_BUTTON} from "../ui/r-button.component";
import {Mode} from "./r-timetable.component";
import {StudentsService} from "../services/students.service";
import {GlobalService} from "../services/global.service";
import {ActivityScheduleService} from "../services/activity-schedule.service";
import {R_DIALOG} from "../ui/r-dialog";
import {AddActivityComponent} from "../assistant-panel/dialogs/group-add-activity.component";
import {CancelClassComponent} from "../assistant-panel/dialogs/cancel-class.component";
import {AddTaskComponent} from "../student-panel/dialogs/add-task.component";
import {BulletinBoardComponent} from "../student-panel/bulletin-board/bulletin-board.component";
import {UncancelClassComponent} from "../assistant-panel/dialogs/uncancel-class.component";

@Component({
    selector: 'r-timetable-class',
    templateUrl: 'app/timetable/r-timetable-class.html',
    styleUrls: ['app/timetable/r-timetable-class.css'],
    host: {
        "[style.left]": "expanded ? expandedLeftHost : '0'",
        "[style.top]": "expanded ? expandedTopHost : '0'",
        "[style.width]": "expanded ? expandedWidthHost : '100%'",
        "[style.height]": "expanded ? expandedHeightHost : '100%'"
    },
    pipes: [ToTimestampPipe],
    directives: [R_BUTTON, R_DIALOG, AddActivityComponent, CancelClassComponent, AddTaskComponent, BulletinBoardComponent, UncancelClassComponent],
    providers: [ActivityScheduleService]
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
    @Input() classId: number; // groupId
    @Input() className: string; // "Objektno-orijentisano programiranje"
    @Input() isClass: boolean; // true = class, false = activity
    @Input() abbr: string; // "OOP"
    @Input() classroom: string; // "431", "A1"
    @Input() assistant: string; // "Vladan Mihajlovitj"
    @Input() activityId: number;
    @Input() activityTitle: string; // "Teretana"
    @Input() activityContent: string; // "Samo džim bajo moj"
    @Input() active: boolean = true; // true: defaultno, false: zasivljeno
    @Input() type: string = "predavanje";
    @Input() place: string; // za globalne aktivnosti
    @Input() notifications: {activityContent: string, activityID: number, classroomID: number, place: string, title: string}[];

    // Prikaz
    @Input() color: string;

    get textColor(): string {
        switch (this.color) {
            case "MaterialYellow":
                return "black";
            default:
                return "white";
        }
    }


    private expanded: boolean = false;
    private expandedLeft: any;
    private expandedTop: any;
    private expandedWidth: any;
    private expandedHeight: any;

    private expandedLeftHost: any;
    private expandedTopHost: any;
    private expandedWidthHost: any;
    private expandedHeightHost: any;

    private selectedTab: number = 1;

    public expand($event = null) {
        // Da se ne pozove expandovanje odmah nakon collapse() klikom an dugme (X). Hakic.
        if ($event && $event.target.nodeName === "BUTTON") {
            return;
        }

        if (this.expanded) {
            return;
        }

        this.expanded = true;

        let ratio = .95;

        // Racunamo sirinu i visinu, koliko bi mogli da budu pod uslovom da hocemo
        // da budu .95 maksimalne velicine
        this.expandedWidth = (this.elementRef.nativeElement.parentElement.parentElement.parentElement.parentElement
                .getBoundingClientRect().width - 20); // -20 jer ne smem da predjem u scrollbar
        this.expandedWidth *= ratio;
        this.expandedHeight = (this.elementRef.nativeElement.parentElement.parentElement.parentElement.parentElement
                .getBoundingClientRect().height);
        this.expandedHeight *= ratio;

        // Ceo raspored
        let parentRect = this.elementRef.nativeElement
            .parentElement.parentElement.parentElement.parentElement.getBoundingClientRect();
        // Ovaj element
        let thisRect = this.elementRef.nativeElement.getBoundingClientRect();

        // Dolazimo do gornjeg levog ugla
        this.expandedLeftHost = (+parentRect.left - +thisRect.left);
        this.expandedTopHost = (+parentRect.top - +thisRect.top);

        if (this.expandedWidth < 520 || this.expandedHeight < 520) {
            // Ako je izracunata vrednost premala, ipak idemo od ivice do ivice rasporeda i ne stavljamo margine.
            this.expandedWidth /= ratio;
            this.expandedHeight /= ratio;
        } else {
            // Ako ipak imamo dovoljno mesta za ono sto hocemo, nema potrebe da ga sirimo vise nego sto treba
            this.expandedWidth = 520;
            this.expandedHeight = 520;

            // Pomeramo na sredinu
            this.expandedLeft = (+parentRect.width - this.expandedWidth) / 2;
            this.expandedTop = (+parentRect.height - this.expandedHeight) / 2;
        }

        // Svakako host terba da ide od ivice do ivice
        this.expandedWidthHost = +parentRect.width - 20; // zbog scrollbara
        this.expandedHeightHost = +parentRect.height;

        // dodavanje jedinica
        this.expandedLeft += "px";
        this.expandedTop += "px";
        this.expandedHeight += 'px';
        this.expandedWidth += 'px';
        this.expandedLeftHost += "px";
        this.expandedTopHost += "px";
        this.expandedHeightHost += 'px';
        this.expandedWidthHost += 'px';

    }

    public collapse() {
        this.expanded = false;
    }

    public toggle() {
        if (this.expanded) {
            this.collapse();
        } else {
            this.expand();
        }
    }

    // dodavanje u lični
    public addToPersonal() {
        this._studentsService.unhideClass(this.classId)
            .then(
                response => {
                    switch (response["status"]) {
                        case "uspelo":
                            this._globalService.toast(this._globalService.translate('class_added_to_personal_successful'));
                            break;
                        case "nije uspelo":
                            switch (response["message"]) {
                                case "vec je u licnom":
                                    this._globalService.toast(this._globalService.translate('class_already_in_personal'));
                                    break;
                                default:
                                    this._globalService.toast(this._globalService.translate('error') + ' ' +
                                        this._globalService.translate('class_added_to_personal_unsuccessful'));
                                    debugger;
                                    break;
                            }
                            break;
                        default:
                            this._globalService.toast(this._globalService.translate('error') + ' ' +
                                this._globalService.translate('class_added_to_personal_unsuccessful'));
                            debugger;
                            break;
                    }
                }
            );
        // Ne treba da se zatvori.
    }

    // obrisi aktivnosti
    public deleteActivity() {      
        this._studentsService.deleteActivity(this.activityId)
            .then(response => {
                switch (response.status) {
                    case "uspelo":
                        this._globalService.toast(this._globalService.translate('successfully_deleted_activity'));
                        break;
                    default:
                        this._globalService.toast(this._globalService.translate('error') + " " +
                            this._globalService.translate('activity_not_deleted')); 
                        debugger;
                        break;
                }
            })
            .then(() => {
                this._globalService.refreshStudentPanelPersonal();
            });
    }

    public deleteGlobalActivity() {
        this._activityScheduleService.deleteGlobalActivity(this.activityId)
            .then(status => console.log(status));
    }

    // sakrij cas
    public hideClass() {
        this._studentsService.hideClass(this.classId)
            .then(response => {
                switch (response["status"]) {
                    case "uspelo":
                        this._globalService.toast(this._globalService.translate('class_hidden'));
                        break;
                    default:
                        this._globalService.toast(this._globalService.translate('error'));
                        debugger;
                        break;
                }
            })
            .then(() => {
                setTimeout(() => {
                    this._globalService.refreshStudentPanelPersonal()
                }, 300)
            });
    }    

    constructor(
        private elementRef: ElementRef,
        private _studentsService: StudentsService,
        private _globalService: GlobalService,
        private _activityScheduleService: ActivityScheduleService
    ) {  }

}