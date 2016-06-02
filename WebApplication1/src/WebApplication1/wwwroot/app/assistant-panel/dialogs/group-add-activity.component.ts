import {Component, Input} from "angular2/core";
import {ClassroomsService} from "../../services/classrooms.service";
import {GroupsService} from "../../services/groups.service";
import {TimeSpan} from "../../models/TimeSpan";
import {Course} from "../../models/Course";
import {CoursesService} from "../../services/courses.service";
import {Group} from "../../models/Group";

@Component({
    selector: 'add-activity',
    template: `
    <form #form="ngForm" (ngSubmit)="save(form.value)">
    
        <div>
            <label>Naziv</label>
            <input type="text"  ngControl="title"/>
            <br/>
        </div>          
        
        
        <div style="display: flex; flex-flow: row;">
            <div>
                <label>Mesto</label>
                <input type="text"  ngControl="place"/>
            </div>
            <div>
                <label>Učionica</label>
                <select *ngIf="classrooms" name="classroom" ngControl="classroom" placeholder="Izaberi ucionicu">               
                    <option *ngFor="let classroom of classrooms" [value]="classroom.classroomID" >{{classroom.number}}</option>
                </select>
            </div>
        </div>        
       
       <label>Sadrzaj</label>
        <input type="text"  ngControl="content"/>
       <br/>
       
       <label>Pocetak (2016-02-17T08:15:00)</label>
        <input type="text"  ngControl="timeStart"/>
       <br/>
        
        <label>Kraj</label>
        <input type="text"  ngControl="timeEnd"/>
        <br/>
       
       <label>Perioda</label>
        <input type="text"  ngControl="period"/>
       <br/>
       
        
         <button type="submit">SAVE</button>
    </form>
    `,
    providers: [ClassroomsService, GroupsService]
})
export class AddActivityComponent {

    group: any;
    private classrooms;
    courses: Course[];
    private errorMessage;

    private _groupId: number = 0;

    @Input() set groupId(n: number) {
        this._groupId = n;
        this.getGroup();
    }

    get groupId() {
        return this._groupId;
    }

    getGroup(): void {
        this._groupsService.getGroup(this.groupId).then(
            group => this.group = group,
            error => this.errorMessage = <any>error
        );
    }

    constructor(private _classroomsService: ClassroomsService,
                private _groupsService: GroupsService) {
        this.getClassrooms();

    }


    save(value) {
        var timespan:TimeSpan = new TimeSpan;
        timespan.startDate = value.timeStart;
        timespan.endDate = value.timeEnd;
        timespan.period = value.period;

        this._groupsService.addActivity(this.group.groupID,  value.classroom, value.place, value.title, value.content, timespan );
    }

    getClassrooms() {
        this._classroomsService.getClassrooms()
            .then(
                cls => this.classrooms = cls,
                error => this.errorMessage = <any>error);
    }
}