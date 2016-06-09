import {Pipe, PipeTransform} from "angular2/core";

/**
 * 1 => I
 * 2 => II
 * 4 => IV
 *
 * Radi za brojeve od 1 do 12, inače vrati isto nazad
 */

@Pipe({
    name: 'roman',
})
export class RomanNumeralsPipe implements PipeTransform {
    transform(value: string): string {
        switch(+value) {
            case 1:  return "I";
            case 2:  return "II";
            case 3:  return "III";
            case 4:  return "IV";
            case 5:  return "V";
            case 6:  return "VI";
            case 7:  return "VII";
            case 8:  return "VIII";
            case 9:  return "IX";
            case 10: return "X";
            case 11: return "XI";
            case 12: return "XII";
            default: return value;
        }
    }
}