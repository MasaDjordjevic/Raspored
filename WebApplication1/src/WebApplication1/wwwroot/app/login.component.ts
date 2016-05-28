import {Component} from "angular2/core";
import {R_INPUT} from "./ui/r-input-text.component";
import {R_BUTTON} from "./ui/r-button.component";
import {Control} from "angular2/common";

@Component({
    selector: 'r-login',
    directives: [R_INPUT, R_BUTTON],
    template: `
        <div class="logo"></div>
        <form>
            <r-input class="light-theme" label="Korisničko ime" [control]="usernameControl"></r-input>
            <r-input class="light-theme" label="Šifra" [control]="passwordControl"></r-input>
            <div class="flex-spacer"></div>
            <div class="controls">
                <button r-button raised text="Prijava">Prijava</button>
            </div>
        </form>
    `,
    styleUrls: ['app/login.css'],
})
export class LoginComponent {

    usernameControl: Control;
    usernameControlValue$: any;

    passwordControl: Control;
    passwordControlValue$: any;

    constructor() {
        this.usernameControl = new Control();
        this.usernameControlValue$ = this.usernameControl.valueChanges;
        this.passwordControl = new Control();
        this.passwordControlValue$ = this.passwordControl.valueChanges;
    }
}