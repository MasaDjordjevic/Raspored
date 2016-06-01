import {
    Component, Directive, Input, Output,
    ContentChildren, EventEmitter, ElementRef,
    AfterContentInit, OnInit
}
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

export class RDropdownItemComponent implements OnInit {

    // Jednoznačno definise opciju
    @Input() public value: string;

    // Redni broj u listi, počinje od nule
    public offset: number;

    // Tekst koji je prikazan kao opcija (u ng-content)
    // Read-only
    get str() {
        return this.element.nativeElement.innerText.trim();
    }

    constructor(
        public _element: ElementRef,
        private _emitter: RDropdownEmitterService
    ) { }

    ngOnInit() { }

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
        public _emitter: RDropdownEmitterService,
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
            <label>{{label}}</label>
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
    providers: [RDropdownEmitterService],
    host: {
        "[value]": "val",
        "(click)": "onClick($event)"
    }
})

export class RDropdownComponent implements AfterContentInit {

    public onClick($event) {
        //console.log($event);
        if (!$event.target.classList.contains("r-dropdown-item")) return; // nastavi samo ako je klik na r-dropdown-item
        //console.log($event.target.parentElement.attributes.value.nodeValue);
        this.valChange.next($event.target.parentElement.attributes.value.nodeValue); // pomozi bog
    }

    @ContentChildren(RDropdownItemComponent) _items:
        QueryList<RDropdownItemComponent>;

    @Input()  val: string;
    @Input()  label: string;
    @Output() valChange: EventEmitter<any> = new EventEmitter<any>();

    public currentSelectedValue: string;
    public currentSelectedStr: string;
    private _currentSelectedOffset: number = 0; // redni broj, počinje od nule

    private _topOffsetStyle = { "top": "calc(1.23ex - 0px - 8px)" };

    set currentSelectedOffset(newOffset: number) {
        if (!newOffset) newOffset = 0;
        this._currentSelectedOffset = newOffset;

        // Prodji kroz sve elemente do i bez offseta i saberi im visine
        // Ove visine uključuju padding, margine, itd. U pikselima.
        var sum = 0;
        //console.log(this._items.toArray());
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

        /**
         * TODO
         * Trenutno ignoriše 0.23ex, taman mu daje malo paddinga. Ako ima smisla raditi,
         * može da se unapredi da se da prozivoljna margina koju mora da zadovolji.
         */
        var parentTop: number = this.element.nativeElement.children[0].getBoundingClientRect().top;
        if (sum > parentTop) {
            sum = parentTop;
        }

        this._topOffsetStyle = {
            "top": `calc(1.23ex - ${sum}px - 1ex)`
        }

    }

    get currentSelectedOffset() {
        return this._currentSelectedOffset;
    }

    private isExpanded: boolean = false;

    constructor(
        public emitter: RDropdownEmitterService,
        public element: ElementRef
    ) {

        this.emitter.get("channel1").subscribe(msg => {
            //console.log(msg);
            this.currentSelectedValue = msg.value;
            this.currentSelectedStr = msg.str;
            this.currentSelectedOffset = msg.offset;
        });

    }

    ngAfterContentInit() {
        var itemsArray = this._items.toArray();
        var len = itemsArray.length;
        for (let i = 0; i < len; i++) {
            var currItem = itemsArray[i];
            // Dodeli offset (redni broj) svima
            currItem.offset = i;

            // Pronadji dete koje ima isti value kao this.val i selektiraj ga
            if (currItem.value === this.val) {
                this.currentSelectedStr = currItem._element.nativeElement.innerText.trim();
                this.currentSelectedValue = currItem.value;
                this.currentSelectedOffset = currItem.offset;
            }
        }

        // Ako nije nadjeno dete koje ime ima isti value kao this.val,
        // selektiramo prvu ponudjenu opciju iz dropdowna.
        console.log(this.currentSelectedValue);
        //debugger;
        if (!this.currentSelectedValue) {
            this.currentSelectedStr = itemsArray[0]._element.nativeElement.innerText.trim();
            this.currentSelectedValue = currItem.value;
            this.currentSelectedOffset = currItem.offset;
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