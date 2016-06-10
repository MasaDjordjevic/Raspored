import {Component, Input, Output, EventEmitter} from "angular2/core";
import {R_MULTIPLE_SELECTOR} from "../../ui/multiple-selector.component";

@Component({
    selector: 'r-students-selector',
    template: 
    `
    <r-multiple-selector [(val)]="selected" primaryColor="MaterialRed" style="height: 100%; width: 100%; box-sizing: border-box">
        <r-multiple-selector-item *ngFor="let student of students; let i = index" [val]="student.studentID" class="narrow">
            <div class="multiple-selector-item">
                <span class="primary">{{student.UniMembers.name}} {{student.UniMembers.surname}}</span>
                <span class="secondary">
                    <span class="index-number"><i class="fa fa-book"></i><span>{{student.indexNumber}}</span></span>
                    <span class="e-mail"><i class="fa fa-envelope"></i><span>{{student.UniMembers.email}}</span></span>
                </span>
            </div>
        </r-multiple-selector-item>
    </r-multiple-selector>
    `,
    styleUrls: ['app/assistant-panel/dialogs/students-selector.css'],
    directives: [R_MULTIPLE_SELECTOR]
})

export class StudentsSelectorComponent {

    private _selected: any;
    private _students: any;

    @Input() public set selected(s) {
        this._selected = s;
        this.selectedChange.emit(this.selected);
    }

    public get selected() {
        return this._selected
    }

    @Output() selectedChange: EventEmitter<any> = new EventEmitter<any>();;

    @Input() public set students(s) {
        this._students = s;
    }

    public get students() {
        return this._students;
    }

    @Input() primaryColor: string = "MaterialBlue";
    @Input() secondaryColor: string = "MaterialOrange";
    
}

export const R_STUDENT_SELECTOR = [StudentsSelectorComponent];
