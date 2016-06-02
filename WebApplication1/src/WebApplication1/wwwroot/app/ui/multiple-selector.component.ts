import {
    Component, Input, ElementRef, EventEmitter, ContentChildren, QueryList, Output,
    AfterViewInit, AfterContentInit
} from "angular2/core";
import {HighlightPipe} from "../pipes/highlight.pipe";
import {R_INPUT} from "./r-input-text.component";



export class RMultipleSelectorEmitterService {

    private _emitters:
        { [channel: string]: EventEmitter<any> } = {};

    get(channel: string): EventEmitter<any> {
        if (!this._emitters[channel])
            this._emitters[channel] = new EventEmitter();
        return this._emitters[channel]
    }

}





@Component({
    selector: 'r-multiple-selector-item',
    template: `
    <div class="checkbox"><i class="fa fa-check"></i></div>
    <ng-content></ng-content>
    `,
    host: {
        "(click)": "select()",
        "[class.selected]": "selected",
        "[style.display]": "display ? 'block' : 'none'",
    },
    pipes: [HighlightPipe],
})

export class MultipleSelectorItemComponent implements AfterViewInit {

    private highlightPipe = new HighlightPipe();

    public initElement: HTMLElement;
    
    public _query: string = "";

    get query() { return this._query;}

    set query(q) {
        this._query = q;
        if (!!q) {
            this._element.nativeElement.innerHTML = this.initElement.innerHTML; // prvo reset
            this.markMatches(this._element.nativeElement); // pa matchujemo string
        } else {
            this._element.nativeElement.innerHTML = this.initElement.innerHTML;
        }
    }

    public markMatches(element) {
        var childNodes = element.childNodes;
        if (element.childNodes.length == 1) {
            var markedText = this.highlightPipe.transform(element.textContent, this.query);
            element.innerHTML = markedText;
            return;
        }
        for (let i = 0; i < childNodes.length; i++) {
            this.markMatches(childNodes[i]);
        }
    }

    // jednoznacno definise opciju
    private _value: string;

    @Input("val") set value(v) {
        this._value = "" + v; // cast u string
    }

    get value() { return this._value }

    // da li je ova opcija selektirana ili ne?
    public selected: boolean;

    // da li da se ova opcija prikaze ili ne?
    // sluzi za filtriranje prilikom pretrage
    public display: boolean = true;

    constructor(
        public _element: ElementRef,
        private _emitter: RMultipleSelectorEmitterService
    ) { }

    ngAfterViewInit() {
        setTimeout(() =>
            this.initElement = this._element.nativeElement.cloneNode(true), // true - klonira u dubinu
        0);
    }

    // on click
    select() {
        this._emitter.get("channel1").emit({
            value: this.value + "",
        });
        this.selected = !this.selected;
    }

}



@Component({
    selector: 'r-multiple-selector',
    template: `
    {{values | json}}<br/>
    <ng-content></ng-content>
    <div class="search">
        <r-input class="light-theme" type="text" [(val)]="query" label="Pretraga"></r-input>
    </div>
    <!--{{query}}<br/>--> 
    <!--{{itemsValueText | json}}-->
    `,
    host: {
        //"[value]": "val",
    },
    providers: [RMultipleSelectorEmitterService],
    directives: [R_INPUT],
    styleUrls: ['app/ui/r-multiple-selector.css'],
})

export class MultipleSelectorComponent implements AfterContentInit {

    @Input() primaryColor: string = "MaterialBlue";
    @Input() secondaryColor: string = "MaterialOrange";

    _values: string[];
    @Output() valChange: EventEmitter<any> = new EventEmitter<any>();

    public itemsValueText: any[] = []; // {value: ___, text: ___}

    // za pretargu
    private _query: string;

    public get query(): string { return this._query; }

    public set query(q) {
        this._query = q;
        var regex = new RegExp(this.query, 'gi');
        for (let i = 0; i < this.itemsValueText.length; i++) {
            this._items.toArray()[i].query = this.query;
            if (!this.query || (<any>this._items.toArray()[i]).selected || (this.itemsValueText[i].text.match(regex))) {
                (<any>this._items.toArray()[i]).display = true;
            } else {
                (<any>this._items.toArray()[i]).display = false;
            }
        }
    }

    get values() {
        console.log("get");
        // this.checkItems(); // poludi TODO
        return this._values;
    }

    @Input("val") set values(v) {
        console.log("set");
        this._values = v;
        this.valChange.next(this._values);
        this.checkItems();
    }

    public toggleOption(val) {
        var index = this.values.indexOf(val);

        if (!~index) {
            this.values.push(val);
        } else {
            this.values.splice(index, 1);
        }

        this.values.sort((a, b) => ( +a - +b )); // da ne bude leksikografsko

        this.valChange.emit(this.values); // TODO test
    }

    @ContentChildren(MultipleSelectorItemComponent) _items:
        QueryList<MultipleSelectorComponent>;

    constructor(
        public emitter: RMultipleSelectorEmitterService,
        public element: ElementRef
    ) {

        this.emitter.get("channel1").subscribe(msg => {
            console.log(msg);
            this.toggleOption(msg.value);
        });

    }

    ngAfterContentInit() {
        // TODO HACK
        setTimeout(() => {
            var itemsArray = this._items.toArray();
            var len = itemsArray.length;
            for (let i = 0; i < len; i++) {
                var currItem: any = itemsArray[i];
                // Napravi niz parova (value, string) koji ce sluziti za pretragu
                //console.log(currItem);
                this.itemsValueText.push({
                    value: currItem.value,
                    text: currItem._element.nativeElement.innerText.trim(),
                });
            }

            this.checkItems();
        }, 0);
    }

    // Pronadji decu ciji se VAL nalazi u VALUES i selektiraj ih
    checkItems() {
        // TODO HACK
        setTimeout(() => {
            var itemsArray = this._items.toArray();
            var len = itemsArray.length;
            for (let i = 0; i < len; i++) {
                var currItem: any = itemsArray[i];
                // Pronadji decu ciji se VAL nalazi u VALUES i selektiraj ih
                if (~this._values.indexOf(currItem.value)) {
                    currItem.selected = true;
                } else {
                    currItem.selected = false;
                }
            }
        }, 0);
    }

}



export const R_MULTIPLE_SELECTOR = [MultipleSelectorComponent, MultipleSelectorItemComponent];


