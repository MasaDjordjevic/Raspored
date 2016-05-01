import {Component, Directive, ElementRef, Input,
    ViewEncapsulation, HostBinding}
    from "angular2/core";


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

//TODO Nece <ng-content> kad se primeni direktiva na element.
// Workaround je da se tekst prosledi kao Input, ali je ruzno
// kad se pise :/

@Component({
    selector: 'button[r-button]',
    template: `{{text}}<ng-content></ng-content>`,
    styleUrls: ['app/ui/r-button.css']
})

export class RButtonComponent {

    constructor( ) {}

    @Input() text: string; //TODO vidi gore

}

export const R_BUTTON = [
    RRasiedButtonDirective,
    RFlatButtonDirective,
    RButtonComponent
];
