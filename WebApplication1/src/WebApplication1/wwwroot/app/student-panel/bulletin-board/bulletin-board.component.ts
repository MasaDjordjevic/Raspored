import {Component, Input} from "angular2/core";
import {R_BUTTON} from "../../ui/r-button.component";
import {R_DROPDOWN} from "../../ui/r-dropdown";
import {R_INPUT} from "../../ui/r-input-text.component";
import {BulletinBoardParametersComponent} from "./bulletin-board-parameters.component";
import {GroupsService} from "../../services/groups.service";
import {BulletinBoardAddAdComponent} from "./bulletin-board-add-ad.component";
import {GlobalService} from "../../services/global.service";



@Component({
    selector: 'r-bulletin-board',
    templateUrl: 'app/student-panel/bulletin-board/bulletin-board.html',
    styleUrls: ['app/student-panel/bulletin-board/bulletin-board.css'],
    directives: [R_BUTTON, R_DROPDOWN, R_INPUT, BulletinBoardParametersComponent, BulletinBoardAddAdComponent],
    providers: [GroupsService]
})

export class BulletinBoardComponent {

    @Input() primaryColor: string = "MaterialBlue";
    @Input() secondaryColor: string = "MaterialOrange";

    private _groupId: number;

    possibleChoices: {adID: number, time: string}[] = <any>[]; // kad bira
    chosenPossibleChoices: {adID: number, time: string}[] = <any>[]; // sta je izabrao kad bira (treba samo jedan da bude) TODO
    allChoices: {groupID: number, time: string}[] = <any>[]; // kad dodaje novi
    chosenAllChoices: {groupID: number, time:string}[] = <any>[]; // sta je izabrao kad dodaje novi

    private clearAll() {
        this.possibleChoices = this.chosenPossibleChoices =
            this.allChoices = this.chosenAllChoices = <any>[];
    }

    @Input() set groupId(id) {
        this._groupId = id;
        this.getPossibleChoices(id);
        this.getAllChoices(id);
    }

    get groupId() {
        return this._groupId;
    }

    constructor(
        private _groupsService: GroupsService,
        private _globalService: GlobalService
    ) { }

    private getPossibleChoices(groupId: number): void {
        this._groupsService.getPossibleBulletinBoardChoices(this.groupId)
            .then(result => {
                this.possibleChoices = <any>result;
            });
    }

    private getAllChoices(groupId: number): void {
        this._groupsService.getAllBulletinBoardChoices(this.groupId)
            .then(result => {
                this.allChoices = <any>result;
                this.chosenAllChoices = this.allChoices.filter(i => i["chosen"]).map(i=>i.groupID).map(String);
            });
    }

}