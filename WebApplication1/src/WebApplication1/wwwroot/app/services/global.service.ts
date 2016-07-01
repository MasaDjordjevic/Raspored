import {Injectable, EventEmitter} from "angular2/core";

@Injectable()
export class GlobalService {

    private cookies;

    constructor() {
        if (document.cookie) {
            this.cookies = document.cookie.split('; ').map(el => el.split('='));
            console.log(document.cookie);
            this.currentLanguage = this.getCookie("language");
        } else {
            this.currentLanguage = "en"; // default language
        }
    }

    getCookie(key: string) {
        return this.cookies.filter(el => el[0] == key)[0][1];
    }

    setCookie() {
        document.cookie = `language=${this.currentLanguage}`;
    }

    private _emitters:
        { [channel: string]: EventEmitter<any> } = {};

    get(channel: string): EventEmitter<any> {
        if (!this._emitters[channel])
            this._emitters[channel] = new EventEmitter();
        return this._emitters[channel]
    }

    //region Toast & Markdown parser
    public toast$: EventEmitter<any> = new EventEmitter<any>();

    public toast(message: string) {
        this.toast$.emit(GlobalService.parseMarkdown(message));
    }

    private static parseMarkdown(message) {
        let currentMode: '*' | '_' | '`' | '' = "";
        let output = "";
        for (var i = 0; i < message.length; i++) {
            switch (message[i]) {
                case "*":
                    if (currentMode === "*") {
                        output += "</strong>";
                        currentMode = "";
                    } else {
                        output += "<strong>";
                        currentMode = "*";
                    }
                    break;
                case "_":
                    if (currentMode === "_") {
                        output += "</em>";
                        currentMode = "";
                    } else {
                        output += "<em>";
                        currentMode = "_";
                    }
                    break;
                case "`":
                    if (currentMode === "`") {
                        output += "</code>";
                        currentMode = "";
                    } else {
                        output += "<code>";
                        currentMode = "`";
                    }
                    break;
                default:
                    output += message[i];
            }
        }
    return output;
};
    //endregion

    //region Themes for Assistant panel
    public static colorClassName(color):string {
        try {
            if (color.indexOf("Material") === 0) {
                // boja je data material kodom
                // sklanjamo "Material"
                return color.substring("Material".length).toLowerCase();
            } else if (color.indexOf("_") === 0) {
                // boja je iz neke palete
                // sklanjamo donju crtu
                return color.substring(1).toLowerCase();
            }
            return "blue";
        } catch (e) {
            console.warn("GlobalService, colorClassName", color)
        }
        return "blue";
    }
    //endregion

    //region Languages
    private _currentLanguage/* = "sr"*/;
    
    public set currentLanguage(language) {
        if (!language) {
            return;
        }
        this._currentLanguage = language.concat();
        this.setCookie();
    }

    public get currentLanguage() {
        return this._currentLanguage;
    }

    private _strings = {
        "copy_paste_template": {
            "en":  "NOT_TRANSLATED_YET",
            "sr":  "NOT_TRANSLATED_YET",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },

        "TEST_STRING": {
            "en":  "This sentence is a test.",
            "sr":  "Ova rečenica je test.",
            "src": "Ова реченица је тест.",
            "eo":  "Ĉi tiu frazo estas testo.",
            "es":  "Esta frase es una prueba.",
            "de":  "Dieser Satz ist ein Test.",
            "fr":  "Cette phrase est un test.",
            "ja":  "この文はテストです。",
        },

        // Naslovi stubaca
        "departments": {
            "en":  "Departments",
            "sr":  "Smerovi",
            "src": "Смерови",
            "eo":  "Fakoj",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "Fachbereiche",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "部門", // bunmon
        },
        "divisions": {
            "en":  "Divisions",
            "sr":  "Raspodele",
            "src": "Расподеле",
            "eo":  "Dividoj",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "Aufteilungen",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "分割", // bunkatsu
        },
        "groups": {
            "en":  "Groups",
            "sr":  "Grupe",
            "src": "Групе",
            "eo":  "Grupoj",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "Gruppen",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "グループ",
        },
        "students": {
            "en":  "Students",
            "sr":  "Studenti",
            "src": "Студенти",
            "eo":  "Studentoj",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "Studenten",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "学生",
        },

        // Departments
        "year": {
            "en":  "Year",
            "sr":  "Godina",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "Jaro",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "Jahre",
            "fr":  "Année",
            "ja":  "年",
        },
        "new_division": {
            "en":  "New division",
            "sr":  "Nova raspodela",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "Nova divido",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "Neue Abteilung",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "新しい分割",
        },
        "global_timetable": {
            "en":  "Global timetable",
            "sr":  "Globalni raspored",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "Tutstudenta horaro",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "Globale Zeitplan",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "グローバル時刻表", // guroobaru jigoku-hyou
        },

        // Groups
        "export_division": {
            "en":  "Export division",
            "sr":  "Izvezi raspodelu",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "Eksportu dividon",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "Exportieren Teilung",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "分割をエクスポート",
        },
        "delete_division": {
            "en":  "Delete division",
            "sr":  "Obriši raspodelu",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "Forviŝu dividon",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "Löschen Aufteilung",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        /*"copy_paste_template": {
            "en":  "NOT_TRANSLATED_YET",
            "sr":  "NOT_TRANSLATED_YET",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "copy_paste_template": {
            "en":  "NOT_TRANSLATED_YET",
            "sr":  "NOT_TRANSLATED_YET",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "copy_paste_template": {
            "en":  "NOT_TRANSLATED_YET",
            "sr":  "NOT_TRANSLATED_YET",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "copy_paste_template": {
            "en":  "NOT_TRANSLATED_YET",
            "sr":  "NOT_TRANSLATED_YET",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "copy_paste_template": {
            "en":  "NOT_TRANSLATED_YET",
            "sr":  "NOT_TRANSLATED_YET",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "copy_paste_template": {
            "en":  "NOT_TRANSLATED_YET",
            "sr":  "NOT_TRANSLATED_YET",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "copy_paste_template": {
            "en":  "NOT_TRANSLATED_YET",
            "sr":  "NOT_TRANSLATED_YET",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "copy_paste_template": {
            "en":  "NOT_TRANSLATED_YET",
            "sr":  "NOT_TRANSLATED_YET",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "copy_paste_template": {
            "en":  "NOT_TRANSLATED_YET",
            "sr":  "NOT_TRANSLATED_YET",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "copy_paste_template": {
            "en":  "NOT_TRANSLATED_YET",
            "sr":  "NOT_TRANSLATED_YET",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "copy_paste_template": {
            "en":  "NOT_TRANSLATED_YET",
            "sr":  "NOT_TRANSLATED_YET",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "copy_paste_template": {
            "en":  "NOT_TRANSLATED_YET",
            "sr":  "NOT_TRANSLATED_YET",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "copy_paste_template": {
            "en":  "NOT_TRANSLATED_YET",
            "sr":  "NOT_TRANSLATED_YET",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "copy_paste_template": {
            "en":  "NOT_TRANSLATED_YET",
            "sr":  "NOT_TRANSLATED_YET",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "copy_paste_template": {
            "en":  "NOT_TRANSLATED_YET",
            "sr":  "NOT_TRANSLATED_YET",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "copy_paste_template": {
            "en":  "NOT_TRANSLATED_YET",
            "sr":  "NOT_TRANSLATED_YET",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },*/

    };

    public translate(id): string {
        if (!this._strings[id]) {
            return "TRANSLATION ERROR";
        }
        return this._strings[id][this._currentLanguage];
    }
    //endregion

    //region Assistant Panel
    public refreshAssistantPanelAll$: EventEmitter<any> = new EventEmitter<any>();
    public refreshAssistantPanelAll() {
        this.refreshAssistantPanelAll$.emit({});
    }

    public refreshAssistantPanelMoveMinusOne$: EventEmitter<any> = new EventEmitter<any>();
    public refreshAssistantPanelMoveMinusOne() {
        this.refreshAssistantPanelMoveMinusOne$.emit({});
    }
    //endregion

    //region Student Panel
    public refreshStudentPanelPersonal$: EventEmitter<any> = new EventEmitter<any>();
    public refreshStudentPanelPersonal() {
        this.refreshStudentPanelPersonal$.emit({});
    }

    public refreshStudentPanelOfficial$: EventEmitter<any> = new EventEmitter<any>();
    public refreshStudentPanelOfficial() {
        this.refreshStudentPanelOfficial$.emit({});
    } 
    //endregion

}