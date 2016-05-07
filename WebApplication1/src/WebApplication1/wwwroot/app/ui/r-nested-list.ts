import {Component, Directive, Input, Output, EventEmitter, AfterViewInit, ChangeDetectorRef} from "angular2/core";

import {INestedList, NestedList} from "../INestedList";

@Component({
    selector: 'r-nested-list',
    templateUrl: 'app/ui/r-nested-list.html',
    styleUrls: ['app/ui/r-nested-list.css']
})

export class RNestedList implements AfterViewInit {

    @Input() titleString: string = null;
    @Input() data: Array<NestedList> = null;
    @Output() selectItem: EventEmitter<any> = new EventEmitter();

    _selectedID: number = -1;

    constructor(
        private _cdr: ChangeDetectorRef
    ) { }

    ngAfterViewInit() {
        this._cdr.detectChanges();
    }

    onSelectItem(id: number) {
        this._selectedID = id;
        this.selectItem.emit(id);
    }

    isSelected(id: number) {
        return id === this._selectedID;
    }

    // Stil

    // Expandovanje innera klikom na outer
    expand(li: HTMLHeadingElement): void {

        // Trazimo dete li-ja, ul.
        var el: HTMLUListElement = null;
        for (var i = 0; i < li.children.length; i++) {
            if ((<HTMLElement>li.children[i]).tagName.toUpperCase() == "H3") {
                li.children[i].classList.toggle("collapsed");
            }
            if ((<HTMLElement>li.children[i]).tagName.toUpperCase() == "UL") {
                el = <HTMLUListElement>li.children[i];
                break;
            }
        }

        if (!el.style.height || el.style.height == "0px") {
            el.style.height = "auto"
        } else {
            el.style.height = "0px";
        }

    }

}
