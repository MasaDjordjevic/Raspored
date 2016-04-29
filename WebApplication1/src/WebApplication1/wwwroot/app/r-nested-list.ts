import {Component, Directive, Input, Output, EventEmitter, AfterViewInit, ChangeDetectorRef} from "angular2/core";

import {INestedList, NestedList} from "./INestedList";

/*
@Component({
    selector: 'r-nested-list-item-inner',
    template: `<ng-content></ng-content>`,
    styleUrls: ['app/r-nested-item-inner.css']
})
export class RNestedListItemInner { }

@Component({
    selector: '[r-nested-list-item-outer]',
    template: `
    <ng-content select="[r-nested-item-outer-title]"></ng-content>
    <div><ng-content></ng-content></div>
`,
    styleUrls: ['app/r-nested-item-outer.css']
})
export class RNestedListItemOuter { }
*/

@Component({
    selector: 'r-nested-list',
    templateUrl: 'app/r-nested-list.html',
    styleUrls: ['app/r-nested-list.css']
})
export class RNestedList implements AfterViewInit {

    @Input() titleString: string = null;
    @Input() data: Array<NestedList> = null;
    @Output() selectItem: EventEmitter<any> = new EventEmitter();

    _selectedID: number = -1;

    constructor(
        private _cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        
    }

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
    // http://stackoverflow.com/a/26476282/2131286
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

        // Ako nista ne pise u height, to je jer dosad nije kliknuto na njega a on je
        // inicijalno prikazan (nije collapsed). Zato moramo da upisemo pravu visinu
        // u height, kao kad otvaramo element (nece biti vidljivo jer auto -> actual).

        // ... Ali ipak ne radi :/

        if (!el.style.height) {
            el.style.height = Array.prototype.reduce.call(
                el.childNodes, function (p, c) {
                    return p + (c.offsetHeight || 0);
                },
                0) + 'px';
        }

        if (el.classList.contains("collapsed")) {
            el.style.height = Array.prototype.reduce.call(
                el.childNodes, function (p, c) {
                    return p + (c.offsetHeight || 0);
                },
                0) + 'px';
            el.classList.remove("collapsed");
        } else {
            el.style.height = '0px';
            el.classList.add("collapsed");
        }
    }

}

export const R_NESTED_LIST_DIRECTIVES: any[] = [RNestedList];
