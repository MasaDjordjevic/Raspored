import {Component, AfterContentInit, ContentChildren, Input, ViewEncapsulation} from "angular2/core";
import {R_BUTTON} from "./r-button.component";
import {QueryList} from "angular2/src/core/linker/query_list";

@Component({
    selector: 'r-step',
    template: `
    <div class="r-step-wrapper" *ngIf="isCurrent">
        <ng-content></ng-content>
    </div>
    `
})

export class RStepComponent {

    @Input() public stepTitle: string;
    public isCurrent: boolean = false;

}



@Component({
    selector: 'r-stepper-header',
    template: `
    <div *ngFor="let step of stepTitles; let index = index"
         [class.finished]="currentStep > index + 1"
         [class.current]="currentStep == index + 1"
     >
        <div class="r-stepper-step-circle">{{index + 1}}</div>
        <div class="r-stepper-step-title">{{step}}</div>
    </div>
    `
})

export class RStepperHeaderComponent {

    @Input() stepTitles: Array<string>;
    @Input() currentStep: number = 1;

    constructor() {
    }

}



@Component({
    selector: 'r-stepper',
    template: `
    <!-- Header -->
    <r-stepper-header [stepTitles]="stepsArray" [currentStep]="currentStep"></r-stepper-header>
    <!-- Steps -->
    <div class="r-steps-container">
        <ng-content></ng-content>
    </div>
    <!-- Prev/Next buttons -->
    <div class="r-stepper-footer">
        <button r-button flat [text]="'Nazad'" (click)="goToPrev()" [disabled]="isFirst()">Previous</button>
        <button r-button raised [text]="'Dalje'" (click)="goToNext()" [disabled]="isLast()">Next</button>
    </div>
    `,
    styleUrls: ['app/ui/r-stepper.css'],
    directives: [R_BUTTON, RStepComponent, RStepperHeaderComponent]
})

export class RStepperComponent implements AfterContentInit {

    @ContentChildren(RStepComponent) _steps: QueryList<RStepComponent>;

    private _currentStep: number = 1;

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

    _notifySteps() {
        for (let i = 0; i < this._steps.toArray().length; i++) {
            this._steps.toArray()[i].isCurrent = (this.currentStep == i + 1);
        }
    }

    get stepsArray(): Array<string> {
        var _stepsArray = this._steps.toArray();
        var ret: Array<string> = new Array<string>(_stepsArray.length);
        for (let i = 0; i < _stepsArray.length; i++) {
            ret[i] = _stepsArray[i].stepTitle;
        }
        return ret;
    }

    goToNext() {
        if (!this.isLast()) this.currentStep++;
    }

    goToPrev() {
        if (!this.isFirst()) this.currentStep--;
    }

    finish() {
        alert("Done!");
        //TODO event
    }

    isLast() {
        return this.currentStep == this.totalSteps;
    }

    isFirst() {
        return this.currentStep == 1;
    }

}





export const R_STEPPER = [RStepperComponent, RStepComponent, RStepperHeaderComponent];