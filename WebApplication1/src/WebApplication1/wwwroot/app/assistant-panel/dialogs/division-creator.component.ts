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
    template: `
    <r-stepper>
    
        <r-step stepTitle="Osnovni podaci">
            <form ngForm>
            
                <r-input
                    class="light-theme"
                    label="Ime raspodele"
                    [control]="divisionNameControl"
                    [required]="true">
                </r-input>
                
                <r-dropdown>
                    <r-dropdown-item default>Algoritmi i programiranje</r-dropdown-item>
                    <r-dropdown-item>Uvod u računarstvo</r-dropdown-item>
                    <r-dropdown-item>Digitalna elektronika</r-dropdown-item>
                </r-dropdown>
            
                <r-input
                    class="light-theme"
                    label="Početak važenja"
                    [control]="beginningControl"
                    [required]="true">
                </r-input>
            
                <r-input
                    class="light-theme"
                    label="Kraj važenja"
                    [control]="endControl"
                    [required]="true">
                </r-input>
                
            </form>
        </r-step>
        
        <r-step stepTitle="Način kreiranja">
            <p>Ovo je drugi korak.</p>
        </r-step>
        
        <r-step stepTitle="Finaliziranje">
            <p>Ovo je treci korak.</p>
        </r-step>
        
    </r-stepper>
    `,
    directives: [R_STEPPER, R_INPUT, R_DROPDOWN]
})

export class DivisionCreatorComponent {

    @Input() assistantId: number;
    
    divisionNameControl: Control;
    beginningControl: Control;
    endControl: Control;
    
    constructor() {
        this.divisionNameControl = new Control();
        this.beginningControl = new Control();
        this.endControl = new Control();
    }

}
