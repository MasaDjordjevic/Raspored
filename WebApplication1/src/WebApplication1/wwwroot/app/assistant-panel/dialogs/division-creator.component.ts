import {Component, OnInit, Input, AfterViewInit} from "angular2/core";
import {R_STEPPER} from "../../ui/r-stepper.component";
import {R_BUTTON} from "../../ui/r-button.component";
import {R_INPUT} from "../../ui/r-input-text.component";
import {R_DROPDOWN} from "../../ui/r-dropdown";
import {Control} from "angular2/common";
import {Course} from "../../models/Course";
import {CoursesService} from "../../services/courses.service";
import {DivisionsService} from "../../services/divisions.service";
import {Group} from "../../models/Group";
import {Student} from "../../models/Student";
import {TypeDivisions} from "../../models/TypeDivisions";
import {DivisionType} from "../../models/DivisionType";
import {bindDirectiveAfterViewLifecycleCallbacks} from "angular2/src/compiler/view_compiler/lifecycle_binder";

/**
 * Za pravljenje nove raspodele (division), neophodno je znati sledeće:
 *  - ID asistenta koji kreira raspodelu. Ovo je dostupno na osnovu
 *    korisnika koji je trenutno ulogovan.
 *  + Predmet (course) za koji se raspodela kreira. Ovo korisnik treba
 *    da izabere iz padajućeg menija. Padajući meni se kreira na osnovu
 *    smera (department) koji je trenutno aktivan na asistentskom panelu.
 *  + Vreme važenja raspodele (beginning i ending). Podrazumevano će
 *    raspodela važiti od početka do kraja tekućeg semestra.
 *  + Treba izabrati i tip podele (za račuske vežbe, za predavanja, za
 *    laboratorijske vežbe, itd).
 *
 * Prilikom kreiranja, korisnik može izabrati da kreira praznu raspodelu
 * (u tom slučaju su neophodne stvari opisane gore), ali može i automatski
 * kreirati grupe, na jedan od dva načina (podeli na X i podeli da ima X).
 * U tom slučaju prilikom kreiranja raspodele treba kreirati i odgovarajući
 * broj grupa sa odgovarajućim brojem studenata. Prilikom kreiranja,
 * korisnik ima sledeće opcije:
 *  + Izbor "podeli na X" ili "podeli da ima X".
 *  + Izbor broja X u oba slučaja.
 *  + Izbor redosleda studenata u grupama (po broju indeksa ili nasumice).
 *
 * Korisnik pre potvrđivanja treba da ima pregled promena koje će kreirati.
 *
 * Korisniku treba vizuelno prikazati proces izvršenja zahteva na serveru,
 * kao i odgovarajuću poruku nakon završetka obrade. Ukoliko zahtev nije
 * uspešan, dati izbor:
 *  - Ponovno slanje istih podataka.
 *  - Vraćanje na početak forme za kreiranje nove raspodele (brišu se svi
 *    uneti podaci).
 *  - Potpuni izlazak iz forme (povratak na asistentski panel).
 */

@Component({
    selector: 'r-division-creator',
    styles: [`
        form { padding: 3em; }
        fieldset { padding: 1em; margin: 1em; }
    `],
    template: `
    <form #form="ngForm" (ngSubmit)="createInitialDivision(form.value)">
        
        <fieldset ngControlGroup="firstPart">
            <label for="divisionName">Ime raspodele</label>
            <input type="text" ngControl="divisionName" id="divisionName">
            <br/>
            

            <lablel>Courses</lablel>
            <select name="course" ngControl="course" *ngIf="courses != null">
                <option *ngFor="let course of courses" [value]="course.courseID">
                    {{course.name}}
                </option> 
            </select>
            <br/>
            
            <label>Početak važenja</label>
            <input type="text" ngControl="divisionBeginning" value="21.03.1995">
            <br/>
            
            <label>Kraj važenja</label>
            <input type="text" ngControl="divisionEnding" value="21.03.1996">
            
            <label>Divison type</label>
            <select name="divisionType" ngControl="divisionType">
                <option *ngFor="let typez of divisionTypes" [value]="typez.divisionTypeID">{{typez.type}}</option>
            </select>
        </fieldset>
        
        
        <fieldset ngControlGroup="secondPart">
            <select name="creationWay" ngControl="creationWay">
                <option value="on_x" selected>Podeli na X</option>
                <option value="with_x">Podeli da ima X</option>
                <option value="manual">Manuelno</option>
            </select>
            
            <input type="text" ngControl="x">
            
            <select name="studentsOrder" ngControl="studentsOrder">
                <option value="0" selected>po indeksu</option>
                <option value="1">nasumice</option>
            </select>
            
            <br/>
            
            <button type="button" (click)="getList(form.value)">Get list</button>
        </fieldset>
        
        <fieldset style="height: 300px;">
            <ul>
                <li *ngFor="let group of createdGroups; let i = index">{{i}}
                    <ul>
                        <li *ngFor="let student of group">{{student.name}}</li>
                    </ul>
                </li>
            </ul>            
        </fieldset>
        
        <button type="submit">Submit</button>
        {{departmentID}}
        <br/><br/>
        {{ createdGroups | json }}
    </form>
    `,
    directives: [R_STEPPER, R_INPUT, R_DROPDOWN],
    providers: [CoursesService, DivisionsService]
})

export class DivisionCreatorComponent implements AfterViewInit {

    courses: Course[];
    errorMessage: string;

    createdGroups: Array<Array<Student>>;
    divisionTypes: DivisionType;

    private _departmentID: number;

    @Input() set departmentID(departmentID: number) {
        this._departmentID = departmentID;
        this.getCoursesOfDepartment();
    }

    get departmentID(): number {
        return this._departmentID;
    }
    
    constructor(
        private _coursesService: CoursesService,
        private _divisionsService: DivisionsService
    ) { }

    ngAfterViewInit() {
        this.getCoursesOfDepartment();
        this.getAllDivisionTypes();
        console.log(this.divisionTypes);
    }

    getCoursesOfDepartment() {
        this._coursesService.getCoursesOfDepartment(this.departmentID)
            .then(
                crs => this.courses = crs,
                error => this.errorMessage = <any>error);
    }

    // Vraca listu studenata po grupama za prikaz kako ce se grupe napraviti kad se klikne na Submit
    getList(value) {
        console.log(value);
        console.log(+value.firstPart.course, +value.secondPart.x, +value.secondPart.studentsOrder);
        if (value.secondPart.creationWay == "with_x") {
            this._divisionsService.getGroupsWithX(+value.firstPart.course, +value.secondPart.x, +value.secondPart.studentsOrder)
                .then(groups => this.createdGroups = groups, error => this.errorMessage = <any>error);
        } else if (value.secondPart.creationWay == "on_x") {
            this._divisionsService.getGroupsOnX(+value.firstPart.course, +value.secondPart.x, +value.secondPart.studentsOrder)
                .then(groups => this.createdGroups = groups, error => this.errorMessage = <any>error);
        } else {
            // manual
        }
    }

    // Iz look-up tabele
    public getAllDivisionTypes() {
        this._divisionsService.getAllDivisionTypes()
            .then(type => this.divisionTypes = type, error => this.errorMessage = <any>error);
    }

    private getNamedGroups() {
        var ret: Array<any> = new Array<any>();
        debugger;
        for (let i = 0; i < this.createdGroups.length; i++) {
            ret[i] = {
                name: "Grupa " + i,
                students: this.createdGroups[i]
            };
        }
        console.log("Ret iz getNamedGroups");
        console.log(ret);
        return ret;
    }

    createInitialDivision(value) {
        this._divisionsService.createInitialDivision(
            value.firstPart.divisionName,
            this.departmentID,
            value.firstPart.course,
            value.firstPart.divisionType,
            value.firstPart.divisionBeginning,
            value.firstPart.divisionEnding,
            this.getNamedGroups()
        ).then(status => this.errorMessage = <any>status, error => this.errorMessage = <any>error);
    }

}
