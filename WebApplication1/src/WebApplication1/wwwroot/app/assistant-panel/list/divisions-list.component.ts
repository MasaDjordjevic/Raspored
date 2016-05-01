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
import {RNestedList} from "../../ui/r-nested-list";

// Interfaces
import {INestedList, NestedList} from "../../INestedList";



@Component({
    selector: 'r-divisions-list',
    template: `
    <r-nested-list
        [titleString]="titleString"
        [data]="nestedListData"
        (selectItem)="onSelect($event)"
    >
    </r-nested-list>
    `,
    styleUrls: ['app/assistant-panel/list/assistant-panel-list.css'],
    directives: [RNestedList],
    providers: [DivisionsService],
})

export class DivisionsListComponent implements OnInit {

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
                    s: this.typeDivisions[i].divisions[j].departmentName,
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
