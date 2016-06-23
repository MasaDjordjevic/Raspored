import {Component, Input} from "angular2/core";
import {StudentsService} from "../../services/students.service";
import {Student} from "../../models/Student";
import {R_DIALOG} from "../../ui/r-dialog";
import {R_BUTTON} from "../../ui/r-button.component";
import {R_STEPPER} from "../../ui/r-stepper.component";
import {R_DL} from "../../ui/r-dl";
import {TrimPipe} from "../../pipes/trim.pipe";
import {MoveStudentToGroupComponent} from "../dialogs/student-move-to-group.component";


@Component({
    selector: 'r-student-options',
    templateUrl: 'app/assistant-panel/options/student-options.html',
    styleUrls: ['app/assistant-panel/options/assistant-panel-options.css',
                'app/assistant-panel/options/student-options.css'],
    providers: [StudentsService],
    directives: [R_DIALOG, R_BUTTON, R_STEPPER, R_DL, MoveStudentToGroupComponent],
    pipes: [TrimPipe]
})

export class StudentOptionsComponent {
    
    @Input() primaryColor: string = "MaterialBlue";
    @Input() secondaryColor: string = "MaterialOrange";
    @Input() divisionId: number;

    student: any;
    errorMessage: string;

    private _studentId: number = 0;

    @Input() set studentId(n: number) {
        this._studentId = n;
        this.getStudent();
    }

    get studentId() {
        return this._studentId;
    }

    //grupa koja je selektirana trenutno
    @Input() groupId: number;

    constructor(private _service: StudentsService) { }

    getStudent(): void {
        this._service.getStudent(this.studentId).then(
            student => this.student = student,
            error => this.errorMessage = <any>error
        );
    }

    removeFromGroup(){
        //TODO nesto pametnije sa odgovorom
        this._service.removeFromGroup(this.studentId, this.groupId).then(any => console.log(any));
    }

}