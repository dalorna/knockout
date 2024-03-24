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