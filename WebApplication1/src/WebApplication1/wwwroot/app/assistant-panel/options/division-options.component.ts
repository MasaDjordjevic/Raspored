import {Component, Input} from "angular2/core";
import {Division} from "../../models/Division";
import {DivisionsService} from "../../services/divisions.service";


@Component({
    selector: 'r-division-options',
    template: `
    <div *ngIf="division">
        {{division | json}}
    </div>
    {{errorMessage}}
    `,
    styleUrls: ['app/assistant-panel/options/assistant-panel-options.css'],
    providers: [DivisionsService]
})

export class DivisionOptionsComponent {

    division: Division;
    errorMessage: string;

    private _divisionId: number = 0;

    @Input() set divisionId(n: number) {
        this._divisionId = n;
        this.getDivision();
    }

    get divisionId() {
        return this._divisionId;
    }

    constructor(private _service: DivisionsService) { }

    getDivision(): void {
        this._service.getDivision(this.divisionId).then(
            division => this.division = division,
            error => this.errorMessage = <any>error
        );
    }

}