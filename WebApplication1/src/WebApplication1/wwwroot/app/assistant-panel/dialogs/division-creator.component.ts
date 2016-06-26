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
import {R_DL} from "../../ui/r-dl";

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
    template: `    
    <r-stepper (onSubmit)="createInitialDivision()" [primaryColor]="primaryColor">
    
        <r-step stepTitle="Osnovni podaci" [valid]="isValid(1)">
            <div class="osnovni-podaci">
        
                <div class="top">
                    <r-input [primaryColor]="primaryColor" class="light-theme" [(val)]="newDivisionName" label="Ime raspodele"></r-input>
                </div>
                
                <div class="left">
                    <r-dropdown [primaryColor]="primaryColor" *ngIf="courses" label="Predmet" [(val)]="newDivisionClassId">
                        <r-dropdown-item *ngFor="let course of courses" [value]="course.courseID">{{course.name}}</r-dropdown-item>
                    </r-dropdown>
                    
                    <r-dropdown [primaryColor]="primaryColor" *ngIf="divisionTypes" label="Vrsta raspodele" [(val)]="newDivisionTypeId">
                        <r-dropdown-item *ngFor="let typez of divisionTypes" [value]="typez.divisionTypeID">{{typez.type}}</r-dropdown-item>
                    </r-dropdown>
                </div>
                
                <div class="right">
                    <r-input [primaryColor]="primaryColor" class="light-theme" [(val)]="newDivisionBeginningDate" label="Početak važenja (YYYY-MM-DD)"></r-input>
                    
                    <r-input [primaryColor]="primaryColor" class="light-theme" [(val)]="newDivisionEndingDate" label="Kraj važenja (YYYY-MM-DD)"></r-input>
                </div>
                
            </div>
        </r-step>
        
        <r-step stepTitle="Način kreiranja" [valid]="isValid(2)"><div class="nacin-kreiranja">
        
            <div class="top">
                <div class="input-wrap">
                    <r-dropdown [primaryColor]="primaryColor" [(val)]="newDivisionCreationWay" label="Način kreiranja">
                        <r-dropdown-item value="on_x">Po broju grupa</r-dropdown-item>
                        <r-dropdown-item value="with_x">Po broju studenata</r-dropdown-item>
                        <r-dropdown-item value="manual">Ručno</r-dropdown-item>
                    </r-dropdown>
                </div>
                
                <div class="input-wrap">
                    <r-input
                        *ngIf="newDivisionCreationWay !== 'manual'"
                        class="light-theme"
                        [(val)]="newDivisionCreationNumberX"
                        [label]="newDivisionCreationWay === 'on_x' ? 'Broj grupa' : 'Broj studenata'"
                        [primaryColor]="primaryColor"
                    >    
                    </r-input>
                </div>
                
                <div class="input-wrap">
                    <r-dropdown [primaryColor]="primaryColor" *ngIf="newDivisionCreationWay !== 'manual'" [(val)]="newDivisionCreationOrderIsRandom" label="Način sortiranja">
                        <r-dropdown-item value="0" selected>Po broju indeksa</r-dropdown-item>
                        <r-dropdown-item value="1">Nasumično</r-dropdown-item>
                    </r-dropdown>
                </div>
                
                <button [primaryColor]="primaryColor" r-button raised [disabled]="false" (click)="getList(newDivisionClassId, newDivisionCreationWay, newDivisionCreationNumberX, newDivisionCreationOrderIsRandom, '')" text="Prikaz"></button>
            </div>                
            
            <div class="clearfix"></div>            
            
            <div class="info" *ngIf="createdGroups">
                Ukupno {{numberOfStudents()}} studenata može se podeliti u {{createdGroups.length}} grupa (prosečno {{averageNumberOfStudents().toFixed()}} studenata po grupi).
            </div>
            
            <div class="clearfix"></div>
     
            <div class="preview-list-of-students" *ngIf="createdGroups">
                <table>
                    <thead><tr><th>Ime</th><th>#</th><th>Studenti</th></tr></thead>
                    <tbody>
                        <tr *ngFor="let group of createdGroups; let i = index">
                            <td>Grupa&nbsp;{{i + 1}}</td>
                            <td>{{group.length}}</td>
                            <td>{{groupPreview(i, 4)}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="clearfix"></div>
            
        </div></r-step>
        
        <r-step stepTitle="Potvrda">
            <div class="potvrda" *ngIf="createdGroups">
            
                <div class="top">
                    <dl r-dl>
                        <dt>Ime</dt>
                        <dd>{{newDivisionName}}</dd>
                        <dt>Vrsta raspodele</dt>
                        <dd>{{newDivisionTypeName()}}</dd>
                        <dt>Za predmet</dt>
                        <dd>{{newDivisionClassName()}}</dd>
                        <dt>Važenje</dt>
                        <dd>{{newDivisionBeginningDateToDate().toISOString().slice(0, 10)}} — {{newDivisionEndingDateToDate().toISOString().slice(0, 10)}}</dd>
                    </dl>
                    
                    <dl r-dl>
                        <dt>Ukupno studenata</dt>
                        <dd>{{numberOfStudents()}}</dd>
                        <dt>Ukupno grupa</dt>
                        <dd>{{createdGroups.length}}</dd>
                        <dt>Prosečno studenata po grupi</dt>
                        <dd>{{averageNumberOfStudents().toFixed(2)}}</dd>
                        <dt>Način sortiranja</dt>
                        <dd>{{newDivisionCreationOrderName()}}</dd>
                    </dl>
                </div>
                
                <div class="bottom">
                    <div class="group-list" *ngFor="let group of createdGroups; let i = index">
                        <div class="group-name">Grupa {{i}}</div>
                        <div class="students">
                            <div class="student" *ngFor="let student of group">
                                <span>{{student.indexNumber}}</span>
                                <span>{{student.name}} {{student.surname}}</span>
                            </div>
                        </div>
                    </div>
                </div>      
                
            </div>
        </r-step>
        
    </r-stepper>
    `,
    styleUrls: ['app/assistant-panel/dialogs/division-creator.css'],
    directives: [R_STEPPER, R_INPUT, R_DROPDOWN, R_BUTTON, R_DL],
    providers: [CoursesService, DivisionsService]
})

export class DivisionCreatorComponent implements AfterViewInit {

    @Input() primaryColor: string = "MaterialRed";
    @Input() secondaryColor: string = "MaterialOrange";

    // Podaci o novoj raspodeli koja se kreira
    public newDivisionName: string;
    public newDivisionClassId: string;
    public newDivisionClassName = (id = this.newDivisionClassId) => this.courses.filter(i => i.courseID === +id)[0].name;
    public newDivisionBeginningDate: string;
    public newDivisionBeginningDateToDate = () => new Date(this.newDivisionBeginningDate);
    public newDivisionEndingDate: string;
    public newDivisionEndingDateToDate = () => new Date(this.newDivisionEndingDate);
    public newDivisionTypeId: string;
    public newDivisionTypeName = (id = this.newDivisionTypeId) => (<any>this.divisionTypes).filter(i => i.divisionTypeID == id)[0].type;

    public newDivisionCreationWay: 'on_x' | 'with_x' | 'manual';
    public newDivisionCreationNumberX: string;
    public newDivisionCreationOrderIsRandom: '0' | '1';
    public newDivisionCreationOrderName = (i = this.newDivisionCreationOrderIsRandom) => i === '0' ? 'po indeksu' : 'nasumično';

    // Validacije, read-only
    public get $$newDivisionName(): boolean {
        var ret: boolean = !!this.newDivisionName; // da ne bude null
        ret = ret && !!this.newDivisionName.trim().match(/.+/); // da ima bar jedno... nesto
        // stavio bih ja \w da bude alfanumericki znak ali onda ne gadja šđčćž, sto i nije problem jer sumnjam
        // da bi se raspodela (division) zvala iskljucivo od slova sa kvacicama, ali ajde neka ga ovako. ovako
        // moze da se zove sa tackom. moze i da bude srculence. mora probamo.
        return ret;
    }
    public get $$newDivisionClassId(): boolean {
        return true;
    }
    public get $$newDivisionTypeId(): boolean {
        return true;
    }
    public get $$newDivisionBeginningDate(): boolean {
        var ret: boolean = !!this.newDivisionBeginningDate;
        // godina mora 4, ostalo 1 ili 2. dozvoljava -, . ili / kao odvajanje izmedju brojki
        ret = ret && !!this.newDivisionBeginningDate.match(/\d{4}[-/\.]\d{1,2}[-/\.]\d{1,2}/);
        // mora da bude validan datum, da ne bude trinesti mesc ili 30. febuar
        ret = ret && new Date(this.newDivisionBeginningDate).toString() !== "Invalid Date";
        return !!ret;
    }
    public get $$newDivisionEndingDate(): boolean {
        var ret: boolean = !!this.newDivisionEndingDate;
        // godina mora 4, ostalo 1 ili 2. dozvoljava -, . ili / kao odvajanje izmedju brojki
        ret = ret && !!this.newDivisionEndingDate.match(/\d{4}[-/\.]\d{1,2}[-/\.]\d{1,2}/);
        // mora da bude validan datum, da ne bude trinesti mesc ili 30. febuar
        ret = ret && new Date(this.newDivisionEndingDate).toString() !== "Invalid Date";
        return !!ret;
    }

    public get $$newDivisionCreationWay(): boolean {
        return this.newDivisionCreationWay != "";
    }
    public get $$newDivisionCreationNumberX(): boolean {
        var ret: boolean = !!this.newDivisionCreationNumberX;
        ret = ret && !!this.newDivisionCreationNumberX.match(/^\d+$/); // integer
        return ret;
    }
    public get $$newDivisionCreationOrderIsRandom(): boolean {
        return this.newDivisionCreationOrderIsRandom != "";
    }

    // 0 se misli da je sve validno, zajedno
    // 1 - n su koraci od 1 do n
    // sve ostalo vraca false
    public isValid(i: number = 0) {

        switch(i) {
            case 1:
                return !!(this.$$newDivisionName && this.$$newDivisionClassId && this.$$newDivisionTypeId && this.$$newDivisionBeginningDate && this.$$newDivisionEndingDate);

            case 2:
                return !!(this.$$newDivisionCreationWay && this.$$newDivisionCreationNumberX && this.$$newDivisionCreationOrderIsRandom && !!this.createdGroups);

            case 3:
                return true; // nista se ne menja, samo pregled

            default:
                return false;

        }

    }

    courses: Course[];
    errorMessage: string;

    createdGroups: Array<Array<Student>>;
    divisionTypes: DivisionType;

    private _departmentID: number;

    @Input() set departmentID(departmentID: number) {
        this.resetAll();
        this._departmentID = departmentID;
        this.getCoursesOfDepartment();
    }

    get departmentID(): number {
        return this._departmentID;
    }
    
    constructor(
        private _coursesService: CoursesService,
        private _divisionsService: DivisionsService
    ) {
        this.resetAll();
    }

    private resetAll() {
        this.courses = null;
        this.createdGroups = null;
        this.errorMessage = null;
        this.newDivisionName = "default name";
        this.newDivisionClassId = null;
        this.newDivisionBeginningDate = "2016-05-04";
        this.newDivisionEndingDate = "2020-04-20";
        this.newDivisionTypeId = null;
        this.newDivisionCreationWay = null;
        this.newDivisionCreationNumberX = "12";
        this.newDivisionCreationOrderIsRandom = null;
    }

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

    /**
     * Vrati listu studenata po grupama za prikaz kako ce se grupe napraviti kada se klikne na Submit.
     * Dakle, ovo je za preview. Samo se čitaju studenti iz baze.
     *
     * @param courseId - ID kursa na osnovu kog treba uzeti studente.
     * @param creationWay - Način kreiranja raspodele.
     * @param numberX - Koliko grupa ili koliko studenata, u zavisnosti od creationWay.
     *                  Vrednost se ignorise ukoliko je creationWay postavljen na manual.
     * @param studentsOrder - 0 za redom i 1 za nasumice
     */
    getList(courseId: string, creationWay: 'on_x' | 'with_x' | 'manual', numberX: string, studentsOrder: '0' | '1'): any {
        console.log("Parametri:", courseId, creationWay, numberX, studentsOrder);
        if (creationWay === "with_x") {
            this._divisionsService.getGroupsWithX(+courseId, +numberX, +studentsOrder)
                .then(groups => this.createdGroups = groups, error => this.errorMessage = <any>error);
        } else if (creationWay === "on_x") {
            this._divisionsService.getGroupsOnX(+courseId, +numberX, +studentsOrder)
                .then(groups => this.createdGroups = groups, error => this.errorMessage = <any>error);
        } else {
            alert("Selektirano je manuelno. Nema liste za prikaz.");
            // manual
        }
    }

    // Iz look-up tabele
    public getAllDivisionTypes() {
        this._divisionsService.getAllDivisionTypes()
            .then(type => this.divisionTypes = type, error => this.errorMessage = <any>error);
    }

    private getNamedGroups() {
        var ret: Array<any> = [];
        for (let i = 0; i < this.createdGroups.length; i++) {
            ret[i] = {
                name: "Grupa " + (i + 1),
                students: this.createdGroups[i]
            };
        }
        return ret;
    }

    createInitialDivision() {
        /*debugger;*/
        console.log("Creating division...")
        this._divisionsService.createInitialDivision(
            this.newDivisionName,
            this.departmentID,
            +this.newDivisionClassId,
            +this.newDivisionTypeId,
            this.newDivisionBeginningDateToDate(),
            this.newDivisionEndingDateToDate(),
            this.getNamedGroups()
        ).then(status => this.errorMessage = <any>status, error => this.errorMessage = <any>error);
    }

    public numberOfStudents = () => this.createdGroups.map(s => s.length).reduce((p, c) => p + c);
    public averageNumberOfStudents = () => this.numberOfStudents() / this.createdGroups.length;

    public groupPreview = (i, n) => (this.createdGroups[i].slice(0, n).map(e => e.name + ' ' + e.surname + ' (' + e.indexNumber + ')').join(', ').concat('...'));

}
