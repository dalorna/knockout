import {useCurrentPickLeagueSeasonWeek, useCurrentPickRefresh} from '../../state/picks';
import {useWeeklySchedule} from '../../state/nfl';
import {useForm} from 'react-hook-form';
import moment from 'moment';
import {useEffect, useRef} from 'react';
import {SavePickModal} from './SavePickModal';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {generateUUID} from '../../utils/helpers';
import {useUser} from '../../state/user';
import {useSeasonLeague, useTeams} from '../../state/season';

const validationSchema = yup.object().shape({
    pick: yup.string().required("must make a pick")
}).required()

const Picks = ({currentSelectedLeague}) => {
    // TODO: get Current Week and Year
    const week = 1;
    const year = '2023';
    const userId = useUser();
    // const season = useCurrentSeason(year);
    const selectedLeagueValue = JSON.parse(localStorage.getItem('selectedLeague'));
    const leagueSeason = useSeasonLeague(selectedLeagueValue._id);
    const currentWeeklyPick = useCurrentPickLeagueSeasonWeek(userId, leagueSeason[0].data._id, week);
    console.log('currentWeeklyPick: ', currentWeeklyPick);
    const refresher = useCurrentPickRefresh(userId, leagueSeason[0].data._id, week);
    const currentWeeklySchedule = useWeeklySchedule(year, week);
    const createModalRef = useRef();
    const teams = useTeams();
    
    const {
        register,
        handleSubmit,
        formState: { isValid},
        reset
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
           pick: currentWeeklyPick.data[0] ? currentWeeklyPick.data[0].teamId + '-' + currentWeeklyPick?.data[0].gameId : null
        },
        mode: 'onChange'
    })

    useEffect(() => {
        reset( {pick: currentWeeklyPick.data[0] ? currentWeeklyPick.data[0].teamId + '-' + currentWeeklyPick.data[0].gameId : null})
    }, [reset, currentWeeklyPick])
    
/*    const setDefault = () => {
        return currentWeeklyPick.data[0] ? currentWeeklyPick.data[0].teamId + '-' + currentWeeklyPick.data[0].gameId : null;
    }*/
    const handleOnSubmit = (data) => {
        const currentPickId = currentWeeklyPick.data[0]?._id;
        const pick = {
            id: currentPickId ?? generateUUID(),
            userId: userId,
            weekId: week,
            leagueSeasonId: leagueSeason[0].data._id,
            locked: false,
            gameId: data.pick.split('-')[1],
            teamId: data.pick.split('-')[0]
        };
        createModalRef.current.show(
            {
                pick: pick,
                week: currentWeeklySchedule.find(f => f.gameID === pick.gameId),
                teams: teams.data.body,
                currentPickId: currentPickId,
                selectedLeagueValue
            }
        )
    }

    const refreshPick = async () => {
        refresher();
    }

    const getSelectedTeamName = () => {
        if (currentWeeklyPick.data[0]?.teamId) {
            return teams.data.body.find(f => f.teamID === currentWeeklyPick.data[0]?.teamId)?.teamCity + ' ' + teams.data.body.find(f => f.teamID === currentWeeklyPick.data[0]?.teamId)?.teamName;
        } else {
            return 'has not been selected';
        }
    }
    
    return <>
        <div className="page container py-4 py-sm-5">
            <div className="mb-2 p-2 bg-primary text-white rounded text-center">
                <h2>Picks - {selectedLeagueValue.name}</h2>
            </div>
            <div className={`mb-1 p-3 bg-success shadow-sm rounded bg-white mx-3  ${currentWeeklyPick.data[0]?.locked ? 'text-success' : 'text-danger' }`} >
                {
                    `Current Pick for the week ${ week } is ${getSelectedTeamName()} ${currentWeeklyPick.data[0]?.locked ? 'Locked' : 'Not Locked'}`
                }
            </div>
            <form onSubmit={handleSubmit(handleOnSubmit)}>
                <div className="row p-2 shadow-sm rounded bg-white mx-3" style={{maxHeight: '47vh', overflow: 'auto'}}>
                    {
                        currentWeeklySchedule.map(game => {
                            return (
                                <div key={game.gameID} className="card">
                                    <div className="card-body">
                                        <div className="card-subtitle mb-2 text-muted">
                                            {
                                                `${game.away} vs ${game.home} ${moment(game.gameDate, "YYYYMMDD").format('MMM Do YYYY')}, @${game.gameTime}`
                                            }
                                        </div>
                                        <div className="card-text mb-2 text-muted">
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input" type="radio" {...register('pick')}
                                                       disabled={currentWeeklyPick.data[0]?.locked}
                                                       id="exampleRadios1" value={`${game.teamIDAway}-${game.gameID}`} />
                                                <label className="form-check-label"
                                                       htmlFor={`${game.teamIDAway}-${game.gameID}`}>
                                                    {
                                                        game.away
                                                    }
                                                </label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input" type="radio" {...register('pick')}
                                                       disabled={currentWeeklyPick.data[0]?.locked}
                                                       id="exampleRadios1" value={`${game.teamIDHome}-${game.gameID}`} />
                                                <label className="form-check-label"
                                                       htmlFor={`${game.teamIDHome}-${game.gameID}`}>
                                                    {
                                                        game.home
                                                    }
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="p-3 shadow-sm rounded bg-body-secondary mx-3 mt-5 text-end">
                    <button type="submit" className="btn btn-primary" aria-label="Save Pick" disabled={!isValid || currentWeeklyPick.data[0]?.locked}>
                        Save Pick
                    </button>
                </div>
            </form>
        </div>
        <SavePickModal actionRef={createModalRef} afterSubmit={refreshPick}/>
    </>
}
export default Picks;