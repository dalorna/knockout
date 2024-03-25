import {atomFamily, useRecoilValue} from 'recoil';
import {getSeasonWeeklySchedule} from '../api/nfl';

const nflSeasonFamily = atomFamily({
    key: 'nfl/season',
    default: async (year) => {
        try{
            return year && await getSeasonWeeklySchedule(year);
        } catch {
            return null;
        }
    }
}) 

export const useNFLSeason = (year) => {
    return  useRecoilValue(nflSeasonFamily(year))
}

export const useWeeklySchedule = (year, week) => {
    const nflSchedule = useNFLSeason(year);
    const weekly = Object.groupBy(nflSchedule.data.body, ({gameWeek}) => gameWeek);
    const weeklySchedule = Object.keys(weekly).map((key) => weekly[key]);
    return weeklySchedule[week - 1];
}
