import {Component} from "angular2/core";
import {R_INPUT} from "./ui/r-input-text.component";
import {R_BUTTON} from "./ui/r-button.component";
import {Control} from "angular2/common";
import {LoginService} from "./services/login.service";

@Component({
    selector: 'r-login',
    directives: [R_INPUT, R_BUTTON],
    template: `
        <div class="logo"></div>
        <form (submit)="login()">
            <r-input class="light-theme" label="Korisničko ime" [(val)]="username"></r-input>
            <r-input class="light-theme" label="Šifra" [(val)]="password"></r-input>
            <div class="flex-spacer"></div>
            <div class="controls">
                <button r-button raised text="Prijava">Prijava</button>
            </div>
        </form>
    `,
    styleUrls: ['app/login.css'],
    providers: [LoginService]
})
export class LoginComponent {

    username: string = "wlada";
    password : string = "wlada";

    constructor(private _loginService: LoginService) {
    }

    login() {
        this._loginService.login(this.username, this.password)
            .then( res =>{
                console.log(res);
                window.location = res.url;
            } );
    }
}