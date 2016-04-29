import {Component, Input, Output, EventEmitter} from "angular2/core";

@Component({
    selector: 'r-list',
    templateUrl: 'app/r-list.html',
    styleUrls: ['app/r-list.css']
})

export class RList {

    @Input() titleString: string = null;
    @Input() data: any = null;
    @Output() selectItem: EventEmitter<any> = new EventEmitter();

    _selectedID: number = -1;

    constructor() { }

    onSelectItem(id: number) {
        this._selectedID = id;
        this.selectItem.emit(id);
    }

    isSelected(id: number) {
        return id === this._selectedID;
    }

}

