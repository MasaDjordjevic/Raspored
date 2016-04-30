import {Component, OnInit} from "angular2/core";
import {CORE_DIRECTIVES} from "angular2/src/common/directives/core_directives";

import {ClassroomsService} from '../services/classrooms.service';
import {Classroom} from '../models/Classroom';

@Component({
    selector: "r-admin-classrooms",
    templateUrl: "app/admin/admin.classrooms.component.html",
    styles: [".floor {display:inline; width: 200px;}"],
    providers: [ClassroomsService],
    directives: CORE_DIRECTIVES
})
export class AdminClassroomsComponent implements OnInit {
    classrooms: Classroom[];
    newClassroom: Classroom;
    errorMessage: string;
    classroomsFloors = new Array<{
        floor: string,
        classrooms: Classroom[]
        }>();
       
    

    constructor(private _service: ClassroomsService) {}
    
    ngOnInit() {
        this.resetNewClassroom();
        this.getClassrooms();
    }

    getClassrooms() {
        this._service.getClassrooms()
            .then(
            cls => this.classrooms = cls,
            error => this.errorMessage = <any>error)
            .then (a=>this.sortClassrooms());
    }

    sortClassrooms() {
        for(var i=0; i< this.classrooms.length; i++) {
            this.addClassromFloor(this.classrooms[i]);
        }
    }

    addClassromFloor(classroom: Classroom) {
        var floor = classroom.number[0];
        if (isNaN(Number(floor)))
            floor = "Ostalo";

        var index = this.findIndex(floor);
        if (index === -1) {
            var cs: Classroom[] = new Array<Classroom>();
            cs.push(classroom);
            var newEl = { floor: floor, classrooms: cs };
            this.insertElement(newEl, this.classroomsFloors, this.veceFloors);
        } else {
            this.insertElement(classroom, this.classroomsFloors[index].classrooms, this.veceClassrooms);
        }
    }

    insertElement(element, list, operation) {
        for (var i = list.length - 1; i >= 0; i--) {
            if (operation(element, list[i])) {
                list[i + 1] = element;
                return;
            } else {
                list[i + 1] = list[i];
            }
        }
        list[0] = element;
    }

    veceFloors(a, b) {
        return a.floor > b.floor;
    }

    veceClassrooms(a: Classroom, b: Classroom) {
        return a.number > b.number;
    }

    findIndex(floor: string): number {
        for (var i=0; i<this.classroomsFloors.length; i++) {
            if (this.classroomsFloors[i].floor === floor)
                return i;
        }
        return -1;
    }

    addClassroom() {
        if (this.newClassroom == null || this.newClassroom.number === null) {
            alert("Unesi broj ucionice");
            return;
        }

        this._service.addClassroom(this.newClassroom.number, this.newClassroom.projector, this.newClassroom.sunnySide)
            .then(
                cls => this.addCls(cls),
                error => this.errorMessage = <any>error);
            
        
        this.resetNewClassroom();
    }

    addCls(cls: Classroom) {
        this.classrooms.push(cls);
        this.addClassromFloor(cls);
    }

    resetNewClassroom() {
        this.newClassroom = new Classroom();
    }
}
