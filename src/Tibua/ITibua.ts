import type {tibuaDayType, dateRangeType} from './TibuaTypes';

export interface ITibua {
    getDates(range: dateRangeType): tibuaDayType[];
}