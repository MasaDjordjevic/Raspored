import {Component, Input, Output, EventEmitter} from "angular2/core";
import {R_BUTTON} from "../../ui/r-button.component";
import {R_DROPDOWN} from "../../ui/r-dropdown";
import {R_INPUT} from "../../ui/r-input-text.component";
import {R_MULTIPLE_SELECTOR} from "../../ui/multiple-selector.component";
import {GroupsService} from "../../services/groups.service";
import {GlobalService} from "../../services/global.service";


@Component({
    selector: 'r-bulletin-board-add-ad',
    templateUrl: 'app/student-panel/bulletin-board/bulletin-board-add-ad.html',
    styleUrls: ['app/student-panel/bulletin-board/bulletin-board-add-ad.css'],
    directives: [R_BUTTON, R_DROPDOWN, R_INPUT, R_MULTIPLE_SELECTOR],
    providers: [GroupsService]
})

export class BulletinBoardAddAdComponent {

    @Input() primaryColor: string = "MaterialBlue";
    @Input() secondaryColor: string = "MaterialOrange";

    @Input() public groupId;

    @Input() public possibleChoices: {groupID: number, time: string}[] = <any>[];
    //@Output() public chosenChoicesChange: EventEmitter<any> = new EventEmitter<any>();

    private _chosenChoices: string[] = <any>[];

    @Input() set chosenChoices(cc) {
        this._chosenChoices = cc;
        //this.chosenChoicesChange.emit(this._chosenChoices);
    }

    get chosenChoices() {
        return this._chosenChoices;
    }
    
    constructor(
        private _groupsService: GroupsService,
        private _globalService: GlobalService
    ) {}
    
    addAd(choices: {groupID: number, time: string[]}[]): void {
        this._groupsService.addAd(this.groupId, this._chosenChoices.map(Number))
            .then(result => {
                //console.log(result)
                switch (result.status) {
                    case "uspelo":
                        this._globalService.toast(this._globalService.translate('adding_ad_successful'));
                        break;
                    default:
                        this._globalService.toast(this._globalService.translate('error') + ' '
                            + this._globalService.translate('adding_ad_unsuccessful'));
                        debugger;
                        break;
                }
            })
            .then(() => {
                this._globalService.refreshStudentPanelOfficial(); 
            });
    }

}