import {
    Component, Input, ElementRef, EventEmitter, ContentChildren, QueryList, Output,
    AfterViewInit, AfterContentInit
} from "angular2/core";
import {HighlightPipe} from "../pipes/highlight.pipe";



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
    <ng-content></ng-content>
    `,
    host: {
        "(click)": "select()",
        "[class.selected]": "selected",
        "[style.display]": "display ? 'block' : 'none'",
    },
    styleUrls: ['app/ui/r-multiple-selector.css'],
    pipes: [HighlightPipe],
})

export class MultipleSelectorItemComponent implements AfterViewInit {

    private highlightPipe = new HighlightPipe();

    public initInnerHTML: string;
    
    public _query: string = "";

    get query() { return this._query;}

    set query(q) {
        this._query = q;
        if (!!q) this._element.nativeElement.innerHTML = this.highlightPipe.transform(this.initInnerHTML, this.query);
        else this._element.nativeElement.innerHTML = this.initInnerHTML;
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
            this.initInnerHTML = this._element.nativeElement.innerHTML,
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
    <input type="text" [(ngModel)]="query"/>
    {{query}}<br/>
    {{itemsValueText | json}}
    <br/>
    `,
    host: {
        //"[value]": "val",
    },
    providers: [RMultipleSelectorEmitterService],
})

export class MultipleSelectorComponent implements AfterContentInit {

    @Input("val") _values: string[];
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
            if (!this.query || (<any>this._items.toArray()[i]).selected || this.itemsValueText[i].text.match(regex)) {
                (<any>this._items.toArray()[i]).display = true;
            } else {
                (<any>this._items.toArray()[i]).display = false;
            }
        }
    }

    get values() { return this._values; }

    set val(v) {
        this._values = v;
        this.valChange.next(this._values);
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

                // Pronadji decu ciji se VAL nalazi u VALUES i selektiraj ih
                if (~this.values.indexOf(currItem.value)) {
                    currItem.selected = true;
                }
            }
        }, 0);
    }

}



export const R_MULTIPLE_SELECTOR = [MultipleSelectorComponent, MultipleSelectorItemComponent];


