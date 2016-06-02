// Angular2
import {Component, OnInit, Output, Input, EventEmitter} from "angular2/core";
import {Location} from "angular2/platform/common.d";

// Components
import {DepartmentOptionsComponent} from "./../options/department-options.component";
import {GroupsListComponent} from "./groups-list.component";

// Services
import {DivisionsService} from '../../services/divisions.service';

// Models
import {TypeDivisions} from '../../models/TypeDivisions';
import {Division} from '../../models/Division';

// UI
import {R_NESTED_LIST} from "../../ui/r-nested-list";

// Interfaces
import {INestedList, NestedList} from "../../INestedList";



@Component({
    selector: 'r-divisions-list',
    template: `    
    <r-nested-list title="Raspodele" [primaryColor]="primaryColor" [secondaryColor]="secondaryColor">
        <r-nested-list-inner *ngFor="let typeDivision of typeDivisions" [title]="typeDivision.type">
            <r-list-inner-item
                *ngFor="let division of typeDivision.divisions"
                [value]="division.divisionID"
                (click)="onSelect(division.divisionID)"
                [class.selected]="division.divisionID === selectedDivisionId"
            >
                <pre>{{division.course}}</pre>
            </r-list-inner-item>
        </r-nested-list-inner>
    </r-nested-list>
    `,
    styleUrls: ['app/assistant-panel/list/assistant-panel-list.css'],
    directives: [R_NESTED_LIST],
    providers: [DivisionsService],
})

export class DivisionsListComponent implements OnInit {

    @Input() primaryColor: string = "MaterialBlue";
    @Input() secondaryColor: string = "MaterialOrange";

    typeDivisions: TypeDivisions[];
    errorMessage: string;
    titleString: string = "Raspodele";

    // ID trenutno selektirane raspodele (division) iz liste.
    private _selectedDivisionId: number;
    set selectedDivisionId(n: number) {
        this._selectedDivisionId = n;
        this.selectDivision.emit(this._selectedDivisionId);
    }
    get selectedDivisionId() { return this._selectedDivisionId; }


    // ID smera (department) sluzi da znamo koje raspodele (division) da prikazemo.
    // Svako postavljanje novog ID-ja pribavlja raspodele.
    // Promene obavljaju funkcije onSelect(id) i onDeselect (postavlja na -1).
    private _selectedDepartmentId: number;

    @Input() set selectedDepartmentId(n: number) {
        this._selectedDepartmentId = n;
        this.getDivisionsByType();
    }

    get selectedDepartmentId() {
        return this._selectedDepartmentId;
    }

    @Output() selectDivision: EventEmitter<any> = new EventEmitter();

    onSelect(divisionID: number) { this.selectedDivisionId = divisionID;  }
    onDeselect() { this.selectedDivisionId = -1;  }


    // Za slanje komponenti RNestedList, moramo da prevedemo typeDivisions
    // u odgovarajuci format. Svaki put kada neko zatrazi nestedListData,
    // getter radi prevodjenje.
    private _nestedListData = null;

    get nestedListData() {
        if (!this.typeDivisions) return;
        if (!this._nestedListData)
            this._nestedListData = new Array<NestedList>();
        this._nestedListData = this._nestedListData.slice(0, this.typeDivisions.length);
        for (let i = 0; i < this.typeDivisions.length; i++) {
            if (!this._nestedListData[i])
                this._nestedListData[i] = new NestedList;
            this._nestedListData[i].outer = {
                s: this.typeDivisions[i].type,
                id: this.typeDivisions[i].type
            };
            if (!this._nestedListData[i].inner)
                this._nestedListData[i].inner = [];
            this._nestedListData[i].inner = this._nestedListData[i].inner.slice(0, this.typeDivisions[i].divisions.length)
            for (let j = 0; j < this.typeDivisions[i].divisions.length; j++) {
                this._nestedListData[i].inner[j] = {
                    s: this.typeDivisions[i].divisions[j].creatorName + " " + this.typeDivisions[i].divisions[j].beginning,
                    id: this.typeDivisions[i].divisions[j].divisionID
                };
            }
        }
        return this._nestedListData;
    }

    set nestedListData(data) {
        this._nestedListData = data;
    }


    constructor (
        private _divisionsService: DivisionsService
    ) { }

    ngOnInit() {
        this.getDivisionsByType();
    }

    getDivisionsByType() {
        this._divisionsService.getDivisionsByType(this._selectedDepartmentId)
            .then(
            divs => this.typeDivisions = divs,
            error => this.errorMessage = <any>error);
    }
    
}
