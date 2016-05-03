import {Component, Input, Output, EventEmitter} from "angular2/core";



@Component({
    selector: "r-input",
    template: `
    <label [ngClass]="{collapsed: val != '' || _isFocused}">{{label}}</label>
    <input type="text" [(ngModel)]="val" (focus)="focus()" (blur)="blur()"/>
    <div [ngClass]="{highlight: _isFocused}"></div>
    `,
    styleUrls: ["app/ui/r-input-text.component.css"],
    host: {
        "[value]": 'val',
        "(input)": "valChange.next($event.target.value)"
    }
})

export class RInputText {

    @Input() val: string = "Inicijalna vrednost";
    @Input() label: string = "Labela";
    @Output() valChange: EventEmitter<any> = new EventEmitter<any>();

    // Internal stuff
    private _isFocused: boolean = false;

    focus() {
       this._isFocused = true;
    }

    blur() {
        this._isFocused = false;
    }
}


export const R_INPUT = [RInputText];
