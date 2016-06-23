export class TimeSpan {
    startDate: Date;
    endDate: Date;
    period: number;

    public static getDetailed(ts) {
        var returnValue = {};
        if (ts.period == 0) return returnValue;

        var start = new Date(ts.startDate);
        var end = new Date(ts.endDate);
        returnValue.dayOfWeek = start.getDay();
        returnValue.timeStart = TimeSpan.toStr(start.getHours()) + ":" + TimeSpan.toStr(start.getMinutes());
        returnValue.timeEnd = TimeSpan.toStr(end.getHours()) + ":" + TimeSpan.toStr(end.getMinutes());
        return returnValue;
    }

    public static toStr(num) {
        var str = num.toString();
        if(str.length > 1) {
            return str;
        } else {
            return "0" + str;
        }

    }

}