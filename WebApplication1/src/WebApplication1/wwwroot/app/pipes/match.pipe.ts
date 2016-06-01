import {Pipe, PipeTransform} from "angular2/core";

/**
 * Filtrira se niz ARR na osnovnu stringa STR.
 * Radi samo sa studentima.
 */

@Pipe({
    name: 'match'
})

export class MatchPipe implements PipeTransform {
    transform(arr: any[], str: string): any[] {
        if (arr == null || arr == undefined) {
            return arr;
        }

        // Ako je search query prazan
        if (!str) {
            return arr;
        }

        var regex = new RegExp(str, "gi");

        var ret1, ret2, ret3;
        try {
            ret1 = arr.filter(item => !!(item.UniMembers.name + " " + item.UniMembers.surname).match(regex));
            //ret2 = arr.filter(item => !!item.UniMembers.surname.match(regex));
            ret3 = arr.filter(item => !!item.indexNumber.toString().match(regex));
        } catch (e) {
            console.warn("exception");
        }

        // Unija... Prvo spojimo sve
        //var ret = ret1.concat(ret2.concat(ret3));
        var ret = ret1.concat(ret3);

        // ...pa onda obrisemo duplikate
        ret = ret.sort().filter(function(item, pos, ary) {
            return !pos || item != ary[pos-1];
        });

        return ret;
    }
}
