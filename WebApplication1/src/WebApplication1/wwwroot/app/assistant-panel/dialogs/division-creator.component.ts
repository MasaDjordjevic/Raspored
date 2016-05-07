import {Component, Input} from "angular2/core";
import {R_STEPPER} from "../../ui/r-stepper.component";
import {R_BUTTON} from "../../ui/r-button.component";
import {R_INPUT} from "../../ui/r-input-text.component";
import {R_DROPDOWN} from "../../ui/r-dropdown";
import {Control} from "angular2/common";

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
    <form #form="ngForm" (ngSubmit)="logForm(form.value)">
        
        <fieldset ngControlGroup="firstPart">
            <label for="divisionName">Ime raspodele</label>
            <input type="text" ngControl="divisionName" id="divisionName">
            <br/>
            
            <select name="class" ngControl="class">
                <option value="uur" selected>Uvod u računarstvo</option>
                <option value="de">Digitalna elektronika</option>
                <option value="aip">Algoritmi i programiranje</option>
            </select>
            <br/>
            
            <label>Početak važenja</label>
            <input type="text" ngControl="divisionBeginning">
            <br/>
            
            <label>Kraj važenja</label>
            <input type="text" ngControl="divisionEnding">
        </fieldset>
        
        <fieldset ngControlGroup="secondPart">
            <select name="creationWay" ngControl="creationWay">
                <option value="nax" selected>Podeli na X</option>
                <option value="daimax">Podeli da ima X</option>
                <option value="manual">Manuelno</option>
            </select>
        </fieldset>
        
        <button type="submit">Submit</button>
    </form>
    `,
    directives: [R_STEPPER, R_INPUT, R_DROPDOWN]
})

export class DivisionCreatorComponent {

    @Input() assistantId: number;
    
    constructor() {
    }

    logForm(value) {
        console.log(value);
    }

}
