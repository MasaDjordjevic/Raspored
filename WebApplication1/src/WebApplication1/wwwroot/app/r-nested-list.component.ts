// Angular2
import {Component, OnInit, Input, Output, EventEmitter} from "angular2/core";

// Interfaces
import {INestedList, NestedList} from "./INestedList";

@Component({
    selector: 'r-nested-list',
    //templateUrl: 'r-nested-list.html',
    //styleUrls: ['r-nested-list.css']
    template: `
<div class="departments-list">
    <div class="title">
        <h2>{{titleString}}</h2>
        <button>?</button>
    </div>
    <span *ngIf="data == undefined">data je undefined</span>
    <span *ngIf="data == null">data je null</span>
<ul *ngIf="data != null && data != undefined">
        <li #li *ngFor="#d of data; #index = index">
            <h3 (click)="expand(li)">
                <span class="outer">{{d.outer.s}}</span>
                <!--<span class="indicator">▲</span>-->
            </h3>
            <ul [class.collapsed]="!index==0">
                <li *ngFor="#inner of d.inner"
                    [class.selected]="true">
                    <a >
                        {{inner.s}}
                    </a>
                </li>
            </ul>
        </li>
    </ul>
</div>

`
})

export class RNestedList implements OnInit {
    @Input() titleString: string = "Title";
    @Input() data: Array<NestedList> = null;
    @Output() selectedItemId: EventEmitter<any> = new EventEmitter();

    ngOnInit() {
        //alert(this.data);
    }

    
}
