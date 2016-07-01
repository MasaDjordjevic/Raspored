import {Component, Directive, ElementRef, Input,
    ViewEncapsulation, HostBinding}
    from "angular2/core";

import {NgClass} from "angular2/common";
import {GlobalService} from "../services/global.service";


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
        // themes:
        "[class.red]": "primaryColorClassName === 'red'",
        "[class.yellow]": "primaryColorClassName === 'yellow'",
        "[class.blue]": "primaryColorClassName === 'blue'",
        "[class.orange]": "primaryColorClassName === 'orange'",
        "[class.green]": "primaryColorClassName === 'green'",
        "[class.purple]": "primaryColorClassName === 'purple'",
        "[class.sunset-purple]": "primaryColorClassName === 'sunset-purple'",
        "[class.sunset-red]": "primaryColorClassName === 'sunset-red'",
        "[class.sunset-orange]": "primaryColorClassName === 'sunset-orange'",
        "[class.sunset-yellow]": "primaryColorClassName === 'sunset-yellow'",
        "[class.ice-darkest]": "primaryColorClassName === 'ice-darkest'",
        "[class.ice-darker]": "primaryColorClassName === 'ice-darker'",
        "[class.ice-melted]": "primaryColorClassName === 'ice-melted'",
        "[class.ice-green]": "primaryColorClassName === 'ice-green'",
        "[class.neon-empty]": "primaryColorClassName === 'neon-empty'",
        "[class.neon-diamond]": "primaryColorClassName === 'neon-diamond'",
        "[class.neon-gemstone]": "primaryColorClassName === 'neon-gemstone'",
        "[class.neon-poison]": "primaryColorClassName === 'neon-poison'",
        // additional material (for students):
        "[class.pink]": "primaryColorClassName === 'pink'",
        "[class.purple]": "primaryColorClassName === 'purple'",
        "[class.deep-purple]": "primaryColorClassName === 'deep-purple'",
        "[class.indigo]": "primaryColorClassName === 'indigo'",
        "[class.light-blue]": "primaryColorClassName === 'light-blue'",
        "[class.cyan]": "primaryColorClassName === 'cyan'",
        "[class.teal]": "primaryColorClassName === 'teal'",
        "[class.light-green]": "primaryColorClassName === 'light-green'",
        "[class.lime]": "primaryColorClassName === 'lime'",
        "[class.brown]": "primaryColorClassName === 'brown'",
        "[class.grey]": "primaryColorClassName === 'grey'",
        "[class.blue-grey]": "primaryColorClassName === 'blue-grey'",
    }
})

export class RButtonComponent {

    @Input() primaryColor: string = "MaterialBlue";
    
    get primaryColorClassName(): string {
        return GlobalService.colorClassName(this.primaryColor);
    }

    public nativeElement: HTMLButtonElement;

    constructor(
        private element: ElementRef,
        private _globalService: GlobalService
    ) {
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
