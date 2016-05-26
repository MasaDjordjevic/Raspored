import {Pipe, PipeTransform} from "angular2/core";



@Pipe({
    name: 'toTimestamp'
})
export class ToTimestampPipe implements PipeTransform {
    transform(min: number) {
        let hour = Math.floor(min / 60).toString();
        if (hour.length != 2) hour = "0" + hour;
        let minute = (min % 60).toString();
        if (minute.length != 2) minute = "0" + minute;
        return hour + ":" + minute;
    }
}