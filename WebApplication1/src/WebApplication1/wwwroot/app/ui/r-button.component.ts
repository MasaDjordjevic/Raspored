import {Component, Directive, ElementRef, Input,
    ViewEncapsulation, HostBinding}
    from "angular2/core";

import {NgClass} from "angular2/common";


@Directive({
    selector: 'button[r-button][raised]',
})

export class RRasiedButtonDirective {

    isMouseDown: boolean = false;

    //TODO
    @Input() _color: string;

    @HostBinding('class.r-button-raised') private _raised = false;

    constructor (private _el: ElementRef) {
        this._raised = true;
    }

}


@Directive({
    selector: 'button[r-button][flat]',
})

export class RFlatButtonDirective {

    //TODO
    @Input() _color: string;
    
    @HostBinding('class.r-button-flat') private _flat = false;

    constructor (private _el: ElementRef) {
        this._flat = true;
    }

}



@Directive({
    selector: 'button[r-button][fab]',
})
export class RFabButtonDirective {

    //TODO
    @Input() _color: string;

    @HostBinding('class.r-button-fab') private _fab = false;

    constructor (private _el: ElementRef) {
        this._fab = true;
    }

}



//TODO Nece <ng-content> kad se primeni direktiva na element.
// Workaround je da se tekst prosledi kao Input, ali je ruzno
// kad se pise, nemam pojma

// Ovo je bug u beta17, ispravljen je u RC0/1.

@Component({
    selector: 'button[r-button]',
    template: `{{text}}<ng-content></ng-content>`,
    styleUrls: ['app/ui/r-button.css'],
    host: {
        "[class.red]": "primaryColorClassName === 'red'",
        "[class.yellow]": "primaryColorClassName === 'yellow'",
        "[class.blue]": "primaryColorClassName === 'blue'",
        "[class.orange]": "primaryColorClassName === 'orange'",
        "[class.green]": "primaryColorClassName === 'green'",
        "[class.purple]": "primaryColorClassName === 'purple'",
    }
})

export class RButtonComponent {

    @Input() primaryColor: string = "MaterialBlue";

    // TODO ovo se ponavlja svuda
    get primaryColorClassName(): string {
        if (this.primaryColor.indexOf("Material") === 0) {
            return this.primaryColor.substring("Material".length).toLowerCase();
        }
        return "blue";
    }

    public nativeElement: HTMLButtonElement;

    constructor(element: ElementRef) {
        this.nativeElement = element.nativeElement;
    }

    @Input() text: string; //TODO vidi gore

}

export const R_BUTTON = [
    RRasiedButtonDirective,
    RFlatButtonDirective,
    RButtonComponent,
    RFabButtonDirective,
];
