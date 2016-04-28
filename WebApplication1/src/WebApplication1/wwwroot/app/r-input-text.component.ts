import {Component, Input, Output} from "angular2/core";

@Component({
    selector: "r-input-text",
    template: `
    <label [ngClass]="{collapsed: val != '' || _isFocused}">{{lab}}</label>
    <input type="text" [(ngModel)]="val" (focus)="focus()" (blur)="blur()"/>
    <div [ngClass]="{highlight: _isFocused}"></div>
    `,
    styleUrls: ["app/r-input-text.component.css"],
})
export class RInputText {
    @Input() val: string = "Inicijalna vrednost";
    @Input() lab: string = "Labela";
    private _isFocused: boolean = false;

    focus() {
       this._isFocused = true;
    }

    blur() {
        this._isFocused = false;
    }
}


