import {
    Component, Directive, Input, Output,
    ContentChildren, EventEmitter, ElementRef,
    AfterContentInit, OnInit, AfterViewInit
}
    from "angular2/core";
import {QueryList} from "angular2/src/core/linker/query_list";
import {GlobalService} from "../services/global.service";


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

export class RDropdownItemComponent implements OnInit, AfterViewInit {

    // Jednoznačno definise opciju
    @Input() public value: string;

    // Redni broj u listi, počinje od nule
    public offset: number = 0;

    // Tekst koji je prikazan kao opcija (u ng-content)
    // Read-only
    public get str() {
        return this.element.nativeElement.innerText.trim();
    }

    constructor(
        public _element: ElementRef,
        private _emitter: RDropdownEmitterService
    ) { }

    get element() {
        return this._element;
    }

    ngOnInit() { }

    ngAfterViewInit() {
        //debugger;
        this._emitter.get("channel_item_initialized").emit({
            hello: "hello"
        });
    }

    // on click
    // Na klik samo saljemo event da se nesto kliknulo, nista ne menjamo.
    // Roditeljska komponenta je odgovorna za to da prati ko je selektiran.
    select() {
        this._emitter.get("channel1").emit({
            value: this.value,
            str: this.str,
            offset: this.offset
        });
    }


}





@Component({
    selector: 'r-dropdown',
    template: `
        <div class="r-dropdown" (click)="toggleExpanded()">
            <label [ngClass]="{collapsed: !!val, highlight: isExpanded}">{{label}}<!--<b>collapsed bool</b> {{!!val}} <b>offset</b> {{_currentSelectedOffset}} <b>currVal</b> {{_currentSelectedValue}} <b>inputVal</b> {{val}}--></label>
            <span>{{currentSelectedStr}}</span>
            <div class="line-effect" [ngClass]="{highlight: isExpanded}"></div>
            <div class="r-dropdown-items-wrapper"
                 [class.hidden]="!isExpanded"
                 [ngStyle]="_topOffsetStyle"
            >
                <ng-content></ng-content>
            </div>
        </div>
        <div class="invisible-blackout" *ngIf="isExpanded" (click)="toggleExpanded()"></div>
    `,
    styleUrls: ['app/ui/r-dropdown.css'],
    providers: [RDropdownEmitterService],
    host: {
        "[class]": "primaryColorClassName",
    }
})

export class RDropdownComponent implements AfterContentInit, AfterViewInit {
    
    @Input() primaryColor: string = "MaterialBlue";
    @Input() secondaryColor: string = "MaterialOrange";


    get primaryColorClassName(): string {
        return GlobalService.colorClassName(this.primaryColor);
    }

    @ContentChildren(RDropdownItemComponent) _items:
        QueryList<RDropdownItemComponent>;

    _val: string;

    @Input() set val(v) {
        this._val = v;
        this.select(v);
    }

    get val() {
        return this._val;
    }

    @Input()  label: string;
    @Output() valChange: EventEmitter<any> = new EventEmitter<any>();

    @Input() dropdownType: "material" | "down" | "up" = "down";

    private _currentSelectedValue: string;

    public get currentSelectedValue() {
        return this._currentSelectedValue;
    }

    public set currentSelectedValue(v) {
        this._currentSelectedValue = v;
        //this.select();
        this.valChange.emit(this.currentSelectedValue);
    }

    public currentSelectedStr: string;
    private _currentSelectedOffset: number = 0; // redni broj, počinje od nule

    private _topOffsetStyle: any;

    set currentSelectedOffset(newOffset: number) {
        if (!newOffset) newOffset = 0;
        this._currentSelectedOffset = newOffset;

        // Prilikom otvaranja dropdowna, selektirani item se uvek nalazi na istoj poziciji
        // gde se on nalazi i kada dropdown nije otvoren. Znaci pomera se gore-dole.
        // TODO Ne radi uvek iz nekog razloga, child komponenta nece lepo da postavi sebi offset ponekad.
        if (this.dropdownType === "material") {
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

        // Dropdown se po otvaranju pojavljuje nadole. SHAME
        if (this.dropdownType === "down") {
            var height = this.element.nativeElement.getBoundingClientRect().height;
            var margin = 10;
            var topPx = (height + margin) + "px";

            // TODO shame
            this._topOffsetStyle = {
                "position": "absolute",
                "top": topPx,
                "max-height": "200px", // shame
                "overflow": "auto", // shame
            }
        }

        // Dropdown se po otvaranju pojavljuje nagore. SHAME
        if (this.dropdownType === "up") {
            var height = this.element.nativeElement.getBoundingClientRect().height;
            var margin = 10;
            var topPx = (height + margin) + "px";

            // TODO shame
            this._topOffsetStyle = {
                "position": "absolute",
                "bottom": topPx,
                "max-height": "200px", // shame
                "overflow": "auto", // shame
            }
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
            this.currentSelectedValue = msg.value;
            this.currentSelectedStr = msg.str;
            this.currentSelectedOffset = msg.offset;
        });

        this.emitter.get("channel_item_initialized").subscribe(msg => {
            console.log("primjlen initialized emitter");
            //debugger;
            this.select();
        });

    }

    ngAfterContentInit() {
        this.select();
    }

    // Pronadji dete koje ima isti value kao val [ = this.val] i selektiraj ga
    select(val = this.val) {
        if (!this._items) return;
        var itemsArray = this._items.toArray();
        var len = itemsArray.length;
        setTimeout(() => {
            if (len === 0) return;
            for (let i = 0; i < len; i++) {
                var currItem = itemsArray[i];
                // Dodeli offset (redni broj) svima
                currItem.offset = i;
                (<any>currItem).isus = i;

                // Pronadji dete koje ima isti value kao this.val i selektiraj ga
                if (currItem.value === val) {
                    this.currentSelectedStr = currItem.str;
                    this.currentSelectedValue = currItem.value;
                    this.currentSelectedOffset = currItem.offset;
                }
            }
        }, 1);
    }

    ngAfterViewInit() {
        this.select();
    }

    toggleExpanded() {
        /**
         * Posto su opcije deca elementa koji zove ovu funckiju
         * ajtemi na koje se klikce, klik na njih ce i ugasiti
         * prikaz ajtema.
         */
        console.log("trenutni je" + this.currentSelectedOffset);
        this.currentSelectedOffset = 0; // TODO, zbog ovoga ne radi Material stil
        this.isExpanded = !this.isExpanded;
    }

}

export const R_DROPDOWN = [
    RDropdownComponent,
    RDropdownItemComponent,
];