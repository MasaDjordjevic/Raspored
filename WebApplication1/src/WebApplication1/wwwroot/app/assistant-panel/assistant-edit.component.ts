import {Component, OnInit} from "angular2/core";
import {CORE_DIRECTIVES} from "angular2/src/common/directives/core_directives";

// Services
import {AssistantService} from "../services/assistant.service";

// Models
import {Assistant} from "../models/assistant";

// UI
import {RInputText} from "../ui/r-input-text.component";

@Component({
    selector: "r-assistant-edit",
    templateUrl: "app/assistant-panel/assistant-edit.component.html",
    styleUrls:  ["app/assistant-panel/assistant-edit.css"],
    providers: [AssistantService],
    directives: [CORE_DIRECTIVES, RInputText],
})
export class AssistantEditComponent implements OnInit {
    oldAssistant: Assistant;
    newAssistant: Assistant;
    warningMessage: string = "";
    errorMessage: string = "";
    successMessage: string = "";
    _hasUnsavedChanges: boolean = false;

    constructor(private _service: AssistantService) {
        this.oldAssistant = this._service.getAssistantById(1);
        this.newAssistant = this.oldAssistant;
    }

    ngOnInit() {
        
    }

    onChangeAnything() {
        this._hasUnsavedChanges = true;
    }

    onApply() {
        this.normalize();
        if (!this.hasValidName()) {
            this.showError("Nepravilan unos imena.");
            return;
        } else if (!this.hasValidSurname) {
            this.showError("Nepravilan unos prezimena.");
            return;
        } else if (!this.hasValidAddress) {
            this.showError("Nepravilan unos kancelarije.");
            return;
        } else if (!this.hasValidEmail) {
            this.showError("Nepravilan unos mejl adrese.");
            return;
        } else {
            this.save();
            this.showSuccess("Uspešno sačuvano"); //TODO ne bas
            this.oldAssistant = this.newAssistant;
            this._hasUnsavedChanges = false;
        }
    }

    onCancel() {
        if (this._hasUnsavedChanges) {
            var confirmClose = confirm("Imate nesačuvane promene. Da li ste sigurni da želite da izadjete?");
            if (confirmClose) {
                this.closeDialog();
                return;
            } else {
                return;
            }
        }
    }

    onSave() {
        this.onApply();
        this.onCancel();
    }

    normalize() {
        // Sklanjamo sve okolne spejsove
        this.newAssistant.address = this.newAssistant.address.trim();
        this.newAssistant.email = this.newAssistant.email.trim();
        this.newAssistant.name = this.newAssistant.name.trim();
        this.newAssistant.surname = this.newAssistant.surname.trim();
        this.newAssistant.title = this.newAssistant.title.trim();
    }

    hasValidName() {
        return this.newAssistant.name != "";
    }

    hasValidSurname() {
        return this.newAssistant.surname != "";
    }

    hasValidAddress() {
        return this.newAssistant.address != "";
    }

    hasValidEmail() {
        return !!(this.newAssistant.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/g));
    }

    hasValidTitle() {
        return this.newAssistant.title != "";
    }

    clearAllErrors() {
        this.errorMessage = this.warningMessage = this.successMessage = "";
    }

    showError(errorMessage: string) {
        this.clearAllErrors();
        this.errorMessage = errorMessage;
    }

    showWarning(warningMessage: string) {
        this.clearAllErrors();
        this.warningMessage = warningMessage;
    }

    showSuccess(successMessage: string) {
        this.clearAllErrors();
        this.successMessage = successMessage;
    }

    save() {
        this._service.alter(this.newAssistant);
    }

    closeDialog() {
        alert('Close!');
    }
}