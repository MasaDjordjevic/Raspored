import {Component, Input} from "angular2/core";
import {Student} from "../../models/Student";
import {MatchPipe} from "../../pipes/match.pipe";
import {HighlightPipe} from "../../pipes/highlight.pipe";
import {TrimPipe} from "../../pipes/trim.pipe";


@Component({
    selector: 'student-search',
    template: `
    <div class="list-of-students" *ngIf="students">
        <div class="student-item" *ngFor="let student of students | match: _query ">
            <a (click)="openStudent(student.indexNumber)">
                <span class="index" [innerHTML]="student.indexNumber.toString() | highlight : _query"></span>
                <span class="name" [innerHTML]='student.UniMembers.name + " " + student.UniMembers.surname | highlight: _query'></span>
            </a>
        </div>
    </div>
    <div class="search-button-wrapper">
        <input type="text" [(ngModel)]="_query"/>
    </div>
    `,
    pipes: [MatchPipe, HighlightPipe]
})
export class StudentSearchComponent {
    @Input() primaryColor: string = "MaterialBlue";
    @Input() secondaryColor: string = "MaterialOrange";

    @Input() students: Student[];

    private _query: string;

    public openStudent(indexNumber: number) {
        // TODO Nesto da se desi pametno
        alert(indexNumber);
    }

}