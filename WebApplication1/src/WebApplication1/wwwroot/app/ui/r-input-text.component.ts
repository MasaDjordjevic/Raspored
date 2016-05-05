import {Component, Input, Output, EventEmitter, AfterViewInit} from "angular2/core";
import {NgForm} from "angular2/common";
import {Control, ControlGroup} from "angular2/common";

// TODO Required ne radi :/
// Moguce resenje:
// http://stackoverflow.com/questions/35212475/how-to-change-html-element-readonly-and-required-attribute-in-angular2-typescrips

@Component({
    selector: "r-input",
    template: `
    <label [ngClass]="{collapsed: val && val != '' || _isFocused}">{{label}}</label>
    <input type="text" [(ngModel)]="val" (focus)="focus()" (blur)="blur()" [ngFormControl]="control" [required]="required ? 'true' : null" #spy/>
    <div class="validation-icon">
        <span *ngIf="control._touched && !control.valid">X</span>
    </div>
    <div class="validation-effect" [class.visible]="control._touched && !control.valid"></div>
    <div class="line-effect" [ngClass]="{highlight: _isFocused}"></div>
    `,
    styleUrls: ["app/ui/r-input-text.component.css"],
    host: {
        "[value]": 'val',
        "(input)": "valChange.next($event.target.value)"
    }
})

export class RInputText implements AfterViewInit {

    @Input() required: boolean = false;
    @Input() control: Control;
    @Input() val: string;
    @Input() label: string = "";
    @Output() valChange: EventEmitter<any> = new EventEmitter<any>();

    ngAfterViewInit() {

    }

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
