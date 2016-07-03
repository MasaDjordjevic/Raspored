import {Component, AfterContentInit, ContentChildren, Input, ViewEncapsulation, Output, EventEmitter} from "angular2/core";
import {R_BUTTON} from "./r-button.component";
import {QueryList} from "angular2/src/core/linker/query_list";
import {GlobalService} from "../services/global.service";

@Component({
    selector: 'r-step',
    template: `
    <ng-content></ng-content>
    `,
    host: {
        "[class.show]": "isCurrent",
    }
})

export class RStepComponent {

    @Input() public valid: boolean = true; // ako se nista ne prosledi, true je da bi uopste moglo da se navigira
    @Input() public stepTitle: string = "Još uvek bez dobrog naslova";
    public isCurrent: boolean = false;

}



@Component({
    selector: 'r-stepper-header',
    template: `
    <div *ngFor="let step of stepTitles; let i = index"
        [class.done] = "markAsDone(i)"
        [class.error] = "markAsError(i)"
        [class.finished] = "isPast(i)"
        [class.current] = "isCurrent(i)"
    >
        <div class="r-stepper-step-circle">
            <template [ngIf]="!isPast(i)">{{i + 1}}</template>
            <template [ngIf]="isPast(i) && markAsDone(i)"><i class="fa fa-check"></i></template>
        </div>
        <div class="r-stepper-step-title">{{step}}</div>
    </div>
    `
})

export class RStepperHeaderComponent {

    @Input() stepValids: Array<boolean>;
    @Input() stepTitles: Array<string>;
    @Input() currentStep: number = 1;

    constructor() {
    }

    public isPast = step => step + 1 < this.currentStep;
    public isCurrent = step => step + 1 === this.currentStep;
    public isFuture = step => step + 1 > this.currentStep;
    public isValid = step => this.stepValids[step];

    public markAsDone = step => this.isPast(step) && this.isValid(step);
    public markAsError = step => this.isPast(step) && !this.isValid(step);

}



@Component({
    selector: 'r-stepper',
    template: `
    <!-- Header -->
    <r-stepper-header [stepTitles]="stepTitles" [stepValids]="stepValids" [currentStep]="currentStep"></r-stepper-header>
    <!-- Steps -->
    <div class="r-steps-container">
        <ng-content></ng-content>
    </div>
    <!-- Prev/Next buttons -->
    <div class="r-stepper-footer">
        <button r-button flat [text]="_globalService.translate('back')" (click)="goToPrev()"
                [disabled]="currentIsFirst()" [primaryColor]="primaryColor">{{_globalService.translate('back')}}</button>
        <template [ngIf]="!currentIsLast()">
            <button r-button raised [text]="_globalService.translate('next')"
                    (click)="goToNext()" [disabled]="currentIsLast() || !currentIsValid()"
                    [primaryColor]="primaryColor" >{{_globalService.translate('next')}}</button>
        </template>
        <template [ngIf]="currentIsLast()">
            <button r-button raised [text]="_globalService.translate('create_division')" (click)="submit()"
                    [disabled]="!currentIsLast() || !allAreValid()" [primaryColor]="primaryColor">
                {{_globalService.translate('create_division')}}
            </button>
        </template>
    </div>
    `,
    styleUrls: ['app/ui/r-stepper.css'],
    directives: [R_BUTTON, RStepComponent, RStepperHeaderComponent],
    host: {
        "[class]": "primaryColorClassName",
    }
})

export class RStepperComponent implements AfterContentInit {

    @Input() primaryColor: string = "MaterialBlue";
    @Input() secondaryColor: string = "MaterialOrange";

    get primaryColorClassName(): string {
        return GlobalService.colorClassName(this.primaryColor);
    }

    @Output() onSubmit = new EventEmitter();
    public submit = () => {this.onSubmit.emit("submit")};

    @ContentChildren(RStepComponent) _steps: QueryList<RStepComponent>;

    private _currentStep: number = 1;

    constructor(
        private _globalService: GlobalService
    ) { }

    set currentStep(n: number) {
        this._currentStep = n;
        this._notifySteps();
    }

    get currentStep() {
        return this._currentStep;
    }

    public get totalSteps() {
        return this._steps.toArray().length;
    }

    ngAfterContentInit() {
        this._notifySteps();
    }

    // Obavesti dete tako da zna da je on trenutni (da se prikaže).
    private _notifySteps() {
        for (let i = 0; i < this._steps.toArray().length; i++) {
            console.log(i, this.currentStep);
            this._steps.toArray()[i].isCurrent = (this.currentStep == i + 1);
        }
    }

    // vraca niz objekata koji imaju stepTitle i trenutnu vrednost validnosti podataka.
    get stepsArray(): Array<any> {
        var _stepsArray = this._steps.toArray();
        var ret: Array<any> = new Array<string>(_stepsArray.length);
        for (let i = 0; i < _stepsArray.length; i++) {
            ret[i] = {
                stepTitle: _stepsArray[i].stepTitle,
                valid: _stepsArray[i].valid,
            };
        }
        return ret;
    }

    public get stepTitles(): Array<string> {
        return this.stepsArray.map(i => i.stepTitle);
    }

    public get stepValids(): Array<boolean> {
        return this.stepsArray.map(i => i.valid);
    }

    goToNext() {
        if (!this.currentIsLast())
            this.currentStep++;
    }

    goToPrev() {
        if (!this.currentIsFirst())
            this.currentStep--;
    }

    finish() {
        alert("Done!");
        //TODO event
    }

    public currentIsFirst = () => this.currentStep === 1;
    public currentIsLast = () => this.currentStep === this.totalSteps;
    public currentIsValid = () => this.stepValids[this.currentStep - 1];
    public allAreValid = () => !!this.stepValids.reduce((p, c) => p && c);

}





export const R_STEPPER = [RStepperComponent, RStepComponent, RStepperHeaderComponent];