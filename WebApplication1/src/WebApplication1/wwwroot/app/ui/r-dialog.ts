import {Component, Directive, HostBinding, Input, AfterContentInit, AfterViewInit, ElementRef} from "angular2/core";



@Component({
    selector: 'r-dialog',
    template: `
    <div class="r-dialog-wrapper-outer">
        <div class="r-dialog-wrapper-inner">
            <ng-content></ng-content>
        </div>
    </div>
    `,
    styleUrls: ['app/ui/r-dialog.css']
})

export class RDialogComponent implements AfterContentInit, AfterViewInit {

    @HostBinding('class.visible') private _visible = true;

    @Input() source;

    public nativeElement: HTMLElement;

    public top;
    public left;
    public width;
    public height;

    private _transitionDuration: number = 300; // in milliseconds

    ngAfterContentInit() {
        this.nativeElement.addEventListener("click", (e) => {
            if (e.target == this.nativeElement) {
                this.close();
            }
        });
    }

    ngAfterViewInit() {
        var dialog: HTMLElement = <HTMLElement>this.nativeElement.children[0];

        this.width = dialog.getBoundingClientRect().width;
        this.height = dialog.getBoundingClientRect().height;

        // Top i left racunamo tako da se centrira
        var viewportWidth = document.documentElement.clientWidth;
        var viewportHeight = document.documentElement.clientHeight;
        this.left = (viewportWidth - this.width) / 2;
        this.top = (viewportHeight - this.height) / 2;

        // Cim uzmemo, stavljamo na display: none.
        // Ono je vec na opacity: 0, ali onda je ceo ekran prekriven nevidljivim divom
        // i nista ne moze da se klikne.
        this.nativeElement.style.display = 'none';

        console.log(this.top + " " + this.left + " " + this.width + " " + this.height);
    }

    set visible(v: boolean) {
        if (v) {
            this.nativeElement.style.display = 'block';
        } else {
            this.nativeElement.style.display = 'none';
        }
        this._visible = v;
    }

    get visible(): boolean {
        return this._visible;
    }

    public open() {
        this.visible = true;
        this.setPositionToStart();
        setTimeout(() => { this.setPositionToEnd(); }, 1); // RIP sanity
    }

    public close() {
        this.setPositionToStart();
        setTimeout(() => { this.visible = false; }, this._transitionDuration); // Trajanje tranzicije
    }

    constructor(element: ElementRef) {
        this.nativeElement = element.nativeElement;
    }

    setPositionToStart() {
        var source: HTMLElement = this.source.nativeElement;
        var dialog: HTMLElement = <HTMLElement>this.nativeElement.children[0]; // .r-dialog-wrapper-outer

        dialog.style.transition = this.nativeElement.style.transition =
            `all ${this._transitionDuration / 1000}s ease`;

        this.nativeElement.style.opacity = '0';
        dialog.style.opacity = '0';
        dialog.style.webkitFilter = dialog.style.filter = 'blur(5px)';
        dialog.style.top = source.getBoundingClientRect().top + 'px';
        dialog.style.left = source.getBoundingClientRect().left + 'px';
        dialog.style.width = source.getBoundingClientRect().width + 'px';
        dialog.style.height = source.getBoundingClientRect().height + 'px';
    }

    setPositionToEnd() {
        var dialog: HTMLElement = <HTMLElement>this.nativeElement.children[0]; // .r-dialog-wrapper-outer

        dialog.style.transition = this.nativeElement.style.transition =
            `all ${this._transitionDuration / 1000}s ease`;

        this.nativeElement.style.opacity = '1';
        dialog.style.opacity = '1';
        dialog.style.webkitFilter = dialog.style.filter = 'blur(0px)';
        dialog.style.top = this.top + 'px';
        dialog.style.left = this.left + 'px';
        dialog.style.width = this.width + 'px';
        dialog.style.height = this.height + 'px';
    }

}


export const R_DIALOG = [RDialogComponent];