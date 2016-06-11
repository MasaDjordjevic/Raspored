import {Injectable} from "angular2/core";

@Injectable()
export class GlobalService {

    public static colorClassName(color): string {
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
    }

    private _currentLanguage = "sr";
    
    public set currentLanguage(language) {
        //debugger;
        this._currentLanguage = language.concat();
    }

    public get currentLanguage() {
        //debugger;
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
        "departments": {
            "en":  "Departments",
            "sr":  "Smerovi",
            "src": "Смерови",
            "eo":  "Fakoj",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "Fachbereiche",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "部門",
        },
        "divisions": {
            "en":  "Divisions",
            "sr":  "Raspodele",
            "src": "Расподеле",
            "eo":  "Dividoj",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "Aufteilungen",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "分割",
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

    }

    public translate(id): string {
        if (!this._strings[id]) {
            return "TRANSLATION ERROR";
        }
        return this._strings[id][this._currentLanguage];
    }



}