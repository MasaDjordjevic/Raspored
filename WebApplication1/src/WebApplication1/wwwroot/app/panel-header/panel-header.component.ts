import {Component, AfterContentInit, Input} from "angular2/core";
import {GlobalService} from "../services/global.service";




@Component({
    selector: 'r-panel-header',
    templateUrl: 'app/panel-header/panel-header.html',
    styleUrls: ['app/panel-header/panel-header.css'],
    providers: [GlobalService],
    directives: []
})

export class PanelHeaderComponent implements AfterContentInit {
    
    @Input() name: string;
    @Input() surname: string;
    @Input() address: string;
    @Input() email: string;
    @Input() avatarUrl: string;

    private themePickerOpened = false;
    private languagePickerOpened = false;

    @Input() showThemePicker: boolean = true;
    @Input() showLanguagePicker: boolean = true;
    
    constructor(
        private _globalService: GlobalService
    ) {
        
    }
    
    ngAfterContentInit() {
        
    }

}