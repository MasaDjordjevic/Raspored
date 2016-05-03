import {Component, Directive, Input, Output,
    ContentChildren, EventEmitter, ElementRef,
    AfterContentInit}
        from "angular2/core";
import {QueryList} from "angular2/src/core/linker/query_list";


/**
 * Kratko objašnjenje za servis
 *
 * Treba nam servis jer RDropdownItem treba da svom roditelju
 * posalje svoj value kada bude selektiran. U ovom slucaju to
 * ne mozemo da uradimo pomocu @Output jer RDropdownItemComponent
 * samo propagira stvari nanize.
 *
 * Nemam blage veze sta se ovde desava. Ali evo ga source:
 * http://stackoverflow.com/questions/34802210/angular-2-child-component-events-broadcast-to-parent
 *
 * Taj odgovor je zapravo los (ima bolji, vidi dole).
 * http://plnkr.co/edit/vDa4Uu0tjpg2LIicuoTt?p=preview (nope)
 *   --> http://plnkr.co/edit/RBfa1GKeUdHtmzjFRBLm?p=preview (yup)
 *
 *   TODO
 *   Prebaciti ovo da odgovara ovom odgovoru:
 *   http://stackoverflow.com/a/36990878/2131286
 *
 * Na SO ima stvari deklarisane kao staticke i nisu navedeni
 * provajderi komponenatama, i nisu u konstruktoru.
 * Ispravljeno je u plunku gore.

 * Mada kazu da postoji bolji nacin za obzerverima i DI. Linkovi
 * koji su mi dali, redom:
 * - https://angular.io/docs/ts/latest/guide/dependency-injection.html
 * - https://angular.io/docs/ts/latest/guide/hierarchical-dependency-injection.html
 * - http://blog.thoughtram.io/angular/2015/05/18/dependency-injection-in-angular-2.html
 * - https://github.com/escardin/angular2-community-faq/blob/master/best-practices.md#proper-use-of-eventemitters
 */

export class RDropdownEmitterService {

    private _emitters:
        { [channel: string]: EventEmitter<any> } = {};

    get(channel: string): EventEmitter<any> {
        if (!this._emitters[channel])
            this._emitters[channel] = new EventEmitter();
        return this._emitters[channel]
    }

}

/**
 * Logika kojom ovo radi...
 *
 * Svaka opcija (RDropdownItemComponent) za sebe nema pojma da
 * li je selektirana.
 * Kada se opcija selektira, ona emituje event koji obavestava
 * RDropdownComponent (roditelja).
 * Posto ovaj servis nije singleton (vidi los plunker gore),
 * ovo vidi samo odgovarajuci roditelj (nece sve padajuce liste
 * na stranici da se promene).
 */




@Component({
    selector: 'r-dropdown-item',
    template: `
    <div class="r-dropdown-item" (click)="select()">
        <ng-content></ng-content>
    </div>
    `
})

export class RDropdownItemComponent {

    // Jednoznačno definise opciju
    @Input() public value: string;

    // Redni broj u listi, počinje od nule
    public offset: number;

    // Tekst koji je prikazan kao opcija (u ng-content)
    // Read-only
    get str() {
        return this._element.nativeElement.innerText.trim();
    }

    constructor(
        private _element: ElementRef,
        private _emitter: RDropdownEmitterService
    ) { }

    // on click
    select() {
        this._emitter.get("channel1").emit({
            value: this.value,
            str: this.str,
            offset: this.offset
        });
    }

    get element() {
        return this._element;
    }

}




@Directive({
    selector:'r-dropdown-item[default]'
})

export class RDropdownDefaultItemDirective implements AfterContentInit {

    constructor(
        private _emitter: RDropdownEmitterService,
        private _dropdownItem: RDropdownItemComponent
    ) { }

    ngAfterContentInit() {
        this._emitter.get("channel1").emit({
            value: this._dropdownItem.value,
            str: this._dropdownItem.str,
            offset: this._dropdownItem.offset
        })
    }

}



@Component({
    selector: 'r-dropdown',
    template: `
        <div class="r-dropdown" (click)="toggleExpanded()">
            <span>{{currentSelectedStr}}</span>
            <div class="r-dropdown-items-wrapper"
                 [class.hidden]="!isExpanded"
                 [ngStyle]="_topOffsetStyle"
            >
                <ng-content></ng-content>
            </div>
        </div>
    `,
    styleUrls: ['app/ui/r-dropdown.css'],
    providers: [RDropdownEmitterService]
})

export class RDropdownComponent implements AfterContentInit {

    @ContentChildren(RDropdownItemComponent) _items:
        QueryList<RDropdownItemComponent>;

    public currentSelectedValue: number;
    public currentSelectedStr: string;
    private _currentSelectedOffset: number = 0; // redni broj, počinje od nule

    private _topOffsetStyle = { "top": "calc(1.23ex - 0px - 8px)" };
    set currentSelectedOffset(newOffset: number) {
        if (!newOffset) newOffset = 0;
        this._currentSelectedOffset = newOffset;

        // Prodji kroz sve elemente do i bez offseta i saberi im visine
        // Ove visine uključuju padding, margine, itd. U pikselima.
        var sum = 0;
        console.log(this._items.toArray());
        for (let i = 0; i < this.currentSelectedOffset; i++) {
            let el = this._items.toArray()[i].element.nativeElement;
            el.parentNode.style.display = el.style.display = "block";
            sum += el.getBoundingClientRect().height;
            el.style.display = el.parentNode.style.display = "";
        }

        // Na sumu dodajemo gornji padding trenutnog elementa
        let el = this._items.toArray()[this.currentSelectedOffset].element.nativeElement;
        el.style.dispaly = el.parentNode.style.display = "block";
        // Mora children da ne uzme angular selector nego bas .r-dropdown-item
        sum += parseFloat(window.getComputedStyle(el.children[0]).getPropertyValue("padding-top"));
        el.style.display = el.parentNode.style.display = "";

        this._topOffsetStyle = {
            "top": `calc(1.23ex - ${sum}px - 1ex)`
        }

        //TODO Dodaj korekciju da ne ode van ekrana

    }
    get currentSelectedOffset() {
        return this._currentSelectedOffset;
    }

    private isExpanded: boolean = false;

    constructor(public emitter: RDropdownEmitterService) {

        this.emitter.get("channel1").subscribe(msg => {
            console.log(msg);
            this.currentSelectedValue = msg.value;
            this.currentSelectedStr = msg.str;
            this.currentSelectedOffset = msg.offset;
        });

    }

    ngAfterContentInit() {
        // Dodeli offset (redni broj) svima
        for (let i = 0; i < this._items.toArray().length; i++) {
            this._items.toArray()[i].offset = i;
        }
    }

    toggleExpanded() {
        /**
         * Posto su opcije deca elementa koji zove ovu funckiju
         * ajtemi na koje se klikce, klik na njih ce i ugasiti
         * prikaz ajtema.
         */
        this.isExpanded = !this.isExpanded;
    }

}

export const R_DROPDOWN = [
    RDropdownComponent,
    RDropdownItemComponent,
    RDropdownDefaultItemDirective
];