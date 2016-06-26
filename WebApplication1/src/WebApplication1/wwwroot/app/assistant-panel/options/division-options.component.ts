import {Component, Input, EventEmitter, Output, ViewEncapsulation, AfterViewInit} from "angular2/core";
import {Division} from "../../models/Division";
import {DivisionsService} from "../../services/divisions.service";
import {R_DIALOG} from "../../ui/r-dialog";
import {R_BUTTON} from "../../ui/r-button.component";
import {R_STEPPER} from "../../ui/r-stepper.component";
import {R_DL} from "../../ui/r-dl";
import {DivisionCreatorComponent} from "../dialogs/division-creator.component";
import {TrimPipe} from "../../pipes/trim.pipe";
import {GroupEditComponent} from "../dialogs/group-edit.component";
import {GroupsService} from "../../services/groups.service";
import {DivisionEditComponent} from "../dialogs/division-edit.component";
import {MassGroupEditComponent} from "../dialogs/mass-group-edit.component";
import {GlobalService} from "../../services/global.service";



@Component({
    selector: 'r-division-options',
    templateUrl: 'app/assistant-panel/options/division-options.html',
    styleUrls: [
        'app/assistant-panel/options/assistant-panel-options.css',
        'app/assistant-panel/options/division-options.css',
    ],
    providers: [DivisionsService, GroupsService],
    directives: [R_DIALOG, R_BUTTON, R_STEPPER, R_DL,
        DivisionCreatorComponent, GroupEditComponent, DivisionEditComponent, MassGroupEditComponent],
    pipes: [TrimPipe],
})

export class DivisionOptionsComponent implements AfterViewInit {

    @Input() primaryColor: string = "MaterialBlue";
    @Input() secondaryColor: string = "MaterialOrange";

    @Output() update: EventEmitter<any> = new EventEmitter<any>();

    division: any;
    errorMessage: string;
    emptyGroup: any; //sluzi za dodavanje nove grupe preko edit-group komponente

    private _divisionId: number = 0;

    @Input() set divisionId(n: number) {
        this._divisionId = n;
        this.getDivision();
    }

    get divisionId() {
        return this._divisionId;
    }

    constructor(
        private _service: DivisionsService,
        private _globalService: GlobalService
    ) { }

    getDivision(): void {
        this._service.getDivision(this.divisionId).then(
            division => this.setDivision(division),
            error => this.errorMessage = <any>error
        );
    }

    //ovo je moglo i preko setera ali mi ulazi u beskonacku petlju sa setovanjem samog sebe
    setDivision (div) {
        this.division = div;
        this.emptyGroup = {name: "", classroomID: "-1", GroupsStudents: [], division: this.division };

    }

    // Nesto nije htelo u arrow
    public totalNumberOfStudents() {
        var sum = 0;
        for (let i = 0; i < this.division.Groups.length; i++) {
            sum += this.division.Groups[i].GroupsStudents.length;
        }
        return sum;
    }

    copyDivision() {
        this._service.copyDivision(this.divisionId)
            .then(response => {
                switch(response.status) {
                    case "uspelo":
                        this._globalService.toast(`Uspešno kopirana raspodela *${this.division.name}*.`);
                        break;
                    default:
                        this._globalService.toast(`Došlo je do greške. Nije kopirana raspodela.`);
                        debugger;
                        break;
                }
            })
            .then(() => {
                this._globalService.refreshAssistantPanelAll();
            });
    }

    removeDivision() {
        this._service.deleteDivision(this.division.divisionID)
            .then(response => {
                switch(response.status) {
                    case "uspelo":
                        this._globalService.toast(`Obrisana raspodela *${this.division.name}*.`);
                        break;
                    default:
                        this._globalService.toast(`Došlo je do greške. Brisanje raspodele *${this.division.name}* nije uspelo.`);
                        debugger;
                        break;
                }
            })
            .then(() => {
                this._globalService.refreshAssistantPanelMoveMinusOne();
            });
    }

    public refreshAssistantPanel($options) {
        this.update.emit($options);
    }
        
    public generateCSV() {
        var el: any = document.getElementById("csvExport");
        if (el) {
            var s = "";
            for (let i = 0; i < this.division.Groups.length; i++) {
                s += `${this.division.Groups[i].name}\n`;
                s += `Vreme\t${this.division.Groups[i].timeSpanID}\n`;
                s += `Mesto\t${this.division.Groups[i].classroom && this.division.Groups[i].classroom.number}\n\n`;
                s += 'Indeks\tIme\tPrezime\n';
                for (let j = 0; j < this.division.Groups[i].GroupsStudents.length; j++) {
                    s += `${this.division.Groups[i].GroupsStudents[j].student.indexNumber}\t`;
                    s += `${this.division.Groups[i].GroupsStudents[j].student.UniMembers.name}\t`
                    s += `${this.division.Groups[i].GroupsStudents[j].student.UniMembers.surname}\n`;
                }
                s += '\n\n\n'
            }
            el.value = s;
        }
    }

    ngAfterViewInit() {
        
    }

    public copyToClipboard(el: HTMLTextAreaElement) {
        // Selektiramo sve
        el.selectionStart = 0;
        el.selectionEnd = el.value.length;
        // Probamo da kopiramo selektirano (nece na svakom browseru)
        try {
            document.execCommand("copy");
        } catch (err) {
            console.error("Neuspelo kopiranje :/");
        }
        // Deselektiramo
        el.selectionEnd = 0;
    }

}