import {Component, ElementRef} from "angular2/core";


/*
@Component({
    selector: 'dt[r-dt]',

})

export class RDtComponent {

}



@Component({
    selector: 'dd[r-dd]',

})

export class RDdComponent {

}
*/


@Component({
    selector: 'dl[r-dl]',
    template: '<ng-content></ng-content>',
    styleUrls: ['app/ui/r-dl.css']
})

export class RDlComponent {

}

export const R_DL = [RDlComponent/*, RDtComponent, RDdComponent*/];
