import {Component} from "angular2/core";
import {Assistant} from "../../models/Assistant";
import {R_BUTTON} from "../../ui/r-button.component";
import {R_STEPPER} from "../../ui/r-stepper.component";
import {R_DIALOG} from "../../ui/r-dialog";
import {R_INPUT} from "../../ui/r-input-text.component";
import {R_DROPDOWN} from "../../ui/r-dropdown";
import {R_DL} from "../../ui/r-dl";
import {Control} from "angular2/common";
import {R_MULTIPLE_SELECTOR} from "../../ui/multiple-selector.component";
import {multicast} from "rxjs/operator/multicast";

@Component({
    selector: 'r-assistant-panel-options',
    template: `
    <div style="font-size: 1em; display: flex; justify-content: space-between; flex-wrap: wrap">
    
        <!-- radi -->
        <!--<r-input class="light-theme" label="Labela" [(val)]="inputText" style="width:50%;"></r-input>
        <r-input class="light-theme" label="Labela" [(val)]="inputText" style="width:50%;"></r-input>
        <input [(ngModel)]="inputText" type="text"/>
        <span>{{inputText}}</span>-->
        
        
        <!-- radi -->
        <!--<r-dropdown [(val)]="dropdown" label="Labela bre" style="width:60%;">
            <r-dropdown-item *ngFor="let b of ['b1', 'b2', 'b3', 'b4', 'b5']" [value]="b">{{b + "ooo"}}</r-dropdown-item>
        </r-dropdown>
        
        <div style="width:100%; min-height: 20px;"></div>
        
        <r-dropdown [(val)]="dropdown" label="Labela bre" style="width:60%;">
            <r-dropdown-item *ngFor="let b of ['b1', 'b2', 'b3', 'b4', 'b5']" [value]="b">{{b + "ooo"}}</r-dropdown-item>
        </r-dropdown>
        
        <select [(ngModel)]="dropdown">
            <option value="b1">boob1</option>
            <option value="b2">boob2</option>
            <option value="b3">boob3</option>
            <option value="b4">boob4</option>
            <option value="b5">boob5</option>
        </select>
        
        <span>{{dropdown}}</span>
        
        <div style="width:100%; min-height: 20px;"></div>-->
        
        <!--radi-->
        <r-multiple-selector [(val)]="multipleSelector" style="width:45%" primaryColor="MaterialGreen">
            <r-multiple-selector-item *ngFor="let n of stuff; let i = index" [val]="i">
                <span>{{n.split('').reverse().join('')}}</span>
                <span>{{n.substring(5)}}</span>
            </r-multiple-selector-item>
        </r-multiple-selector>
        
        <r-multiple-selector [(val)]="multipleSelector" style="width:45%" primaryColor="MaterialRed">
            <r-multiple-selector-item *ngFor="let n of stuff; let i = index" [val]="i">
                <span>{{n.split('').reverse().join('')}}</span>
                <span>{{n.substring(5)}}</span>
            </r-multiple-selector-item>
        </r-multiple-selector>
        
        <div style="width:100%; min-height: 20px;"></div>
        
        <span>{{multipleSelector | json}}</span>
        <button (click)="toggle2()">toggle 2</button>
        <button (click)="addNew()">add new</button>
        
        <div style="width:100%; min-height: 20px;"></div>
    </div>
    `,
    styleUrls: ['app/assistant-panel/options/assistant-panel-options.css'],
    directives: [R_BUTTON, R_STEPPER, R_DIALOG, R_INPUT, R_DROPDOWN, R_DL, R_MULTIPLE_SELECTOR],
})

export class AssistantPanelOptionsComponent {

    public inputText: string = "boobs";
    public dropdown: string = "b2";

    public _multipleSelector: string[] = [];

    public get multipleSelector(): string[] {
        return this._multipleSelector;
    }

    public set multipleSelector(m: string[]) {
        this._multipleSelector = m;
    }

    public stuff: string[] = [];

    public randomString = (n) => (Math.random() + 1).toString(36).substring(2, n + 2);

    constructor() {
        for (let i = 0; i < 4; this.stuff[i++] = this.randomString(i * 10 % 7 + 10));
    }

    public toggle2() {
        this.multipleSelector = this.multipleSelector.concat();
        var ind = this._multipleSelector.indexOf("2");
        if (!~ind) this._multipleSelector.push("2");
        else this._multipleSelector.splice(ind, 1);
    }

    public addNew() {
        this.stuff = this.stuff.concat();
        this.stuff.push(this.randomString(10));
    }

    assistant: Assistant;

}