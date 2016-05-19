import {Pipe, PipeTransform} from "angular2/core";

/**
 * Uklanja sve znake beline s početka i s kraja prosledjenog stringa.
 *
 * Nacin upotrebe:
 *   string | trim
 *
 * Primer:
 *   "    a b  c "
 *   formatira kao
 *   "a b  c"
 */

@Pipe({
    name: 'trim'
})

export class TrimPipe implements PipeTransform {
    transform(value: string): string {
        if (value == null || value == undefined) {
            return "";
        }
        return value.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    }
}
