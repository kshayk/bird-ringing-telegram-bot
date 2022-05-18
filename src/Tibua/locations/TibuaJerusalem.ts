import {ITibua} from "../ITibua";
import type {dateRangeType, tibuaDayType} from "../TibuaTypes";

class TibuaJerusalem implements ITibua {
    getDates(range: dateRangeType): tibuaDayType[] {
        return [{ringer: "shay", date: new Date()}];
    }
}

export default TibuaJerusalem;