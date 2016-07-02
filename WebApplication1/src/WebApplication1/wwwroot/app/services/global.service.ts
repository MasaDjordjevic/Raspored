import {Injectable, EventEmitter} from "angular2/core";

@Injectable()
export class GlobalService {

    //region Cookies
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
    //endregion cookies

    //region Associative array of emitters, should be removed TODO
    private _emitters:
        { [channel: string]: EventEmitter<any> } = {};

    get(channel: string): EventEmitter<any> {
        if (!this._emitters[channel])
            this._emitters[channel] = new EventEmitter();
        return this._emitters[channel]
    }
    //endregion

    //region Toast & Markdown parser
    // Sending a message
    public toast$: EventEmitter<any> = new EventEmitter<any>();
    public toast(message: string) {
        this.toast$.emit(GlobalService.parseMarkdown(message));
    }
    
    // Invoking a loading screen
    public toastLoading$: EventEmitter<any> = new EventEmitter<any>();
    public toastLoading() {
        alert("TODO");
        // TODO
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
            console.warn("GlobalService, colorClassName", color);
            debugger;
        }
        return "blue";
    }
    //endregion

    //region Languages
    //region Logic
    private _currentLanguage/* = "sr"*/;
    
    public set currentLanguage(language) {
        if (!language) {
            console.warn("Pokušaj izbora nepoznatog jezika.");
            debugger;
            return;
        }
        this._currentLanguage = language.concat(); // da bi se promenila referenca
        this.setCookie();
    }

    public get currentLanguage() {
        return this._currentLanguage;
    }

    public translate(id: string): string {
        if (!this._strings[id]) {
            console.warn(`Pokušaj prevođenja stringa "${id}". Takav string ne postoji u bazi prevoda.`);
            return "TRANSLATION ERROR";
        } else {
            if (this.currentLanguage == "src") {
                // automatsko prevodjenje iz latinice u cirilicu
                return this._strings[id]["src"] === "NOT_TRANSLATED_YET" ? this._strings[id]["sr"]
                    .replace(/nj/g, 'њ').replace(/lj/g, 'љ').replace(/dž/g, 'џ')
                    .replace(/a/g, 'а').replace(/e/g, 'е').replace(/l/g, 'л').replace(/s/g, 'с').replace(/c/g, 'ц')
                    .replace(/b/g, 'б').replace(/ž/g, 'ж').replace(/m/g, 'м').replace(/t/g, 'т').replace(/č/g, 'ч')
                    .replace(/v/g, 'в').replace(/z/g, 'з').replace(/n/g, 'н').replace(/ć/g, 'ћ').replace(/š/g, 'ш')
                    .replace(/g/g, 'г').replace(/i/g, 'и').replace(/o/g, 'о').replace(/u/g, 'у')
                    .replace(/d/g, 'д').replace(/j/g, 'ј').replace(/p/g, 'п').replace(/f/g, 'ф')
                    .replace(/đ/g, 'ђ').replace(/k/g, 'к').replace(/r/g, 'р').replace(/h/g, 'х')
                    .replace(/Nj/g, 'Њ').replace(/NJ/g, 'Њ')
                    .replace(/Lj/g, 'Љ').replace(/LJ/g, 'Љ')
                    .replace(/Dž/g, 'Џ').replace(/DŽ/g, 'Џ')
                    .replace(/A/g, 'А').replace(/E/g, 'Е').replace(/L/g, 'Л').replace(/S/g, 'С').replace(/C/g, 'Ц')
                    .replace(/B/g, 'Б').replace(/Ž/g, 'Ж').replace(/M/g, 'М').replace(/T/g, 'Т').replace(/Č/g, 'Ч')
                    .replace(/V/g, 'В').replace(/Z/g, 'З').replace(/N/g, 'Н').replace(/Ć/g, 'Ћ').replace(/Š/g, 'Ш')
                    .replace(/G/g, 'Г').replace(/I/g, 'И').replace(/O/g, 'О').replace(/U/g, 'У')
                    .replace(/D/g, 'Д').replace(/J/g, 'Ј').replace(/P/g, 'П').replace(/F/g, 'Ф')
                    .replace(/Đ/g, 'Ђ').replace(/K/g, 'К').replace(/R/g, 'Р').replace(/H/g, 'Х')  :
                        this._strings[id]["src"];
            } else {
                return this._strings[id][this._currentLanguage];
            }
        }
    }
    //endregion

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

        //region Naslovi stubaca
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
            "ja":  "学生", // gakusei
        },
        //endregion
        
        //region Opcije
        //region Department
        "id": {
            "en":  "ID",
            "sr":  "ID",
            "src": "ID",
            "eo":  "ID",
            "es":  "ID",
            "de":  "ID",
            "fr":  "ID",
            "ja":  "ID",
        },
        "json": {
            "en":  "JSON",
            "sr":  "JSON",
            "src": "JSON",
            "eo":  "JSON",
            "es":  "JSON",
            "de":  "JSON",
            "fr":  "JSON",
            "ja":  "JSON",
        },
        "JSON": {
            "en":  "JSON",
            "sr":  "JSON",
            "src": "JSON",
            "eo":  "JSON",
            "es":  "JSON",
            "de":  "JSON",
            "fr":  "JSON",
            "ja":  "JSON",
        },
        "duration": {
            "en":  "Duration",
            "sr":  "Trajanje",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "group_creator": {
            "en":  "Group creator",
            "sr":  "Osnivač grupe",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        //endregion
        //region Division
        "division_edit": {
            "en":  "Edit division",
            "sr":  "Izmeni raspodelu",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "new_group": {
            "en":  "New group",
            "sr":  "Nova groupa",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "copy_division": {
            "en":  "Copy division",
            "sr":  "Kopiraj raspodelu",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        //endregion
        //region Group
        "group_edit": {
            "en":  "Edit group",
            "sr":  "Izmeni grupu",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "combined_timetable": {
            "en":  "Combined timetable",
            "sr":  "Kombinovani raspored",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        //endregion
        //region Student
        "remove_student__1": {
            "en":  "Remove",
            "sr":  "Ukloni studenta",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "remove_student__2": {
            "en":  "with index number",
            "sr":  "sa brojem indeksa",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "remove_student__3": {
            "en":  "from group",
            "sr":  "iz grupe",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "remove_student__4": {
            "en":  "?",
            "sr":  "?",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "move_to_group": {
            "en":  "Move to other group",
            "sr":  "Pomeri u drugu grupu",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "index_number": {
            "en":  "Index number",
            "sr":  "Broj indeksa",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        //endregion
        //endregion
        
        //region Departments
        "year": {
            "en":  "Year",
            "sr":  "Godina",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "Jaro",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "Jahre",
            "fr":  "Année",
            "ja":  "年", // sen/toshi
        },
        "new_division": {
            "en":  "New division",
            "sr":  "Nova raspodela",
            "src": "Нова расподела",
            "eo":  "Nova divido",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "Neue Abteilung",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "新しい分割", // atarashii bunkatsu
        },
        "global_timetable": {
            "en":  "Global timetable",
            "sr":  "Globalni raspored",
            "src": "Глобални распоред",
            "eo":  "Tutstudenta horaro",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "Globale Zeitplan",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "グローバル時刻表", // guroobaru jigoku-hyou
        },
        //endregion 

        //region Groups
        "export_division": {
            "en":  "Export division",
            "sr":  "Izvezi raspodelu",
            "src": "Извези расподелу",
            "eo":  "Eksportu dividon",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "Exportieren Teilung",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "分割をエクスポート", // bunkatsu o ekusupooto
        },
        "delete_division": {
            "en":  "Delete division",
            "sr":  "Obriši raspodelu",
            "src": "Обриши расподелу",
            "eo":  "Forviŝu dividon",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "Löschen Aufteilung",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "delete_division__1": {
            "en":  "Delete division ",
            "sr":  "Obriši raspodelu ",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "delete_division__2": {
            "en":  "?",
            "sr":  "?",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        //endregion

        //region General stuff
        "type": {
            "en":  "Type",
            "sr":  "Vrsta",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "time": {
            "en":  "Time",
            "sr":  "Vreme",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "back": {
            "en":  "Back",
            "sr":  "Nazad",
            "src": "Назад",
            "eo":  "Reiru",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "Geh zurück",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "戻る", // modoru
        },
        "next": {
            "en":  "Next",
            "sr":  "Dalje",
            "src": "Даље",
            "eo":  "Pliu",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "Weiter",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "次へ", // tsugi e
        },
        "cancel": {
            "en":  "Cancel",
            "sr":  "Odustani",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "save_changes": {
            "en":  "Save changes",
            "sr":  "Sačuvaj izmene",
            "src": "Сачувај измене",
            "eo":  "Savu ŝanĝojn",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "Änderungen speichern",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "変更内容を保存", // henkou naiyou o hozon
        },
        "reset": {
            "en":  "Reset",
            "sr":  "Resetuj",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "copy": {
            "en":  "Copy",
            "sr":  "Kopiraj",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "delete": {
            "en":  "Delete",
            "sr":  "Obriši",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        //endregion

        //region Toast common messages
        "error": {
            "en":  "An error occurred.",
            "sr":  "Došlo je do greške.",
            "src": "Дошло је до грешке.",
            "eo":  "Eraro okazis.",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "Ein Fehler ist aufgetreten.",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "エラーが発生しました。",
        },
        //endregion

        //region Cancel class
        "canceling_class_scheduled_for__1":
        {
            "en":  "Canceling class scheduled for",
            "sr":  "Otkazuje se čas zakazan za",
            "src": "Отказује се час заказан за",
            "eo":  "Nuligas klason enhorarigita por",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "Abbrechen Klasse für",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "canceling_class_scheduled_for__2": {
            "en":  "",
            "sr":  "",
            "src": "",
            "eo":  "",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "geplant",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "title": {
            "en":  "Title",
            "sr":  "Naslov",
            "src": "Наслов",
            "eo":  "Titolo",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "Titel",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "タイトル",
        },
        "cancel_class": {
            "en":  "Cancel class",
            "sr":  "Otkaži čas",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "Nuligu klason",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "クラスをキャンセル",
        },
        "class_successfully_canceled": {
            "en":  "Class successfully canceled",
            "sr":  "Čas uspešno otkazan.",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "class_is_already_canceled": {
            "en":  "Class is already canceled.",
            "sr":  "Čas je već otkazan.",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "class_not_canceled": {
            "en":  "Class not canceled.",
            "sr":  "Nije otkazan čas.",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        //endregion
        
        //region Division Creator
        "basic_info": {
            "en":  "Basic info",
            "sr":  "Osnovni podaci",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "creation_way": {
            "en":  "Creation way",
            "sr":  "Način kreiranja",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "confirm": {
            "en":  "Confirm",
            "sr":  "Potvrda",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "division_name": {
            "en":  "Division name",
            "sr":  "Ime raspodele",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "subject": {
            "en":  "Subject",
            "sr":  "Predmet",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "validity": {
            "en":  "Validity",
            "sr":  "Važenje",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "validity_start": {
            "en":  "Validity start",
            "sr":  "Početak važenja",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "validity_end": {
            "en":  "Validity end",
            "sr":  "Kraj važenja",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "division_type": {
            "en":  "Division type",
            "sr":  "Vrsta raspodele",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "number_of_groups": {
            "en":  "Number of groups",
            "sr":  "Broj grupa",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "number_of_students": {
            "en":  "Number of students",
            "sr":  "Broj studenata",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "by_number_of_groups": {
            "en":  "By number of groups",
            "sr":  "Po broju grupa",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "by_number_of_students": {
            "en":  "By number of students",
            "sr":  "Po broju studenata",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "manual": {
            "en":  "Manual",
            "sr":  "Ručno",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "sort_style": {
            "en":  "Sort style",
            "sr":  "Način sortiranja",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "by_index_number": {
            "en":  "By index number",
            "sr":  "Po broju indeksa",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "random": {
            "en":  "Random",
            "sr":  "Nasumično",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "preview": {
            "en":  "Preview",
            "sr":  "Prikaz",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "division_creator_preview_info__1": {
            "en":  "A total of",
            "sr":  "Ukupno",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "division_creator_preview_info__2": {
            "en":  "students can be divided into",
            "sr":  "studenata se može podeliti u",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "division_creator_preview_info__3": {
            "en":  "groups (average",
            "sr":  "grupa (prosečno",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "division_creator_preview_info__4": {
            "en":  "students per group).",
            "sr":  "studenata po grupi).",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "name": {
            "en":  "Name",
            "sr":  "Ime",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "group": {
            "en":  "Group",
            "sr":  "Grupa",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "Grupo",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "for_subject": {
            "en":  "For subject",
            "sr":  "Za predmet",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "total_students": {
            "en":  "Total students",
            "sr":  "Ukupno studenata",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "total_groups": {
            "en":  "Total groups",
            "sr":  "Ukupno grupa",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "average_students_per_group": {
            "en":  "Average students per group",
            "sr":  "Prosečno studenata po grupi",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "selected_manual_no_list_to_display": {
            "en":  "Selected 'manual'. No list to display.",
            "sr":  "Selektirano je 'ručno'. Nema liste za prikaz.",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "successfully_created_division__1": {
            "en":  "Successfully created division ",
            "sr":  "Uspešno kreirana raspodela ",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "successfully_created_division__2": {
            "en":  ".",
            "sr":  ".",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "division_not_created": {
            "en":  "Division not created.",
            "sr":  "Nije kreirana raspodela.",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        //endregion
        
        //region Division Edit
        "successfully_edited_division__1": {
            "en":  "Successfully edited division",
            "sr":  "Uspešno izmenjana raspodela",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "successfully_edited_division__2": {
            "en":  ".",
            "sr":  ".",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "group_not_edited": {
            "en":  "Group not edited.",
            "sr":  "Grupa nije izmenjena.",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        //endregion

        //region Group Add Activity
        "add_announcement": {
            "en":  "Add announcement",
            "sr":  "Dodaj obaveštenje",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "successfully_added_announcement": {
            "en":  "Successfully added announcement.",
            "sr":  "Uspešno dodato obaveštenje.",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "announcement_not_added": {
            "en":  "Announcement not added.",
            "sr":  "Nije dodato obaveštenje.",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "adding_announcement_for_class__1": {
            "en":  "Adding announcement for class scheduled for",
            "sr":  "Dodajem obaveštenje za čas koji treba da bude održan",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "adding_announcement_for_class__2": {
            "en":  "",
            "sr":  "",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        //endregion

        //region Group Edit
        "group_name": {
            "en":  "Group name",
            "sr":  "Ime grupe",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "classroom": {
            "en":  "Classroom",
            "sr":  "Učionica",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "assistant": {
            "en":  "Assistant",
            "sr":  "Asistent",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "all_assistants": {
            "en":  "All assistants",
            "sr":  "Svi asistenti",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "every_week": {
            "en":  "Every week",
            "sr":  "Svake nedelje",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "every_second_week": {
            "en":  "Every second week",
            "sr":  "Svake druge nedelje",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "every_fourth_week": {
            "en":  "Every fourth week",
            "sr":  "Svake četvrte nedelje",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "just_once": {
            "en":  "Just once",
            "sr":  "Samo jednom",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "period": {
            "en":  "Period",
            "sr":  "Perioda",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "Periodo",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "ピリオド", // piriodo
        },
        "day_of_week": {
            "en":  "Day of week",
            "sr":  "Dan u nedelji",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "monday": {
            "en":  "Monday",
            "sr":  "Ponedeljak",
            "src": "Понедељак",
            "eo":  "Lundo",
            "es":  "Lunes",
            "de":  "Montag",
            "fr":  "Lundi",
            "ja":  "月曜日",
        },
        "tuesday": {
            "en":  "Tuesday",
            "sr":  "Utorak",
            "src": "Уторак",
            "eo":  "Mardo",
            "es":  "Martes",
            "de":  "Dienstag",
            "fr":  "Mardi",
            "ja":  "火曜日",
        },
        "wednesday": {
            "en":  "Wednesday",
            "sr":  "Sreda",
            "src": "Среда",
            "eo":  "Merkredo",
            "es":  "Miércoles",
            "de":  "Mittwoch",
            "fr":  "Mercredi",
            "ja":  "水曜日",
        },
        "thursday": {
            "en":  "Thursday",
            "sr":  "Četvrtak",
            "src": "Четвртак",
            "eo":  "Ĵaŭdo",
            "es":  "Jueves",
            "de":  "Donnerstag",
            "fr":  "Juedi",
            "ja":  "木曜日",
        },
        "friday": {
            "en":  "Friday",
            "sr":  "Petak",
            "src": "Петак",
            "eo":  "Vendredo",
            "es":  "Viernes",
            "de":  "Freitag",
            "fr":  "Vendredi",
            "ja":  "金曜日",
        },
        "saturday": {
            "en":  "Saturday",
            "sr":  "Subota",
            "src": "Субота",
            "eo":  "Sabato",
            "es":  "Sábado",
            "de":  "Samstag",
            "fr":  "Samedi",
            "ja":  "土曜日",
        },
        "sunday": {
            "en":  "Sunday",
            "sr":  "Nedelja",
            "src": "Недеља",
            "eo":  "Dimanĉo",
            "es":  "Domingo",
            "de":  "Sonntag",
            "fr":  "Dimanche",
            "ja":  "日曜日",
        },
        "monday__acc": {
            "en":  "Monday",
            "sr":  "ponedeljak",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "tuesday__acc": {
            "en":  "Tuesday",
            "sr":  "utorak",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "wednesday__acc": {
            "en":  "Wednesday",
            "sr":  "sredu",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "thursday__acc": {
            "en":  "Thursday",
            "sr":  "četvrtak",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "friday__acc": {
            "en":  "Friday",
            "sr":  "petak",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "saturday__acc": {
            "en":  "Saturday",
            "sr":  "subotu",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "sunday__acc": {
            "en":  "Sunday",
            "sr":  "nedelju",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "first": {
            "sr":  "prvi",
            "en":  "First",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "second": {
            "sr":  "drugi",
            "en":  "Second",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "fourth": {
            "sr":  "četvrti",
            "en":  "Third",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "first__acc": {
            "en":  "first",
            "sr":  "prve",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "second__acc": {
            "en":  "second",
            "sr":  "druge",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "third__acc": {
            "en":  "fourth",
            "sr":  "četvrte",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        // Svake ""/"druge"/"četvrte" nedelje u "ponedeljak"/"utorak"/.../"nedelju" od 00:00 do 23:59.
        "duration_descriptive_string__1": {
            "en":  "Every ",
            "sr":  "Svake ",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "duration_descriptive_string__2": {
            "en":  " week on ",
            "sr":  " nedelje u ",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "duration_descriptive_string__3": {
            "en":  " from ",
            "sr":  " od ",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "duration_descriptive_string__4": {
            "en":  " to ",
            "sr":  " do ",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "beginning": {
            "en":  "Beginning",
            "sr":  "Početak",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "ending": {
            "en":  "Ending",
            "sr":  "Kraj",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "to_group": {
            "en":  "To group",
            "sr":  "Ubaci u grupu",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "out_of_group": {
            "en":  "Out of group",
            "sr":  "Izbaci iz grupe",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "this_group": {
            "en":  "This group",
            "sr":  "Ova grupa",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "others": { // ostali studenti koji nisu u toj grupi
            "en":  "Others",
            "sr":  "Ostali",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "successfully_edited_group__1": {
            "en":  "Successfully edited group",
            "sr":  "Uspešno izmenjena grupa",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "successfully_edited_group__2": {
            "en":  ".",
            "sr":  ".",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        //endregion
        
        //region Mass Edit
        "successfully_edited_groups_from_division__1": {
            "en":  "Successfully edited groups from division ",
            "sr":  "Uspešno promenjene grupe raspodele ",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "successfully_edited_groups_from_division__2": {
            "en":  ".",
            "sr":  ".",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "mass_edit_unsuccessful": {
            "en":  "Mass edit of groups was not successful.",
            "sr":  "Nije uspelo menjanje grupa raspodele.",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        //endregion

        //region Student Move To Group
        "move": {
            "en":  "Move",
            "sr":  "Prebaci",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "student_is_currently_in_group__1": {
            "en":  "Student is currently in group",
            "sr":  "Student se trenutno nalazi u grupi",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "student_is_currently_in_group__2": {
            "en":  ".",
            "sr":  ".",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "student_successfully_moved": {
            "en":  "Student successfully moved.",
            "sr":  "Student uspešno prebačen.",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "student_not_moved": {
            "en":  "Student not moved.",
            "sr":  "Student nije prebačen.",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        //endregion
        
        //region Uncancel class
        "undo_cancel": {
            "en":  "Undo cancel",
            "sr":  "Opozovi otkazivanje",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "undo_cancel_class_for__1": {
            "en":  "Undo canceling class for",
            "sr":  "Opozivanje otkazivanja časa za",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "undo_cancel_class_for__2": {
            "en":  ".",
            "sr":  ".",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        //endregion

        //region Copy Division
        "successfully_copied_division__1": {
            "en":  "Successfully copied division",
            "sr":  "Uspešno kopirana raspodela",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "successfully_copied_division__2": {
            "en":  ".",
            "sr":  ".",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "division_not_copied": {
            "en":  "Division not copied.",
            "sr":  "Nije kopirana raspodela.",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        //endregion

        //region Delete Division
        "successfully_deleted_division__1": {
            "en":  "Successfully deleted division",
            "sr":  "Uspešno obrisana raspodela",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "successfully_deleted_division__2": {
            "en":  ".",
            "sr":  ".",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "division_not_deleted__1": {
            "en":  "Division",
            "sr":  "Raspodela",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "division_not_deleted__2": {
            "en":  " not deleted.",
            "sr":  " nije obrisana.",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        //endregion

        //region Export division (csv)
        "copy_successful": {
            "en":  "Copied to clipboard.",
            "sr":  "Iskopirano.",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "copy_unsuccessful": {
            "en":  "Copy to cplipboard not successful.",
            "sr":  "Kopiranje nije uspelo.",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        //endregion
        
        //region Delete Group
        "group_delete_successful__1": {
            "en":  "Successfully deleted group",
            "sr":  "Uspešno obrisana grupa",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "group_delete_successful__2": {
            "en":  ".",
            "sr":  ".",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "group_delete_unsuccessful__1": {
            "en":  "Deleting group",
            "sr":  "Nije uspelo brisanje grupe",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "group_delete_unsuccessful__2": {
            "en":  " did not complete successfully.",
            "sr":  ".",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "delete_group__1": {
            "en":  "Delete group ",
            "sr":  "Obriši groupu ",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "delete_group__2": {
            "en":  "?",
            "sr":  "?",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "delete_group": {
            "en":  "Delete group",
            "sr":  "Obriši grupu",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        //endregion
        
        //region Kick student
        "student_kick_successful": {
            "en":  "Student successfully kicked out of the group.",
            "sr":  "Student uspešno izbačen iz grupe.",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "student_kick_unsuccessful": {
            "en":  "Student was not kicked out of the group.",
            "sr":  "Student nije izbačen iz grupe.",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "kick_student": {
            "en":  "Kick student",
            "sr":  "Izbaci iz grupe",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "kick": {
            "en":  "Kick",
            "sr":  "Ukloni",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        //endregion

        //region Bulletin Board
        "no_ads": {
            "en":  "No ads. You can write your own.",
            "sr":  "Nema oglasa. Možes da ubaciš svoj.",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "adding_ad_successful": {
            "en":  "Successfully added ad.",
            "sr":  "Uspešno dodat oglas.",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "adding_ad_unsuccessful": {
            "en":  "Add not added.",
            "sr":  "Oglas nije dodat.",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "add_ad": {
            "en":  "Add ad",
            "sr":  "Dodaj oglas",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "edit_ad": {
            "en":  "Edit ad",
            "sr":  "Izmeni oglas",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "pick_advertise_period": {
            "en":  "Which period do you want to advertise?",
            "sr":  "Koji termin oglašavaš?",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "choose_ad": {
            "en":  "Pick an ad",
            "sr":  "Izaberi oglas",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "exchange": {
            "en":  "Exchange",
            "sr":  "Zameni se",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        //endregion
        
        //region Add Task
        "add_task_successful": {
            "en":  "Task added successfully.",
            "sr":  "Uspešno dodat zadatak",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "add_task_unsuccessful": {
            "en":  "Task not added.",
            "sr":  "Zadatak nije dodat.",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "adding_task_for_class__1": {
            "en":  "Adding task for class scheduled for ",
            "sr":  "Dodavanje zadatka za čas zakazan za ",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "adding_task_for_class__2": {
            "en":  "",
            "sr":  "",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "add_task": {
            "en":  "Add task",
            "sr":  "Dodaj zadatak",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "place": {
            "en":  "Place",
            "sr":  "Mesto",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        //endregion
        
        //region Timetable
        "official": {
            "en":  "Official",
            "sr":  "Zvanični",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "personal": {
            "en":  "Personal",
            "sr":  "Lični",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "global": {
            "en":  "Global",
            "sr":  "Globalni",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "class_hidden": {
            "en":  "Class hidden.",
            "sr":  "Sakriven čas.",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "add_to_personal": {
            "en":  "Add to personal",
            "sr":  "Dodaj u lični",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "class_added_to_personal_successful": {
            "en":  "Class successfully added to personal timetable.",
            "sr":  "Čas uspešno dodat u lični raspored.",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "class_added_to_personal_unsuccessful": {
            "en":  "Class not added to personal timetable.",
            "sr":  "Čas nije dodat u licňi raspored.",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "class_already_in_personal": {
            "en":  "Class is already in personal timetable.",
            "sr":  "Čas je već u ličnom rasporedu.",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "in": { // in classroom
            "en":  "in",
            "sr":  "u",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "announcements": {
            "en":  "Announcements",
            "sr":  "Obaveštenja",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "delete_activity": {
            "en":  "Delete activity",
            "sr":  "Obriši aktivnost",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "hide_class": {
            "en":  "Hide class",
            "sr":  "Sakrij čas",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "bulletin_board": {
            "en":  "Bulletin board",
            "sr":  "Oglasna tabla",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "no_announcements__1": { // podeljeno zbog lajnbrejka
            "en":  "No announcements",
            "sr":  "Trenutno nema",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        "no_announcements__2": {
            "en":  "at the moment",
            "sr":  "obaveštenja",
            "src": "NOT_TRANSLATED_YET",
            "eo":  "NOT_TRANSLATED_YET",
            "es":  "NOT_TRANSLATED_YET",
            "de":  "NOT_TRANSLATED_YET",
            "fr":  "NOT_TRANSLATED_YET",
            "ja":  "NOT_TRANSLATED_YET",
        },
        //endregion

    };
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