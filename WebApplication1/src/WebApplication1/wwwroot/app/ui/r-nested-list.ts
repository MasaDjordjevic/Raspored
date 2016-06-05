import {Component, Directive, Input, Output, EventEmitter, AfterViewInit, ChangeDetectorRef} from "angular2/core";

import {INestedList, NestedList} from "../INestedList";


@Component({
    selector: 'r-list-inner-item',
    template: `
    <ng-content></ng-content>
    `,
    styleUrls: ['app/ui/r-list-inner-item.css'],
    host: {
        "(click)": "onClick()"
    }
})

export class ListItemComponent {

    @Input() val: string;
    @Output() select = new EventEmitter();

    public onClick() {
        this.select.emit({
            val: this.val,
        })
    }

}



@Component({
    selector: 'r-nested-list-inner',
    template: `
    <div class="list-title" (click)="toggle()">
        <div>{{title}}</div>
        <div class="carat" [class.rotate]="visible">▼</div>
    </div>
    <div class="list-content" [style.display]="visible ? 'block' : 'none'">
        <ng-content></ng-content>
    </div>
    `,
    styleUrls: ['app/ui/r-nested-list-inner.css'],
})

export class NestedListInnerComponent {

    @Input() title: string;

    public visible: boolean = true;


    public toggle() {
        this.visible = !this.visible;
    }

}




@Component({
    selector: 'r-nested-list',
    template: `
    <h2>{{title}}</h2>
    <ng-content></ng-content>
    `,
    styleUrls: ['app/ui/r-nested-list.css'],
    host: {
        "[class]": "classColor",
    }
})

export class NestedListComponent {

    @Input() title: string;
    @Input() primaryColor: string = "MaterialBlue";
    @Input() secondaryColor: string = "MaterialOrange";

    get classColor(): string {
        if (this.primaryColor.indexOf("Material") === 0) {
            return this.primaryColor.substring("Material".length).toLowerCase();
        }
        return "blue";
    }

    public visible: boolean = false;


    public toggle() {
        this.visible = !this.visible;
    }

}


export const R_NESTED_LIST = [
    NestedListComponent,
    NestedListInnerComponent,
    ListItemComponent,
];
