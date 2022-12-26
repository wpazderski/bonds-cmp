import { Duration } from "./bonds/Types";





export class Utils {
    
    static getDurationMonths(duration: Duration): number {
        switch (duration.unit) {
            case "m":
                return duration.num;
            case "y":
                return duration.num * 12;
        }
    }
    
    static getDurationYears(duration: Duration): number {
        switch (duration.unit) {
            case "m":
                return duration.num / 12;
            case "y":
                return duration.num;
        }
    }
    
    static formatDuration(duration: Duration): string {
        let years: number = 0;
        let months: number = 0;
        if (duration.unit === "m") {
            years = Math.floor(duration.num / 12);
            months = duration.num % 12;
        }
        else {
            years = duration.num;
            months = 0;
        }
        const yearsStr = years > 0 ? `${years}y` : "";
        const monthsStr = months > 0 ? `${months}m` : "";
        const str = (yearsStr + " " + monthsStr).trim();
        return str.length > 0 ? str : "0y";
    }
    
}
