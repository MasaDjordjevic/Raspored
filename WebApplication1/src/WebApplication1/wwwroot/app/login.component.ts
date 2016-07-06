import {Component} from "angular2/core";
import {R_INPUT} from "./ui/r-input-text.component";
import {R_BUTTON} from "./ui/r-button.component";
import {Control} from "angular2/common";
import {LoginService} from "./services/login.service";
import {GlobalService} from "./services/global.service";

@Component({
    selector: 'r-login',
    directives: [R_INPUT, R_BUTTON],
    template:` 
    
        <button id="lang-picker" (click)="languagePickerOpened = !languagePickerOpened">
            <i class="fa fa-globe"></i>
        </button>
        <div class="dropdown language-dropdown" [class.hidden]="!languagePickerOpened">
            <div class="dropdown-item" (click)="language = 'en'; languagePickerOpened = false">
                <span class="language-name" [style.fontWeight]="_globalService.currentLanguage === 'en' ? 'bold' : 'normal'">English</span>
                <div class="flag" style="background-image: url('https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg')"></div>
            </div>
            <div class="dropdown-item" (click)="language = 'sr'; languagePickerOpened = false">
                <span class="language-name" [style.fontWeight]="_globalService.currentLanguage === 'sr' ? 'bold' : 'normal'">srpski</span>
                <div class="flag" style="background-image: url('https://upload.wikimedia.org/wikipedia/commons/f/ff/Flag_of_Serbia.svg')"></div>
            </div>
            <div class="dropdown-item" (click)="language = 'src'; languagePickerOpened = false">
                <span class="language-name" [style.fontWeight]="_globalService.currentLanguage === 'src' ? 'bold' : 'normal'">српски</span>
                <div class="flag" style="background-image: url('https://upload.wikimedia.org/wikipedia/commons/f/ff/Flag_of_Serbia.svg')"></div>
            </div>
            <div class="dropdown-item" (click)="language = 'eo'; languagePickerOpened = false">
                <span class="language-name" [style.fontWeight]="_globalService.currentLanguage === 'eo' ? 'bold' : 'normal'">Esperanto</span>
                <div class="flag" style="background-image: url('https://upload.wikimedia.org/wikipedia/commons/f/f5/Flag_of_Esperanto.svg'); background-position: 0% center"></div>
            </div>
            <div class="dropdown-item" (click)="language = 'es'; languagePickerOpened = false">
                <span class="language-name" [style.fontWeight]="_globalService.currentLanguage === 'es' ? 'bold' : 'normal'">español</span>
                <div class="flag" style="background-image: url('https://upload.wikimedia.org/wikipedia/en/9/9a/Flag_of_Spain.svg')"></div>
            </div>
            <div class="dropdown-item" (click)="language = 'de'; languagePickerOpened = false">
                <span class="language-name" [style.fontWeight]="_globalService.currentLanguage === 'de' ? 'bold' : 'normal'">deutsch</span>
                <div class="flag" style="background-image: url('https://upload.wikimedia.org/wikipedia/en/b/ba/Flag_of_Germany.svg')"></div>
            </div>
            <div class="dropdown-item" (click)="language = 'fr'; languagePickerOpened = false">
                <span class="language-name" [style.fontWeight]="_globalService.currentLanguage === 'fr' ? 'bold' : 'normal'">français</span>
                <div class="flag" style="background-image: url('https://upload.wikimedia.org/wikipedia/en/c/c3/Flag_of_France.svg')"></div>
            </div>
            <div class="dropdown-item" (click)="language = 'ja'; languagePickerOpened = false">
                <span class="language-name" [style.fontWeight]="_globalService.currentLanguage === 'ja' ? 'bold' : 'normal'">日本語</span>
                <div class="flag" style="background-image: url('https://upload.wikimedia.org/wikipedia/en/9/9e/Flag_of_Japan.svg')"></div>
            </div>
        </div>
        <div class="invisible-blackout" (click)="languagePickerOpened = false"></div>
    
        <div class="logo"></div>
        <form (submit)="login()">
            <r-input [label]="_globalService.translate('username')" [(val)]="username"
                     [primaryColor]="'MaterialRed'" [autofocus]="true"
            ></r-input>
            <r-input [label]="_globalService.translate('password')" [type]="'password'"
                     [(val)]="password" [primaryColor]="'MaterialRed'"
            ></r-input>
            <div class="flex-spacer"></div>
            <div class="controls">
                <button r-button raised [text]="_globalService.translate('login')" [primaryColor]="'MaterialRed'">{{_globalService.translate('login')}}</button>
            </div>
        </form>
        
        <div id="login-message" [class.shown]="showLoginMessage">
            <span>{{_globalService.translate('wrong_credentials')}}</span>
        </div>
    `,
    styleUrls: ['app/login.css'],
    providers: [LoginService]
})
export class LoginComponent {

    private languagePickerOpened: boolean = false;

    private loginMessage: string = "";
    private showLoginMessage: boolean = false;

    public _username: string = "";
    public _password : string = "";

    set username(u: string) {
        this._username = u;
        this.showLoginMessage = false;
    }

    get username() {
        return this._username;
    }

    set password(p: string) {
        this._password = p;
        this.showLoginMessage = false;
    }

    get password() {
        return this._password;
    }

    constructor(
        private _loginService: LoginService,
        private _globalService: GlobalService
    ) {
        // ako je vec ulogovan redirektuj ga
        this._loginService.loginRedirect()
            .then( res =>{
                console.log(res);
                if(res.status == "uspelo") {
                    window.location = res.url;
                }
            } );
    }

    login() {
        this._loginService.login(this.username, this.password)
            .then( res =>{
                console.log(res);
                if(res.status == "uspelo") {
                    window.location = res.url;
                } else if (res.status == "nije uspelo") {
                    if (res.message == "Wrong credentials") {
                        this.showLoginMessage = true;
                    }
                }
            } );
    }

    //region Language stuff
    private lang = this._globalService.currentLanguage;

    private _language: string;

    public get language() {
        return this._language;
    }

    public set language(lan) {
        this._language = lan;
        this._globalService.currentLanguage = lan;
    }
    //endregion
}