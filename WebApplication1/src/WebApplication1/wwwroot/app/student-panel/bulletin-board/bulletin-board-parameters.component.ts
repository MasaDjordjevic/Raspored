import {Component, Input, Output, EventEmitter} from "angular2/core";
import {R_INPUT} from "../../ui/r-input-text.component";
import {R_DROPDOWN} from "../../ui/r-dropdown";
import {R_BUTTON} from "../../ui/r-button.component";
import {R_MULTIPLE_SELECTOR} from "../../ui/multiple-selector.component";
import {GroupsService} from "../../services/groups.service";
import {GlobalService} from "../../services/global.service";



@Component({
    selector: 'r-bulletin-board-parameters',
    templateUrl: 'app/student-panel/bulletin-board/bulletin-board-parameters.html',
    styleUrls: ['app/student-panel/bulletin-board/bulletin-board-parameters.css'],
    directives: [R_BUTTON, R_DROPDOWN, R_INPUT, R_MULTIPLE_SELECTOR],
    providers: []
})

export class BulletinBoardParametersComponent {

    @Input() primaryColor: string = "MaterialBlue";
    @Input() secondaryColor: string = "MaterialOrange";

    @Input() groupId: number;

    @Input() public possibleChoices: {adID: number, time: string}[] = <any>[];
    @Output() public chosenChoicesChange: EventEmitter<any> = new EventEmitter<any>();
    
    private _chosenChoices: string[] = <any>[];
    
    @Input() set chosenChoices(chosenChoices) {
        this._chosenChoices = chosenChoices;
        this.chosenChoicesChange.emit(this._chosenChoices);
    }

    get chosenChoices() {
        return this._chosenChoices;
    }

    constructor(
        private _groupsService: GroupsService,
        private _globalService: GlobalService
    ) {}

    public exchangeWith() {
        this._groupsService.exchangeStudents(this.groupId, this.chosenChoices.map(Number)[0])
            .then(response => {
                switch (response.status) {
                    case "uspelo":
                        this._globalService.toast(this._globalService.translate('exchange_successful'));
                        break;
                    default:
                        this._globalService.toast(this._globalService.translate('error') + ' ' +
                            this._globalService.toast(this._globalService.translate('exchange_not_successful')));
                        break;
                }
            })
            .then(() => {
                this._globalService.refreshStudentPanelOfficial();
            });
    }
    
}