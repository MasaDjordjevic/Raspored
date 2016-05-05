import {Pipe, PipeTransform} from "angular2/core";

@Pipe({
    name: 'prettyJson'
})

export class PrettyJsonPipe implements PipeTransform {

    transform(str: string): string {
        return str.replace(/("\w+")\s*:/g, "<span class=\"key\">$1:</span>");
    }
}