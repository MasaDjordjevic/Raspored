import {Pipe, PipeTransform} from "angular2/core";

@Pipe({
    name: 'highlight',
})
export class HighlightPipe implements PipeTransform {
    transform(value: string, query: string) {

        ///*debugger;*/

        // Ako nista nije upisano kao query
        if (query == undefined || query == "" || query == null) {
            return value;
        }

        var s: string = "(" + query + ")";
        var regex = new RegExp(s, "gi");
        
        return value.replace(regex, "<mark>$1</mark>");
    }
}